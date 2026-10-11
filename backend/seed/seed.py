"""
backend/seed/seed.py
Idempotent database seeder for CreatorProfile records.
Run from the project root:
    python backend/seed/seed.py [--source PATH]

Requirements:
- Validates every record against backend/contracts/creator.py before database operations.
- Upserts records by id (inserts new, updates existing).
- Running repeatedly does not create duplicate creators.
- Never drops or alters campaign, workflow, or match tables.
- Returns a structured summary: inserted, updated, skipped, total.
- Reports clear error if source file is missing or invalid.
"""

import argparse
import json
import logging
import sys
from pathlib import Path

# Ensure project root is importable
_PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(_PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(_PROJECT_ROOT))

from backend.config import Config
from backend.models.database import init_db, get_session
import backend.models  # noqa: F401 — registers all ORM models
from backend.models.creator_model import CreatorModel
from backend.contracts.creator import validate_creator_dict

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

DEFAULT_SEED_FILE = Path(__file__).resolve().parent / "creators.json"
TEMP_DEV_SEED_FILE = Path(__file__).resolve().parent / "temp_dev_creators.json"
P3_RAW_FILE = _PROJECT_ROOT / "contributions" / "person3" / "creators_raw.json"


def validate_dataset(records: list[dict]) -> tuple[list[dict], list[str]]:
    """
    Validates a list of creator records.
    Checks uniqueness of IDs and handles across the dataset.
    Returns (valid_records, error_messages).
    """
    errors: list[str] = []
    if not isinstance(records, list):
        return [], ["Dataset root must be a JSON array (list)."]

    seen_ids: set[str] = set()
    seen_handles: set[str] = set()
    valid_records: list[dict] = []

    for idx, rec in enumerate(records):
        rec_errors = validate_creator_dict(rec)
        if rec_errors:
            errors.append(f"Record #{idx} ({rec.get('id', 'no-id')}): " + "; ".join(rec_errors))
            continue

        cid = rec["id"]
        handle = rec["handle"].lower()

        if cid in seen_ids:
            errors.append(f"Duplicate creator id '{cid}' in dataset.")
            continue
        if handle in seen_handles:
            errors.append(f"Duplicate creator handle '{rec['handle']}' in dataset.")
            continue

        seen_ids.add(cid)
        seen_handles.add(handle)
        valid_records.append(rec)

    return valid_records, errors


def seed_database(
    source_path: Path | str | None = None,
    db_uri: str | None = None,
) -> dict[str, int]:
    """
    Executes idempotent database seeding.
    Returns summary dict: {"inserted": int, "updated": int, "skipped": int, "total": int}.
    Raises ValueError / FileNotFoundError on failure.
    """
    if source_path is None:
        source_path = DEFAULT_SEED_FILE
    else:
        source_path = Path(source_path)

    if not source_path.exists():
        raise FileNotFoundError(
            f"Seed file not found: {source_path}\n"
            f"If P3 has delivered data, ensure it is normalized in {DEFAULT_SEED_FILE}.\n"
            f"For development testing, run with: --source {TEMP_DEV_SEED_FILE}"
        )

    with open(source_path, encoding="utf-8") as f:
        try:
            records = json.load(f)
        except json.JSONDecodeError as exc:
            raise ValueError(f"Failed to parse JSON from {source_path}: {exc}") from exc

    if not records:
        # Check if P3 delivered raw data or if temporary dev data is available
        hint = (
            f"Seed dataset at {source_path} is empty.\n"
            f"P3 has not delivered contributions/person3/creators_raw.json yet.\n"
            f"To seed the temporary development dataset, run:\n"
            f"    python backend/seed/seed.py --source {TEMP_DEV_SEED_FILE}"
        )
        raise ValueError(hint)

    valid_records, validation_errors = validate_dataset(records)
    if validation_errors:
        err_msg = "\n  - " + "\n  - ".join(validation_errors)
        raise ValueError(f"Dataset validation failed with {len(validation_errors)} error(s):{err_msg}")

    # Ensure tables exist without modifying unrelated tables
    from backend.models.database import engine
    if engine is None or db_uri:
        target_uri = db_uri or Config.SQLALCHEMY_DATABASE_URI
        init_db(target_uri)

    inserted = 0
    updated = 0
    skipped = 0

    with get_session() as session:
        try:
            for rec in valid_records:
                existing = session.get(CreatorModel, rec["id"])
                model_instance = CreatorModel.from_dict(rec)

                if existing is not None:
                    # Compare fields to determine if update is needed
                    has_changed = False
                    for col in CreatorModel.__table__.columns:
                        col_name = col.name
                        new_val = getattr(model_instance, col_name)
                        old_val = getattr(existing, col_name)
                        if new_val != old_val:
                            setattr(existing, col_name, new_val)
                            has_changed = True

                    if has_changed:
                        updated += 1
                    else:
                        skipped += 1
                else:
                    session.add(model_instance)
                    inserted += 1

            session.commit()
        except Exception:
            session.rollback()
            raise

    summary = {
        "inserted": inserted,
        "updated": updated,
        "skipped": skipped,
        "total": len(valid_records),
    }
    logger.info(
        "Seed complete: %d inserted, %d updated, %d skipped (Total: %d).",
        inserted, updated, skipped, len(valid_records)
    )
    return summary


def main():
    parser = argparse.ArgumentParser(description="Seed CreatorConnect AI creators database")
    parser.add_argument(
        "--source",
        type=str,
        default=None,
        help="Path to JSON seed file (defaults to backend/seed/creators.json, fallback available to temp_dev_creators.json)",
    )
    parser.add_argument(
        "--use-temp",
        action="store_true",
        help="Explicitly use temporary development seed dataset (temp_dev_creators.json)",
    )
    parser.add_argument(
        "--db-url",
        type=str,
        default=None,
        help="Target database URL (defaults to configured DATABASE_URL)",
    )
    args = parser.parse_args()

    target_source = args.source
    if args.use_temp:
        target_source = TEMP_DEV_SEED_FILE

    try:
        summary = seed_database(target_source, db_uri=args.db_url)
        print(f"\n[SUCCESS] Seeded creators into database:")
        print(f"  Inserted: {summary['inserted']}")
        print(f"  Updated:  {summary['updated']}")
        print(f"  Skipped:  {summary['skipped']}")
        print(f"  Total:    {summary['total']}")
    except Exception as exc:
        print(f"\n[ERROR] Seeding aborted: {exc}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
