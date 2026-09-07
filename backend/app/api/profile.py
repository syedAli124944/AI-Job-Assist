import json
from typing import Any

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.profile import Profile
from app.models.user import User

router = APIRouter(prefix="/profile", tags=["profile"])


class Preferences(BaseModel):
    targetRoles: list[str] = Field(default_factory=list)
    skills: list[str] = Field(default_factory=list)
    locations: list[str] = Field(default_factory=list)
    workTypes: list[str] = Field(default_factory=list)
    minSalary: int | None = None


def _profile(db: Session, user: User) -> Profile:
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if profile is None:
        profile = Profile(user_id=user.id)
        db.add(profile)
        db.flush()
    return profile


@router.post("/preferences")
def save_preferences(payload: Preferences, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    profile = _profile(db, user)
    profile.preferred_job_titles = json.dumps(payload.targetRoles)
    profile.skills = json.dumps(payload.skills)
    profile.preferred_locations = json.dumps(payload.locations)
    profile.work_types = json.dumps(payload.workTypes)
    profile.min_salary = payload.minSalary
    db.commit()
    return {"success": True, "preferences": payload.model_dump(), "profileCompletion": 95}


@router.get("/preferences")
def get_preferences(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    profile = _profile(db, user)
    db.commit()
    return {
        "targetRoles": json.loads(profile.preferred_job_titles or "[]"),
        "skills": json.loads(profile.skills or "[]"),
        "locations": json.loads(profile.preferred_locations or "[]"),
        "workTypes": json.loads(profile.work_types or "[]"),
        "minSalary": profile.min_salary,
    }
