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


class Config:
    # Flask
    SECRET_KEY: str = os.getenv("FLASK_SECRET_KEY", "dev-insecure-default")
    DEBUG: bool = os.getenv("FLASK_DEBUG", "1") == "1"

    # CORS — allowed frontend origin
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")

    # Database — always an absolute SQLite path
    _raw_db_url: str = os.getenv(
        "DATABASE_URL", "sqlite:///instance/creatorconnect.db"
    )
    # If the URL is relative ("sqlite:///..."), anchor it to backend/
    if _raw_db_url.startswith("sqlite:///") and not _raw_db_url.startswith(
        "sqlite:////"):
        _db_file = _raw_db_url[len("sqlite:///"):]
        SQLALCHEMY_DATABASE_URI: str = (
            "sqlite:///" + str((Path(__file__).resolve().parent / _db_file).resolve())
        )
    else:
        SQLALCHEMY_DATABASE_URI: str = _raw_db_url

    SQLALCHEMY_TRACK_MODIFICATIONS: bool = False

    # Gemini
    GEMINI_API_KEY: str | None = os.getenv("GEMINI_API_KEY") or None
    GEMINI_MODEL: str | None = os.getenv("GEMINI_MODEL") or None
