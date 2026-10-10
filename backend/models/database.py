"""
backend/models/database.py
SQLAlchemy engine and session setup. Imported by app.py and all model files.
P1 owns all changes.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# Base class for all ORM models
class Base(DeclarativeBase):
    pass


# Engine and session are configured in app.py via init_db(app)
# Modules import `db_session` for DB access inside request context.
engine = None
SessionLocal = None


def init_db(database_uri: str) -> None:
    """Initialize engine and session factory. Called once from create_app()."""
    global engine, SessionLocal
    engine = create_engine(
        database_uri,
        connect_args={"check_same_thread": False},  # required for SQLite + Flask
        echo=False,
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    # Create all tables
    Base.metadata.create_all(bind=engine)


def get_session():
    """Context manager: yields a DB session and closes it after use."""
    if SessionLocal is None:
        raise RuntimeError("Database not initialized. Call init_db() first.")
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
