"""
Central application configuration.
Reads from environment variables (loaded via .env in local dev).
"""
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # App
    APP_NAME: str = "AI Job Search Assistant"
    ENV: str = "development"
    DEBUG: bool = True

    # Security
    SECRET_KEY: str = "change-me-in-env"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    # Database
    DATABASE_URL: str = "postgresql+psycopg2://postgres:postgres@db:5432/jobassistant"

    # CORS
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://ai-job-assist-taupe.vercel.app",
    ]

    # LLM / Agents
    OPENAI_API_KEY: str | None = None
    OPENAI_BASE_URL: str | None = None
    ANTHROPIC_API_KEY: str | None = None
    OPENAI_MODEL: str = "gemini-3.6-flash"

    # Job APIs — JSearch via RapidAPI (Google Jobs, Indeed, LinkedIn aggregator)
    JSEARCH_API_KEY: str | None = None
    JSEARCH_API_HOST: str = "jsearch.p.rapidapi.com"

    # Legacy Adzuna (kept for fallback)
    ADZUNA_APP_ID: str | None = None
    ADZUNA_APP_KEY: str | None = None
    ADZUNA_COUNTRY: str = "us"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    """Cached settings instance — import this everywhere instead of Settings() directly."""
    return Settings()
