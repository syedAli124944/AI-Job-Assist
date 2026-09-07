import io
import uuid
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.db.base import Base
from app.db.session import engine

client = TestClient(app)


@pytest.fixture(scope="session", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield


def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}


def test_auth_flow():
    unique_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    password = "TestPassword123!"

    # 1. Register
    reg_res = client.post("/auth/register", json={"email": unique_email, "password": password})
    assert reg_res.status_code == 201
    data = reg_res.json()
    assert data["email"] == unique_email
    assert "id" in data

    # 2. Login
    login_res = client.post("/auth/login", json={"email": unique_email, "password": password})
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    assert token

    headers = {"Authorization": f"Bearer {token}"}

    # 3. Get /auth/me
    me_res = client.get("/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == unique_email


def test_profile_and_dashboard():
    unique_email = f"profile_test_{uuid.uuid4().hex[:8]}@example.com"
    password = "TestPassword123!"

    reg_res = client.post("/auth/register", json={"email": unique_email, "password": password})
    assert reg_res.status_code == 201

    login_res = client.post("/auth/login", json={"email": unique_email, "password": password})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Save preferences
    pref_payload = {
        "targetRoles": ["Frontend Engineer", "Full Stack Developer"],
        "skills": ["React", "JavaScript", "TypeScript"],
        "locations": ["Remote", "New York"],
        "workTypes": ["Full-time"],
        "minSalary": 90000,
    }
    pref_res = client.post("/profile/preferences", json=pref_payload, headers=headers)
    assert pref_res.status_code == 200
    assert pref_res.json()["success"] is True

    # Get preferences
    get_pref_res = client.get("/profile/preferences", headers=headers)
    assert get_pref_res.status_code == 200
    prefs = get_pref_res.json()
    assert "React" in prefs["skills"]
    assert prefs["minSalary"] == 90000

    # Check dashboard stats
    stats_res = client.get("/dashboard/stats", headers=headers)
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert stats["applied"] == 0
    assert stats["profileCompletion"] == 95


def test_applications_crud():
    unique_email = f"apps_test_{uuid.uuid4().hex[:8]}@example.com"
    password = "TestPassword123!"

    client.post("/auth/register", json={"email": unique_email, "password": password})
    login_res = client.post("/auth/login", json={"email": unique_email, "password": password})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create application
    app_data = {
        "job_id": "job-123",
        "job_title": "Senior Python Developer",
        "company": "Tech Corp",
        "location": "Remote",
        "job_url": "https://example.com/job-123",
    }
    create_res = client.post("/applications", json=app_data, headers=headers)
    assert create_res.status_code == 201
    created = create_res.json()
    app_id = created["id"]
    assert created["status"] == "Applied"
    assert created["company"] == "Tech Corp"

    # List applications
    list_res = client.get("/applications", headers=headers)
    assert list_res.status_code == 200
    apps = list_res.json()
    assert len(apps) == 1
    assert apps[0]["id"] == app_id

    # Update status to Interview
    patch_res = client.patch(f"/applications/{app_id}/status", json={"status": "Interview"}, headers=headers)
    assert patch_res.status_code == 200
    assert patch_res.json()["status"] == "Interview"

    # Verify notification was generated
    notif_res = client.get("/notifications", headers=headers)
    assert notif_res.status_code == 200
    notifs = notif_res.json()
    assert len(notifs) >= 1
    assert any("Interview" in n["message"] for n in notifs)

    # Delete application
    del_res = client.delete(f"/applications/{app_id}", headers=headers)
    assert del_res.status_code == 204

    # Verify it was deleted
    list_after = client.get("/applications", headers=headers)
    assert len(list_after.json()) == 0


def test_resume_upload():
    unique_email = f"resume_test_{uuid.uuid4().hex[:8]}@example.com"
    password = "TestPassword123!"

    client.post("/auth/register", json={"email": unique_email, "password": password})
    login_res = client.post("/auth/login", json={"email": unique_email, "password": password})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    sample_resume_text = (
        "John Doe\n"
        "Senior Software Engineer\n"
        "Skills: Python, FastAPI, Docker, PostgreSQL, React, TypeScript, Git\n"
        "Experience: 5 years building web applications and scalable backends.\n"
    )
    file_bytes = io.BytesIO(sample_resume_text.encode("utf-8"))

    upload_res = client.post(
        "/resume/upload",
        files={"file": ("resume.txt", file_bytes, "text/plain")},
        headers=headers,
    )
    assert upload_res.status_code == 200
    data = upload_res.json()
    assert "skills" in data
    assert any(s.lower() == "python" for s in data["skills"])
    assert "parsed_profile" in data


def test_jobs_search_and_sync():
    unique_email = f"jobs_test_{uuid.uuid4().hex[:8]}@example.com"
    password = "TestPassword123!"

    client.post("/auth/register", json={"email": unique_email, "password": password})
    login_res = client.post("/auth/login", json={"email": unique_email, "password": password})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Test GET /jobs/search
    search_res = client.get("/jobs/search?q=developer", headers=headers)
    assert search_res.status_code == 200
    assert isinstance(search_res.json(), list)

    # Test GET /jobs
    list_res = client.get("/jobs?q=engineer", headers=headers)
    assert list_res.status_code == 200
    assert isinstance(list_res.json(), list)


def test_ai_endpoints():
    unique_email = f"ai_test_{uuid.uuid4().hex[:8]}@example.com"
    password = "TestPassword123!"

    client.post("/auth/register", json={"email": unique_email, "password": password})
    login_res = client.post("/auth/login", json={"email": unique_email, "password": password})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    job_mock = {
        "id": "1",
        "title": "Software Engineer",
        "company": "Tech Corp",
        "description": "Develop high-scale web apps using Python and React.",
    }

    # Test that unauthorized access is rejected
    unauth_res = client.post("/ai/job-summary", json={"job": job_mock})
    assert unauth_res.status_code in (401, 403)

    # Test with auth — either succeeds (200) if API key is valid or returns 502/503 gracefully
    summary_res = client.post("/ai/job-summary", json={"job": job_mock}, headers=headers)
    assert summary_res.status_code in (200, 502, 503)

    followup_res = client.post(
        "/ai/followup",
        json={"job": job_mock, "application_date": "2026-09-01"},
        headers=headers,
    )
    assert followup_res.status_code in (200, 502, 503)

