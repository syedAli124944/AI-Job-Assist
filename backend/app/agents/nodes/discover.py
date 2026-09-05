from app.agents.state import JobSearchState
from app.agents.tools import search_jobs


def discover_node(state: JobSearchState) -> JobSearchState:
    """Step 1: fetch raw job listings based on candidate preferences."""
    jobs = search_jobs(state.get("preferences", {}))
    return {**state, "raw_jobs": jobs}
