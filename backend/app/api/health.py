from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
def health_check():
    """Simple liveness check — used by Docker/monitoring, and Day 1 of the plan."""
    return {"status": "ok"}
