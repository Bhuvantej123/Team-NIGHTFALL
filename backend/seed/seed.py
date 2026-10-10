"""
backend/seed/seed.py
Seeds the SQLite database from backend/seed/creators.json.
Run from the project root:
    python backend/seed/seed.py

Idempotent: existing creators are updated; the table is not dropped.
P1 owns this file. P3's raw data (contributions/person3/creators_raw.json)
must be reviewed and normalised by P1 before being saved here as creators.json.
"""

import json
import sys
from pathlib import Path

# Ensure project root is importable
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from backend.config import Config
from backend.models.database import init_db
import backend.models  # noqa: F401 — registers all ORM models
from backend.models.database import SessionLocal
from backend.models.creator_model import CreatorModel

_SEED_FILE = Path(__file__).resolve().parent / "creators.json"


def seed():
    if not _SEED_FILE.exists():
        print(
            f"Seed file not found: {_SEED_FILE}\n"
            "Place creators.json in backend/seed/ and re-run.\n"
            "Use contributions/person3/creators_raw.json as the source."
        )
        return

    init_db(Config.SQLALCHEMY_DATABASE_URI)
    session = SessionLocal()

    with open(_SEED_FILE, encoding="utf-8") as f:
        creators = json.load(f)

    added = updated = 0
    for data in creators:
        existing = session.get(CreatorModel, data["id"])
        if existing:
            # Update in place
            for key, value in CreatorModel.from_dict(data).__dict__.items():
                if not key.startswith("_"):
                    setattr(existing, key, value)
            updated += 1
        else:
            session.add(CreatorModel.from_dict(data))
            added += 1

    session.commit()
    session.close()
    print(f"Seed complete: {added} added, {updated} updated.")


if __name__ == "__main__":
    seed()
