"""
Shared state that flows through every node in the graph.
Matches the workflow in Section 9 / Day 11 of the project doc:
discover -> filter/analyze -> rank -> prepare
"""
from typing import TypedDict


class JobSearchState(TypedDict, total=False):
    candidate_id: str
    preferences: dict          # preferred roles, locations, etc.
    raw_jobs: list[dict]       # unfiltered results from the job API
    analyzed_jobs: list[dict]  # jobs with extracted skills/keywords
    ranked_jobs: list[dict]    # jobs with match score + reasons
    top_job: dict | None       # the job selected for application prep
    cover_letter: str | None
    error: str | None
