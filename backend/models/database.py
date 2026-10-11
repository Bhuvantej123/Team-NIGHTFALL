"""
backend/models/database.py
SQLAlchemy engine and session setup. Imported by app.py and all model files.
P1 owns all changes.
"""

from contextlib import contextmanager
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
    is_sqlite = database_uri.startswith("sqlite")

    engine_kwargs = {
        "echo": False,
        "pool_pre_ping": True,
    }
    if is_sqlite:
        engine_kwargs["connect_args"] = {"check_same_thread": False}
        if ":memory:" in database_uri:
            from sqlalchemy.pool import StaticPool
            engine_kwargs["poolclass"] = StaticPool
    else:
        # PostgreSQL / Supabase pooler settings
        engine_kwargs["pool_recycle"] = 300
        engine_kwargs["pool_size"] = 10
        engine_kwargs["max_overflow"] = 20

    engine = create_engine(database_uri, **engine_kwargs)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    # Create all tables safely if they do not exist
    Base.metadata.create_all(bind=engine)


@contextmanager
def get_session():
    """Context manager: yields a DB session and closes it after use."""
    if SessionLocal is None:
        raise RuntimeError("Database not initialized. Call init_db() first.")
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
