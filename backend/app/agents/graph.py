"""
The controlled orchestration workflow from Section 9 / Day 11:
discover -> analyze -> rank -> prepare

Import `run_job_search_workflow` from wherever you need to trigger this
(e.g. an endpoint in app/api/agents.py).
"""
from langgraph.graph import END, StateGraph

from app.agents.nodes.analyze import analyze_node
from app.agents.nodes.discover import discover_node
from app.agents.nodes.prepare import prepare_node
from app.agents.nodes.rank import rank_node
from app.agents.state import JobSearchState


def build_graph():
    graph = StateGraph(JobSearchState)

    graph.add_node("discover", discover_node)
    graph.add_node("analyze", analyze_node)
    graph.add_node("rank", rank_node)
    graph.add_node("prepare", prepare_node)

    graph.set_entry_point("discover")
    graph.add_edge("discover", "analyze")
    graph.add_edge("analyze", "rank")
    graph.add_edge("rank", "prepare")
    graph.add_edge("prepare", END)

    return graph.compile()


# Compiled once at import time and reused across requests.
job_search_graph = build_graph()


def run_job_search_workflow(candidate_id: str, preferences: dict) -> JobSearchState:
    initial_state: JobSearchState = {
        "candidate_id": candidate_id,
        "preferences": preferences,
    }
    return job_search_graph.invoke(initial_state)
