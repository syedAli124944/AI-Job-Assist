import json

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.application import Application
from app.models.profile import Profile
from app.models.resume import Resume
from app.models.user import User

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/stats")
def stats(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    applications = db.query(Application).filter(Application.user_id == user.id).all()
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    has_profile = bool(profile and (profile.skills or profile.preferred_job_titles))
    return {
        "applied": len(applications),
        "interviews": sum(item.status == "Interview" for item in applications),
        "offers": sum(item.status == "Offer" for item in applications),
        "profileCompletion": 95 if has_profile else 0,
    }
