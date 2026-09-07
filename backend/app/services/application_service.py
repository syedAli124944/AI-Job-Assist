"""
Application Tracker business logic.
"""
import uuid

from sqlalchemy.orm import Session

from app.models.application import Application
from app.schemas.application import ApplicationCreate


def get_applications_for_user(db: Session, user_id: uuid.UUID) -> list[Application]:
    return (
        db.query(Application)
        .filter(Application.user_id == user_id)
        .order_by(Application.applied_at.desc())
        .all()
    )


def get_application_by_id(db: Session, user_id: uuid.UUID, application_id: uuid.UUID) -> Application | None:
    return (
        db.query(Application)
        .filter(Application.id == application_id, Application.user_id == user_id)
        .first()
    )


def has_already_applied(db: Session, user_id: uuid.UUID, job_id: str | None, company: str, job_title: str) -> bool:
    query = db.query(Application).filter(Application.user_id == user_id)
    if job_id:
        existing_by_job_id = query.filter(Application.job_id == job_id).first()
        if existing_by_job_id:
            return True
    existing_by_details = query.filter(
        Application.company.ilike(company), Application.job_title.ilike(job_title)
    ).first()
    return existing_by_details is not None


def create_application(db: Session, user_id: uuid.UUID, data: ApplicationCreate) -> Application:
    application = Application(
        user_id=user_id,
        job_id=data.job_id,
        job_title=data.job_title,
        company=data.company,
        location=data.location,
        job_url=data.job_url,
        logo=data.logo,
        status="Applied",
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


def update_application_status(db: Session, application: Application, new_status: str) -> Application:
    application.status = new_status
    db.commit()
    db.refresh(application)
    return application


def delete_application(db: Session, application: Application) -> None:
    db.delete(application)
    db.commit()