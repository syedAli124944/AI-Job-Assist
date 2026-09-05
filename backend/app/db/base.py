"""
Shared SQLAlchemy declarative base.
All models import Base from here, and this file is imported by anything
that needs the full metadata (e.g. Alembic env.py, create_all in dev).
"""
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass

