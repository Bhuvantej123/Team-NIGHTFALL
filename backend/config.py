"""
backend/config.py
Loads environment variables and exposes a Config object.
SQLite path is resolved to an absolute path at import time so it works
regardless of which directory Flask is started from.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from the project root (two levels up from this file: backend/ -> root)
_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(_ROOT / ".env")

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
