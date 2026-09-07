import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.application import ApplicationCreate, ApplicationRead, ApplicationStatusUpdate
from app.services.application_service import (
    create_application,
    delete_application,
    get_application_by_id,
    get_applications_for_user,
    has_already_applied,
    update_application_status,
)
from app.services.notification_service import notify

router = APIRouter(prefix="/applications", tags=["applications"])


@router.get("", response_model=list[ApplicationRead])
def list_my_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_applications_for_user(db, current_user.id)


@router.post("", response_model=ApplicationRead, status_code=status.HTTP_201_CREATED)
def apply_to_job(
    application_in: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if has_already_applied(
        db, current_user.id, application_in.job_id, application_in.company, application_in.job_title
    ):
        raise HTTPException(status_code=400, detail="Already applied to this job.")
    return create_application(db, current_user.id, application_in)


@router.patch("/{application_id}/status", response_model=ApplicationRead)
def change_application_status(
    application_id: uuid.UUID,
    status_in: ApplicationStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    application = get_application_by_id(db, current_user.id, application_id)
    if application is None:
        raise HTTPException(status_code=404, detail="Application not found.")
    updated = update_application_status(db, application, status_in.status.value)
    notify(
        db, current_user.id, "application",
        f"Application status updated",
        f"Your application to {updated.company} for '{updated.job_title}' is now: {updated.status}.",
    )
    return updated


@router.delete("/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_application(
    application_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    application = get_application_by_id(db, current_user.id, application_id)
    if application is None:
        raise HTTPException(status_code=404, detail="Application not found.")
    delete_application(db, application)