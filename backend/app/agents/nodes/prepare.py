from app.agents.state import JobSearchState
from app.agents.tools import generate_cover_letter


def prepare_node(state: JobSearchState) -> JobSearchState:
    """Step 4: generate a draft cover letter for the top-ranked job."""
    top_job = state.get("top_job")
    if not top_job:
        return {**state, "error": "No suitable job found to prepare an application for."}
    letter = generate_cover_letter(state.get("candidate_id", ""), top_job)
    return {**state, "cover_letter": letter}
