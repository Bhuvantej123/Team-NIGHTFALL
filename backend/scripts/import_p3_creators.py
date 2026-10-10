"""
backend/scripts/import_p3_creators.py
Validates and normalises Person 3's creator dataset (contributions/person3/creators_raw.json)
into backend/seed/creators.json.

P1 owns this script. Does NOT edit any files in contributions/person3/.
Run from project root:
    python backend/scripts/import_p3_creators.py
"""

import json
import logging
import sys
from pathlib import Path

# Ensure project root is importable
_PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(_PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(_PROJECT_ROOT))

from backend.seed.seed import validate_dataset, seed_database

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

P3_SOURCE_FILE = _PROJECT_ROOT / "contributions" / "person3" / "creators_raw.json"
TARGET_SEED_FILE = _PROJECT_ROOT / "backend" / "seed" / "creators.json"


def import_p3_dataset() -> bool:
    if not P3_SOURCE_FILE.exists():
        logger.warning(
            "P3 dataset not found at %s. Awaiting contribution from Person 3.",
            P3_SOURCE_FILE,
        )
        return False

    with open(P3_SOURCE_FILE, encoding="utf-8") as f:
        try:
            records = json.load(f)
        except json.JSONDecodeError as exc:
            logger.error("JSON decode error in %s: %s", P3_SOURCE_FILE, exc)
            return False

    valid_records, errors = validate_dataset(records)
    if errors:
        logger.error("Validation failed with %d error(s):", len(errors))
        for err in errors:
            logger.error("  - %s", err)
        return False

    # Save normalised copy to backend/seed/creators.json
    with open(TARGET_SEED_FILE, "w", encoding="utf-8") as f:
        json.dump(valid_records, f, indent=2)

    logger.info("Successfully normalised %d creators to %s", len(valid_records), TARGET_SEED_FILE)
    return True


if __name__ == "__main__":
    success = import_p3_dataset()
    if success:
        print("[SUCCESS] P3 dataset imported and validated.")
        # Offer to seed immediately
        seed_database(TARGET_SEED_FILE)
    else:
        print("[STATUS] P3 dataset not imported. See logs above.")
        sys.exit(1)
