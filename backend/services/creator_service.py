"""
backend/services/creator_service.py
Business logic for listing, filtering, and retrieving CreatorProfile records.
P1 owns all changes.
"""

import json
import logging
from typing import Optional

from backend.models.database import get_session
from backend.models.creator_model import CreatorModel

logger = logging.getLogger(__name__)


class CreatorValidationError(Exception):
    """Raised when query parameters fail validation."""
    def __init__(self, message: str, details: Optional[dict] = None):
        super().__init__(message)
        self.message = message
        self.details = details or {}


def parse_availability_param(val: Optional[str]) -> Optional[bool]:
    """
    Parses and validates the 'available' query parameter string.
    Returns True, False, or None if not provided.
    Raises CreatorValidationError on invalid values.
    """
    if val is None:
        return None
    cleaned = val.strip().lower()
    if cleaned in ("true", "1", "yes"):
        return True
    if cleaned in ("false", "0", "no"):
        return False
    raise CreatorValidationError(
        f"Invalid value for 'available' parameter: '{val}'. Expected 'true' or 'false'.",
        {"parameter": "available", "value": val},
    )


def list_creators(
    niche: Optional[str] = None,
    platform: Optional[str] = None,
    skill: Optional[str] = None,
    available: Optional[str] = None,
    q: Optional[str] = None,
) -> list[dict]:
    """
    Retrieves and filters creator profiles from the database using AND semantics.
    Returns a list of dicts matching the canonical CreatorProfile interface.
    """
    # Validate availability param early
    avail_bool = parse_availability_param(available)

    # Normalize string search terms
    niche_clean = niche.strip().lower() if niche and niche.strip() else None
    platform_clean = platform.strip().lower() if platform and platform.strip() else None
    skill_clean = skill.strip().lower() if skill and skill.strip() else None
    q_clean = q.strip().lower() if q and q.strip() else None

    with get_session() as session:
        query = session.query(CreatorModel)

        # Apply database-level availability filter if present
        if avail_bool is not None:
            query = query.filter(CreatorModel.availability == avail_bool)

        creators = query.all()
        results: list[dict] = []

        for c in creators:
            c_dict = c.to_dict()

            # Filter: niche (case-insensitive partial match against creator niches)
            if niche_clean:
                creator_niches = [n.lower() for n in c_dict.get("niches", [])]
                if not any(niche_clean in n for n in creator_niches):
                    continue

            # Filter: platform (case-insensitive exact match against platform name)
            if platform_clean:
                creator_platforms = [
                    p.get("name", "").lower() for p in c_dict.get("platforms", [])
                ]
                if platform_clean not in creator_platforms:
                    continue

            # Filter: skill (case-insensitive partial match against creator skills)
            if skill_clean:
                creator_skills = [s.lower() for s in c_dict.get("skills", [])]
                if not any(skill_clean in s for s in creator_skills):
                    continue

            # Filter: q (free-text search across display_name, bio, and style_tags)
            if q_clean:
                display_name = c_dict.get("display_name", "").lower()
                bio = c_dict.get("bio", "").lower()
                style_tags = [st.lower() for st in c_dict.get("style_tags", [])]

                matches_name = q_clean in display_name
                matches_bio = q_clean in bio
                matches_style = any(q_clean in st for st in style_tags)

                if not (matches_name or matches_bio or matches_style):
                    continue

            results.append(c_dict)

        return results


def get_creator_by_id(creator_id: str) -> Optional[dict]:
    """
    Retrieves a single creator profile by ID.
    Returns dict if found, None otherwise.
    """
    if not creator_id or not creator_id.strip():
        return None

    with get_session() as session:
        creator = session.get(CreatorModel, creator_id.strip())
        if creator is None:
            return None
        return creator.to_dict()
