from app.agents.state import JobSearchState


def rank_node(state: JobSearchState) -> JobSearchState:
    """Step 3: score each job against the candidate profile.
    Replace this naive length-based score with the real matching service."""
    ranked = []
    for job in state.get("analyzed_jobs", []):
        score = len(job.get("keywords", []))
        ranked.append({**job, "score": score})
    ranked.sort(key=lambda j: j["score"], reverse=True)
    top_job = ranked[0] if ranked else None
    return {**state, "ranked_jobs": ranked, "top_job": top_job}
