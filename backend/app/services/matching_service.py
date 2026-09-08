"""
Matching service — rule-based candidate ↔ job matching.

Calculates a 0–100 match score based on skill keyword overlap between
the user's profile skills and the job title + description text.

Future enhancement: add semantic layer using sentence-transformers
all-MiniLM-L6-v2 when the library is available.
"""
from __future__ import annotations

def calculate_match_score(profile_skills: list[str], job: dict) -> int:
    """
    Return an integer 0–100 representing how well the candidate's skills
    match the given job.

    Scoring strategy
    ----------------
    - Each matched skill contributes equally, up to a maximum of 100.
    - The searchable text includes job title, description, and tags.
    - Score is capped at 100.
    """
    if not profile_skills:
        return 0

    searchable = " ".join(
        filter(
            None,
            [
                job.get("title", ""),
                job.get("description", ""),
                " ".join(job.get("tags", [])),
                job.get("about", ""),
            ],
        )
    ).lower()

    if not searchable:
        return 0

    matched = sum(1 for skill in profile_skills if skill.lower() in searchable)
    # Each matched skill worth (100 / total_skills) points, capped at 100
    raw_score = (matched / len(profile_skills)) * 100
    return min(100, round(raw_score))


def enrich_jobs_with_scores(profile_skills: list[str], jobs: list[dict]) -> list[dict]:
    """
    Add a `matchScore` field to every job dict in-place and return the list
    sorted by match score descending.
    """
    for job in jobs:
        job["matchScore"] = calculate_match_score(profile_skills, job)
    return sorted(jobs, key=lambda j: j["matchScore"], reverse=True)
