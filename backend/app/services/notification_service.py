"""
Notification service — centralised helper to create in-app notifications.

Usage:
    from app.services.notification_service import notify
    notify(db, user_id, "match", "New job match", "We found 5 jobs matching your profile.")
"""
import uuid
from sqlalchemy.orm import Session
from app.models.job import Notification


def notify(
    db: Session,
    user_id: uuid.UUID,
    type: str,
    title: str,
    message: str,
) -> Notification:
    """
    Create and persist a notification for the given user.

    Types (matches frontend expectations):
      - "match"       New job match found
      - "application" Application status update
      - "resume"      Resume uploaded / parsed
      - "update"      Generic system update
      - "alert"       High-priority alert
    """
    notification = Notification(
        user_id=user_id,
        type=type,
        title=title,
        message=message,
        read=False,
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification
