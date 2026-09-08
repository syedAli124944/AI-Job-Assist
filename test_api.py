# -*- coding: utf-8 -*-
"""
Integration test suite for the AI Job Search Assistant backend.
Runs against the live Docker stack (http://localhost:8000).

Tests:
  1.  Health check
  2.  User registration
  3.  User login + JWT token
  4.  Fetch dashboard stats (auth required)
  5.  Fetch notifications (auth required)
  6.  Fetch jobs (auth required, Adzuna + fallback)
  7.  Job sync endpoint (auth required)
  8.  Local job search (auth required)
  9.  Create job application (auth required)
  10. Fetch applications (auth required)
  11. Update application status (auth required)
  12. Delete application (auth required)
  13. AI cover letter generation (auth + OpenAI)
  14. AI job summary generation (auth + OpenAI)
  15. Agent job-search-workflow (auth + full pipeline)

Usage:
    python test_api.py
"""
import sys
import time
import uuid
import io
import requests
import sys

# Force UTF-8 output on Windows terminals
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE_URL = "http://localhost:8000"

# ── Colours ──────────────────────────────────────────────────────────────────
GREEN = "\033[92m"
RED   = "\033[91m"
YELLOW= "\033[93m"
RESET = "\033[0m"
BOLD  = "\033[1m"

passed = 0
failed = 0
warned = 0


def ok(msg):
    global passed
    passed += 1
    print(f"  {GREEN}✓{RESET} {msg}")


def fail(msg, detail=""):
    global failed
    failed += 1
    extra = f" — {detail}" if detail else ""
    print(f"  {RED}✗{RESET} {msg}{extra}")


def warn(msg, detail=""):
    global warned
    warned += 1
    extra = f" — {detail}" if detail else ""
    print(f"  {YELLOW}⚠{RESET} {msg}{extra}")


def section(title):
    print(f"\n{BOLD}{'-'*60}{RESET}")
    print(f"{BOLD}  {title}{RESET}")
    print(f"{BOLD}{'-'*60}{RESET}")


def wait_for_backend(retries=12, delay=5):
    """Poll the health endpoint until the backend is ready."""
    for i in range(retries):
        try:
            r = requests.get(f"{BASE_URL}/health", timeout=5)
            if r.status_code == 200:
                return True
        except requests.exceptions.ConnectionError:
            pass
        print(f"  Waiting for backend... ({i+1}/{retries})")
        time.sleep(delay)
    return False


# ── MAIN ─────────────────────────────────────────────────────────────────────

section("0 · Backend Readiness")
if not wait_for_backend():
    print(f"{RED}Backend is not reachable. Is Docker running?{RESET}")
    sys.exit(1)
ok("Backend is up at http://localhost:8000")

# ── Unique user for this test run ────────────────────────────────────────────
suffix = uuid.uuid4().hex[:8]
EMAIL = f"test_{suffix}@example.com"
PASSWORD = "TestPass123!"
token = None
app_id = None


# ─────────────────────────────────────────────────────────────────────────────
section("1 · Auth — Register & Login")

r = requests.post(f"{BASE_URL}/auth/register", json={"email": EMAIL, "password": PASSWORD})
if r.status_code == 201:
    ok(f"Register → 201 ({EMAIL})")
elif r.status_code == 200:
    ok(f"Register → 200 ({EMAIL})")
else:
    fail("Register", f"HTTP {r.status_code}: {r.text[:200]}")

r = requests.post(f"{BASE_URL}/auth/login", json={"email": EMAIL, "password": PASSWORD})
if r.status_code == 200 and "access_token" in r.json():
    token = r.json()["access_token"]
    ok("Login → 200, JWT received")
else:
    fail("Login", f"HTTP {r.status_code}: {r.text[:200]}")

if not token:
    print(f"{RED}Cannot continue without a token. Aborting.{RESET}")
    sys.exit(1)

AUTH = {"Authorization": f"Bearer {token}"}


# ─────────────────────────────────────────────────────────────────────────────
section("2 · Dashboard & Notifications")

r = requests.get(f"{BASE_URL}/dashboard/stats", headers=AUTH)
if r.status_code == 200:
    ok(f"Dashboard stats → {r.json()}")
else:
    fail("Dashboard stats", f"HTTP {r.status_code}")

r = requests.get(f"{BASE_URL}/notifications", headers=AUTH)
if r.status_code == 200 and isinstance(r.json(), list):
    ok(f"Notifications → {len(r.json())} items")
else:
    fail("Notifications", f"HTTP {r.status_code}")


# ─────────────────────────────────────────────────────────────────────────────
section("3 · Jobs — Browse, Sync, Search")

r = requests.get(f"{BASE_URL}/jobs", headers=AUTH, params={"q": "python", "page": 1}, timeout=20)
if r.status_code == 200 and isinstance(r.json(), list):
    ok(f"GET /jobs → {len(r.json())} jobs returned (Adzuna or cached)")
elif r.status_code == 200:
    warn("GET /jobs → 200 but unexpected shape", str(r.json())[:100])
else:
    warn("GET /jobs → non-200 (provider may be rate-limited)", f"HTTP {r.status_code}")

r = requests.post(f"{BASE_URL}/jobs/sync", headers=AUTH,
                  params={"query": "python developer", "pages": 1}, timeout=30)
if r.status_code == 200:
    j = r.json()
    ok(f"POST /jobs/sync → fetched={j.get('fetched',0)}, inserted={j.get('inserted',0)}, updated={j.get('updated',0)}")
else:
    warn("POST /jobs/sync", f"HTTP {r.status_code}: {r.text[:200]}")

r = requests.get(f"{BASE_URL}/jobs/search", headers=AUTH, params={"q": "python"}, timeout=10)
if r.status_code == 200 and isinstance(r.json(), list):
    ok(f"GET /jobs/search → {len(r.json())} jobs from local cache")
else:
    warn("GET /jobs/search", f"HTTP {r.status_code}")


# ─────────────────────────────────────────────────────────────────────────────
section("4 · Applications — CRUD")

r = requests.post(
    f"{BASE_URL}/applications",
    headers=AUTH,
    json={
        "job_id": "test-job-001",
        "job_title": "Backend Engineer",
        "company": "TestCorp",
        "location": "Remote",
        "job_url": "https://example.com/jobs/1",
    },
)
if r.status_code in (200, 201):
    app_id = r.json().get("id")
    ok(f"POST /applications → {app_id}")
else:
    fail("POST /applications", f"HTTP {r.status_code}: {r.text[:200]}")

r = requests.get(f"{BASE_URL}/applications", headers=AUTH)
if r.status_code == 200 and isinstance(r.json(), list):
    ok(f"GET /applications → {len(r.json())} applications")
else:
    fail("GET /applications", f"HTTP {r.status_code}")

if app_id:
    r = requests.patch(f"{BASE_URL}/applications/{app_id}/status", headers=AUTH,
                       json={"status": "Interview"})
    if r.status_code == 200:
        ok(f"PATCH /applications/{app_id}/status → interview")
    else:
        fail(f"PATCH status", f"HTTP {r.status_code}: {r.text[:200]}")

    r = requests.delete(f"{BASE_URL}/applications/{app_id}", headers=AUTH)
    if r.status_code in (200, 204):
        ok(f"DELETE /applications/{app_id} → cleaned up")
    else:
        fail("DELETE /applications", f"HTTP {r.status_code}")


# ─────────────────────────────────────────────────────────────────────────────
section("5 · AI Endpoints")

sample_job = {
    "id": "ai-test-001",
    "title": "Senior Python Engineer",
    "company": "AI Corp",
    "description": "We need a Python expert with FastAPI and PostgreSQL experience.",
    "location": "Remote",
}

r = requests.post(f"{BASE_URL}/ai/job-summary", headers=AUTH,
                  json={"job": sample_job}, timeout=30)
if r.status_code == 200 and r.json().get("summary"):
    ok(f"POST /ai/job-summary → {len(r.json()['summary'])} chars")
elif r.status_code in (503, 502):
    warn("POST /ai/job-summary", f"HTTP {r.status_code} — API key absent or quota exhausted")
else:
    fail("POST /ai/job-summary", f"HTTP {r.status_code}: {r.text[:300]}")

r = requests.post(f"{BASE_URL}/ai/cover-letter", headers=AUTH,
                  json={"job": sample_job, "resume_text": "Python developer with 5 years experience."}, timeout=30)
if r.status_code == 200 and r.json().get("coverLetter"):
    ok(f"POST /ai/cover-letter → {len(r.json()['coverLetter'])} chars")
elif r.status_code in (503, 502):
    warn("POST /ai/cover-letter", f"HTTP {r.status_code} — API key absent or quota exhausted")
else:
    fail("POST /ai/cover-letter", f"HTTP {r.status_code}: {r.text[:300]}")

r = requests.post(f"{BASE_URL}/ai/email", headers=AUTH,
                  json={"job": sample_job, "resume_text": "Python developer."}, timeout=30)
if r.status_code == 200 and r.json().get("email"):
    ok(f"POST /ai/email → {len(r.json()['email'])} chars")
elif r.status_code in (503, 502):
    warn("POST /ai/email", "API key absent or quota exhausted")
else:
    fail("POST /ai/email", f"HTTP {r.status_code}: {r.text[:300]}")

r = requests.post(f"{BASE_URL}/ai/followup", headers=AUTH,
                  json={"job": sample_job, "application_date": "2024-01-15"}, timeout=30)
if r.status_code == 200 and r.json().get("followUp"):
    ok(f"POST /ai/followup → {len(r.json()['followUp'])} chars")
elif r.status_code in (503, 502):
    warn("POST /ai/followup", "API key absent or quota exhausted")
else:
    fail("POST /ai/followup", f"HTTP {r.status_code}: {r.text[:300]}")


# ─────────────────────────────────────────────────────────────────────────────
section("6 · Agent Workflow")

r = requests.post(
    f"{BASE_URL}/agents/job-search-workflow",
    headers=AUTH,
    json={"preferences": {"role": "python developer", "skills": ["Python", "FastAPI"]}},
    timeout=40,
)
if r.status_code == 200:
    j = r.json()
    ok(f"POST /agents/job-search-workflow → {len(j.get('rankedJobs', []))} jobs ranked")
    if j.get("coverLetter"):
        ok(f"  Draft cover letter generated ({len(j['coverLetter'])} chars)")
    if j.get("error"):
        warn("  Agent reported error", j["error"])
else:
    fail("POST /agents/job-search-workflow", f"HTTP {r.status_code}: {r.text[:300]}")


# ─────────────────────────────────────────────────────────────────────────────
section("7 · Profile & Notification cleanup check")

r = requests.get(f"{BASE_URL}/notifications", headers=AUTH)
if r.status_code == 200:
    items = r.json()
    ok(f"Notifications after all operations → {len(items)} total (auto-generated)")
else:
    fail("Final notifications check", f"HTTP {r.status_code}")

r = requests.get(f"{BASE_URL}/profile/preferences", headers=AUTH)
if r.status_code in (200, 404):
    ok(f"GET /profile/preferences → HTTP {r.status_code}")
else:
    fail("GET /profile/preferences", f"HTTP {r.status_code}")


# ─────────────────────────────────────────────────────────────────────────────
print(f"\n{'='*60}")
total = passed + failed + warned
print(f"{BOLD}Results: {GREEN}{passed} passed{RESET}  {RED}{failed} failed{RESET}  {YELLOW}{warned} warnings{RESET}  ({total} total){RESET}")
print(f"{'='*60}\n")

if failed > 0:
    sys.exit(1)
