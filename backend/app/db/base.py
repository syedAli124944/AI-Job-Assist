"""
Shared SQLAlchemy declarative base.
All models import Base from here, and this file is imported by anything
that needs the full metadata (e.g. Alembic env.py, create_all in dev).
"""
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# Import models here so Base.metadata is aware of every table.
# (Keeps Alembic autogenerate and dev create_all working correctly.)
from app.models.user import User  # noqa: E402,F401
