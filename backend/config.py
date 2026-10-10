"""
backend/config.py
Loads environment variables and exposes a Config object.
SQLite path is resolved to an absolute path at import time so it works
regardless of which directory Flask is started from.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Resolve directories and env paths
_BACKEND_DIR = Path(__file__).resolve().parent
_ROOT = _BACKEND_DIR.parent
_BACKEND_ENV = _BACKEND_DIR / ".env"
_ROOT_ENV = _ROOT / ".env"

# Load environment files:
# 1. backend/.env (canonical location for real local environment)
# 2. root .env (fallback)
def load_environment() -> None:
    """Loads environment variables from backend/.env and project root .env."""
    if _BACKEND_ENV.exists():
        load_dotenv(_BACKEND_ENV)
    if _ROOT_ENV.exists():
        load_dotenv(_ROOT_ENV)

load_environment()

# ── Resolved paths ─────────────────────────────────────────────────────────────
_INSTANCE_DIR = Path(__file__).resolve().parent / "instance"
_INSTANCE_DIR.mkdir(exist_ok=True)          # create backend/instance/ if missing


def normalize_database_url(raw_url: str) -> str:
    """
    Normalises database connection URLs for SQLAlchemy compatibility.
    - postgres:// -> postgresql+psycopg2://
    - postgresql:// -> postgresql+psycopg2://
    - Anchors relative sqlite:/// paths to backend/
    """
    url = (raw_url or "").strip()
    if not url:
        return "sqlite:///" + str((Path(__file__).resolve().parent / "instance" / "creatorconnect.db").resolve())

    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+psycopg2://", 1)
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+psycopg2://", 1)
    if url.startswith("sqlite:///"):
        db_file = url[len("sqlite:///"):]
        if db_file in (":memory:", "") or Path(db_file).is_absolute():
            return url
        return "sqlite:///" + str((Path(__file__).resolve().parent / db_file).resolve())
    return url


class Config:
    # Flask
    SECRET_KEY: str = os.getenv("FLASK_SECRET_KEY", "dev-insecure-default")
    DEBUG: bool = os.getenv("FLASK_DEBUG", "1") == "1"

    # CORS — allowed frontend origin
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")

    # Database — PostgreSQL (Supabase) or SQLite fallback
    _raw_db_url: str = os.getenv(
        "DATABASE_URL", "sqlite:///instance/creatorconnect.db"
    )
    SQLALCHEMY_DATABASE_URI: str = normalize_database_url(_raw_db_url)
    SQLALCHEMY_TRACK_MODIFICATIONS: bool = False

    # Gemini
    GEMINI_API_KEY: str | None = os.getenv("GEMINI_API_KEY") or None
    GEMINI_MODEL: str | None = os.getenv("GEMINI_MODEL") or None
