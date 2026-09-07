"""
Profile table — stores the info a user fills in about themselves
(skills, experience, job preferences) used later for job matching.

Linked to the users table via a foreign key: each profile belongs
to exactly one user.
"""
import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
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

    # JSON is stored as text so the profile works with both PostgreSQL and
    # local development databases without dialect-specific migrations.
    skills: Mapped[str | None] = mapped_column(Text, nullable=True)
    preferred_job_titles: Mapped[str | None] = mapped_column(Text, nullable=True)
    preferred_locations: Mapped[str | None] = mapped_column(Text, nullable=True)
    work_types: Mapped[str | None] = mapped_column(Text, nullable=True)
    min_salary: Mapped[int | None] = mapped_column(Integer, nullable=True)
    resume_file_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    resume_text: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )