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


DISCIPLINE_RULES = [
    (
        "AI Filmmaker",
        [
            "filmmaker", "generative director", "cinematic ai", "speculative documentarian",
            "documentary", "cinematography", "camera motion", "sci-fi & speculative fiction",
            "brand storytelling", "cinematic_video", "short_film", "brand_film",
            "environmental_short", "macro_documentary", "nature_documentary", "film director",
            "generative video direction"
        ]
    ),
    (
        "AI Animator",
        [
            "animator", "animation", "character animation", "cel-shading", "anime",
            "motion comic", "character lore animation", "pika", "liveportrait",
            "animated_loop", "animated_short", "anime_short", "biomedical_animation",
            "character_intro", "medical_device_vis", "cellular mechanism animation"
        ]
    ),
    (
        "AI Video Ad Creator",
        [
            "commercial", "product commercial", "video ad", "e-commerce video",
            "launch ad", "short-form hook", "viral reels", "hardware_commercial",
            "product_commercial", "automotive_commercial", "beverage_commercial",
            "coffee_commercial", "social_ad", "short_form_reel", "commercial video production",
            "e-commerce video ads", "ai product advertisements"
        ]
    ),
    (
        "Motion Graphics Artist",
        [
            "motion graphics", "motion design", "kinetic typography", "infographic motion",
            "parallax depth", "esports_motion", "motion_graphic", "motion comic animation",
            "scientific visualization", "3d rendering", "culinary motion graphics",
            "esports motion graphics"
        ]
    ),
    (
        "AI Visual Artist",
        [
            "couture", "virtual fashion", "digital runway", "editorial photography",
            "visual artist", "art director", "style transfer", "image generation",
            "beauty_editorial", "couture_lookbook", "jewelry_editorial", "luxury_campaign",
            "runway_presentation", "virtual_lookbook", "macro texture generation",
            "luxury visual direction", "editorial portraiture"
        ]
    ),
]


def derive_creator_disciplines(creator_dict: dict) -> list[str]:
    """
    Derives genuine creative disciplines based strictly on the creator's actual
    headline, bio, skills, tools, niches, portfolio items, and evidence text.
    Never fabricates ungrounded credentials.
    """
    skills = [s.lower() for s in creator_dict.get("skills", [])]
    niches = [n.lower() for n in creator_dict.get("niches", [])]
    tools = [t.lower() for t in creator_dict.get("ai_tools", [])]
    styles = [st.lower() for st in creator_dict.get("style_tags", [])]
    bio = creator_dict.get("bio", "").lower()
    headline = creator_dict.get("headline", "").lower()
    evidence = creator_dict.get("portfolio_evidence", "").lower()

    portfolio_texts = []
    for item in creator_dict.get("portfolio_items", []):
        portfolio_texts.append(item.get("title", "").lower())
        portfolio_texts.append(item.get("description", "").lower())
        portfolio_texts.extend([t.lower() for t in item.get("tags", [])])
        if item.get("content_type"):
            portfolio_texts.append(item.get("content_type").lower())

    corpus = " ".join([bio, headline, evidence] + skills + niches + tools + styles + portfolio_texts)

    disciplines = []
    for disc_name, keywords in DISCIPLINE_RULES:
        if any(kw in corpus for kw in keywords):
            disciplines.append(disc_name)

    return disciplines or ["AI Visual Artist"]


def list_creators(
    niche: Optional[str] = None,
    platform: Optional[str] = None,
    skill: Optional[str] = None,
    available: Optional[str] = None,
    q: Optional[str] = None,
    discipline: Optional[str] = None,
) -> list[dict]:
    """
    Retrieves and filters creator profiles from the database using AND semantics.
    Supports filtering by discipline (e.g. 'AI Filmmaker', 'AI Animator').
    Returns a list of dicts matching the canonical CreatorProfile interface, augmented
    with derived disciplines.
    """
    # Validate availability param early
    avail_bool = parse_availability_param(available)

    # Normalize string search terms
    niche_clean = niche.strip().lower() if niche and niche.strip() else None
    platform_clean = platform.strip().lower() if platform and platform.strip() else None
    skill_clean = skill.strip().lower() if skill and skill.strip() else None
    q_clean = q.strip().lower() if q and q.strip() else None
    discipline_clean = discipline.strip().lower() if discipline and discipline.strip() else None

    with get_session() as session:
        query = session.query(CreatorModel)

        # Apply database-level availability filter if present
        if avail_bool is not None:
            query = query.filter(CreatorModel.availability == avail_bool)

        creators = query.all()
        results: list[dict] = []

        for c in creators:
            c_dict = c.to_dict()
            disciplines = derive_creator_disciplines(c_dict)
            c_dict["disciplines"] = disciplines

            # Filter: discipline (case-insensitive partial or exact match against derived disciplines)
            if discipline_clean and discipline_clean != "all":
                if not any(discipline_clean in d.lower() for d in disciplines):
                    continue

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

            # Filter: q (free-text search across display_name, bio, style_tags, and disciplines)
            if q_clean:
                display_name = c_dict.get("display_name", "").lower()
                bio = c_dict.get("bio", "").lower()
                style_tags = [st.lower() for st in c_dict.get("style_tags", [])]
                disc_names = [d.lower() for d in disciplines]

                matches_name = q_clean in display_name
                matches_bio = q_clean in bio
                matches_style = any(q_clean in st for st in style_tags)
                matches_disc = any(q_clean in d for d in disc_names)

                if not (matches_name or matches_bio or matches_style or matches_disc):
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
        c_dict = creator.to_dict()
        c_dict["disciplines"] = derive_creator_disciplines(c_dict)
        return c_dict
