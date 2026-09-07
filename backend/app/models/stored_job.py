"""
StoredJob model — locally cached job listings.

Jobs are fetched from external providers (Adzuna, etc.) and stored here
to enable:
  - Fast search without hitting the external API on every request
  - Deduplication across sync cycles
  - Historical analysis and trend tracking
"""
import uuid
from datetime import datetime

from sqlalchemy import DateTime, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.db.base import Base


class StoredJob(Base):
    __tablename__ = "stored_jobs"

    # Uniqueness: no two rows with the same provider + external_id
    __table_args__ = (
        UniqueConstraint("source", "external_id", name="uq_stored_job_source_external"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    # Provider identification
    source: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    external_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)

    # Normalised job fields
    title: Mapped[str] = mapped_column(String(512), nullable=False)
    company: Mapped[str] = mapped_column(String(255), nullable=False)
    location: Mapped[str | None] = mapped_column(String(255), nullable=True)
    salary: Mapped[str | None] = mapped_column(String(128), nullable=True)
    job_type: Mapped[str | None] = mapped_column(String(64), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    url: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Timestamps
    posted_at: Mapped[str | None] = mapped_column(String(64), nullable=True)
    fetched_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Full raw payload stored as JSON text for forward-compatibility
    payload: Mapped[str | None] = mapped_column(Text, nullable=True)
