"""
Agent workflow endpoint.

POST /agents/job-search-workflow — runs the full discover → analyze → rank → prepare
LangGraph workflow for a candidate and returns ranked jobs + a draft cover letter.
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.agents.graph import run_job_search_workflow
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/agents", tags=["agents"])


class JobSearchRequest(BaseModel):
    preferences: dict = {}


@router.post("/job-search-workflow")
def job_search_workflow(
    payload: JobSearchRequest,
    current_user: User = Depends(get_current_user),
):
    """
    Runs the full discover → analyze → rank → prepare LangGraph workflow.
    Uses the authenticated user's ID so the agent can load their profile.
    Returns ranked_jobs and a draft cover_letter for the top match.
    """
    result = run_job_search_workflow(str(current_user.id), payload.preferences)
    return {
        "rankedJobs": result.get("ranked_jobs", []),
        "topJob": result.get("top_job"),
        "coverLetter": result.get("cover_letter"),
        "error": result.get("error"),
    }
