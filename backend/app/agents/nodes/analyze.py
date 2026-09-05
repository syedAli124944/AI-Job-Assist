from app.agents.state import JobSearchState
from app.agents.tools import extract_keywords


def analyze_node(state: JobSearchState) -> JobSearchState:
    """Step 2: extract skills/keywords from each job description."""
    analyzed = []
    for job in state.get("raw_jobs", []):
        keywords = extract_keywords(job.get("description", ""))
        analyzed.append({**job, "keywords": keywords})
    return {**state, "analyzed_jobs": analyzed}
