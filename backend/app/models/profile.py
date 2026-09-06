"""
Profile table — stores the info a user fills in about themselves
(skills, experience, job preferences) used later for job matching.

Linked to the users table via a foreign key: each profile belongs
to exactly one user.
"""
import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.db.base import Base


class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    # Links this profile to exactly one user. unique=True means a user
    # can only have ONE profile (not multiple).
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False
    )

    full_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    years_of_experience: Mapped[int | None] = mapped_column(Integer, nullable=True)

    # Stored as real Postgres arrays, e.g. {"Python","FastAPI","SQL"}
    skills: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)
    preferred_job_titles: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)
    preferred_locations: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )