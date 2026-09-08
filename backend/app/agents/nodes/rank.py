from app.agents.state import JobSearchState
from app.services.matching_service import calculate_match_score


def rank_node(state: JobSearchState) -> JobSearchState:
    """Step 3: score each job against the candidate's profile skills using
    the real skill-overlap matching service (0–100 scale)."""
    candidate_skills: list[str] = state.get("preferences", {}).get("skills", [])

    ranked = []
    for job in state.get("analyzed_jobs", []):
        # Use real matching if we have profile skills; fall back to keyword count
        if candidate_skills:
            score = calculate_match_score(candidate_skills, job)
        else:
            score = len(job.get("keywords", [])) * 10  # rough proxy: 10pts per matched keyword

        ranked.append({**job, "score": score})

    ranked.sort(key=lambda j: j["score"], reverse=True)
    top_job = ranked[0] if ranked else None
    return {**state, "ranked_jobs": ranked, "top_job": top_job}
