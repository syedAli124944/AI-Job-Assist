from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.job import Notification
from app.models.user import User

router = APIRouter(prefix="/notifications", tags=["notifications"])


def _to_dict(item: Notification) -> dict:
    return {
        "id": str(item.id), "type": item.type, "title": item.title,
        "message": item.message, "read": item.read,
        "createdAt": item.created_at.isoformat(), "time": item.created_at.isoformat(),
    }


@router.get("")
def list_notifications(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return [_to_dict(item) for item in db.query(Notification).filter(Notification.user_id == user.id).order_by(Notification.created_at.desc()).all()]


@router.patch("/{notification_id}/read")
def mark_read(notification_id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    item = db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == user.id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Notification not found")
    item.read = True
    db.commit()
    return _to_dict(item)


@router.post("/read-all")
def mark_all_read(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    db.query(Notification).filter(Notification.user_id == user.id, Notification.read.is_(False)).update({"read": True})
    db.commit()
    return {"success": True}


@router.delete("/{notification_id}", status_code=204)
def delete_notification(notification_id: UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    item = db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == user.id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Notification not found")
    db.delete(item)
    db.commit()
