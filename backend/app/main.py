from contextlib import asynccontextmanager

from backend.app.api import applications
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import agents, auth, dashboard, health, jobs, notifications, profile, resume, ai
from app.core.config import get_settings
from app.db.base import Base
from app.db.session import engine
import app.models  # noqa: F401 — ensures all models are registered on Base.metadata
from app.api import agents, auth, health, profile

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Dev-only convenience: auto-create tables if they don't exist, on startup.
    Once you introduce Alembic migrations, drop this block and rely on
    `alembic upgrade head` instead.
    """
    if settings.ENV == "development":
        Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(agents.router)
app.include_router(jobs.router)
app.include_router(applications.router)
app.include_router(dashboard.router)
app.include_router(notifications.router)
app.include_router(profile.router)
app.include_router(resume.router)
app.include_router(ai.router)
app.include_router(profile.router)
app.include_router(applications.router)