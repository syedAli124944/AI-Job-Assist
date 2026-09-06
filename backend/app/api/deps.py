from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.session import get_db
from app.models.user import User

# This tells FastAPI where the "login" endpoint is, so /docs shows a
# proper "Authorize" button with a lock icon.
oauth2_scheme = HTTPBearer()


def get_current_user(
    credentials=Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Runs on any route that needs to know "who is logged in".
    Reads the token, decodes it, and looks up the matching user.
    Raises 401 if the token is missing, invalid, or expired.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_access_token(credentials.credentials)
        user_id: str | None = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except Exception:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception

    return user