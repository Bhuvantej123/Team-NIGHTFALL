"""
backend/scripts/init_supabase_db.py
Safely initializes and verifies schema tables on Supabase PostgreSQL (or SQLite).
P1 owns all changes.

Usage:
    python backend/scripts/init_supabase_db.py [--db-url POSTGRES_URL]

Idempotent: Uses Base.metadata.create_all() which creates missing tables
without altering or deleting existing data.
"""

import argparse
import logging
import re
import sys
from pathlib import Path

# Ensure project root is importable
_PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(_PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(_PROJECT_ROOT))

from sqlalchemy import text, inspect
from backend.config import Config, normalize_database_url
import backend.models.database as db_module
from backend.models.database import init_db, Base
import backend.models  # noqa: F401 — registers all ORM models

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)


def mask_db_url(url: str) -> str:
    """Masks database password in connection strings for safe logging."""
    return re.sub(r":([^:@]+)@", r":****@", url)


def initialize_database(db_url: str | None = None) -> bool:
    raw_url = db_url or Config.SQLALCHEMY_DATABASE_URI
    target_url = normalize_database_url(raw_url)
    masked = mask_db_url(target_url)

    is_postgres = "postgres" in target_url.lower()
    db_type = "Supabase PostgreSQL" if is_postgres else "SQLite"

    print(f"\n[INIT] Target Database: {db_type}")
    print(f"[INIT] Connection URL:  {masked}")

    try:
        init_db(target_url)
        print("[INIT] Engine and session factory initialized successfully.")

        # Test live connection with lightweight ping query
        with db_module.engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("[SUCCESS] Database connectivity verified (SELECT 1 succeeded).")

        # Inspect tables
        inspector = inspect(db_module.engine)
        existing_tables = inspector.get_table_names()
        print(f"\n[SCHEMA] Verified database tables ({len(existing_tables)} found):")
        expected_tables = ["creators", "campaign_briefs", "campaign_workflows", "match_results"]
        for tbl in expected_tables:
            present = tbl in existing_tables
            status_str = "OK (Present)" if present else "MISSING"
            print(f"  - {tbl:<22} : {status_str}")

        return True

    except Exception as exc:
        print(f"\n[ERROR] Database initialization failed: {exc}", file=sys.stderr)
        if is_postgres:
            print("\nTroubleshooting tips for Supabase:", file=sys.stderr)
            print("  1. Verify your DATABASE_URL in .env matches your Supabase connection string.", file=sys.stderr)
            print("  2. Ensure your password is URL-encoded if it contains special characters.", file=sys.stderr)
            print("  3. For Supabase Pooler (Transaction mode): use port 6543.", file=sys.stderr)
            print("  4. For Supabase Direct (Session mode): use port 5432.", file=sys.stderr)
        return False


def main():
    parser = argparse.ArgumentParser(description="Initialize Supabase PostgreSQL schema")
    parser.add_argument(
        "--db-url",
        type=str,
        default=None,
        help="Custom PostgreSQL / Supabase connection URL",
    )
    args = parser.parse_args()

    success = initialize_database(args.db_url)
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
