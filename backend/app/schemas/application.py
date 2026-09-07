"""
Pydantic v2 request/response schemas for the Application Tracker feature.
"""
import uuid
from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ApplicationStatus(str, Enum):
    APPLIED = "Applied"
    INTERVIEW = "Interview"
    ASSESSMENT = "Assessment"
    OFFER = "Offer"
    REJECTED = "Rejected"


class ApplicationCreate(BaseModel):
    job_id: Optional[str] = None
    job_title: str
    company: str
    location: Optional[str] = None
    job_url: Optional[str] = None
    logo: Optional[str] = None


class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus


class ApplicationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    job_id: Optional[str] = None
    job_title: str
    company: str
    location: Optional[str] = None
    job_url: Optional[str] = None
    status: str
    logo: Optional[str] = None
    applied_at: datetime
    updated_at: datetime