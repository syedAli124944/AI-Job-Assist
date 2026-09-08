"""
Auth business logic — kept separate from the route handlers in api/auth.py
so it can be unit-tested without spinning up FastAPI.
"""
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.schemas.user import UserCreate

def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user_in: UserCreate) -> User:
    user = User(email=user_in.email, password_hash=hash_password(user_in.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.password_hash):
        return None
    return user


def issue_token_for_user(user: User) -> str:
    return create_access_token(subject=str(user.id))
