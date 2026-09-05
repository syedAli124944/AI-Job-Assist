from fastapi import APIRouter
from pydantic import BaseModel

from app.agents.graph import run_job_search_workflow

router = APIRouter(prefix="/agents", tags=["agents"])


class JobSearchRequest(BaseModel):
    candidate_id: str
    preferences: dict = {}


@router.post("/job-search-workflow")
def job_search_workflow(payload: JobSearchRequest):
    """Runs the full discover -> analyze -> rank -> prepare LangGraph workflow."""
    result = run_job_search_workflow(payload.candidate_id, payload.preferences)
    return result
