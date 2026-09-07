"""
Pydantic v2 request/response schemas for the Application Tracker feature.
"""
import uuid
from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict


class ApplicationStatus(str, Enum):
    APPLIED = "Applied"
    INTERVIEW = "Interview"
    ASSESSMENT = "Assessment"
    OFFER = "Offer"
    REJECTED = "Rejected"


class ApplicationCreate(BaseModel):
    job_id: str | None = None
    job_title: str
    company: str
    logo: str | None = None


class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus


class ApplicationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    job_id: str | None
    job_title: str
    company: str
    status: str
    logo: str | None
    applied_at: datetime
    updated_at: datetime