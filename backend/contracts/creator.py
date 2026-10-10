"""
backend/contracts/creator.py
Canonical Python data shapes for CreatorProfile.
P1 owns all changes. Other team members must not edit this file.

NOTE: All profiles in this application are FICTIONAL DEMO DATA.
      Follower counts and pricing figures are not verified real-world statistics.
"""

from dataclasses import dataclass, field
from typing import Optional


@dataclass
class PlatformDetail:
    """A creator's presence on a single social platform."""
    name: str                          # "instagram"|"youtube"|"tiktok"|"twitter"|"linkedin"
    handle: str                        # Platform-specific username
    url: Optional[str] = None          # Full profile URL (optional)
    follower_count: Optional[int] = None  # Fictional; not a verified statistic


@dataclass
class PortfolioItem:
    """A single piece of content in a creator's portfolio."""
    id: str
    title: str
    description: str
    platform: str                      # Platform where content was / would be published
    content_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    tags: list[str] = field(default_factory=list)


@dataclass
class CreatorProfile:
    """
    A fictional AI content creator profile used for demo matching.

    Validation rules:
    - id, display_name, handle, bio, portfolio_evidence: required, non-empty
    - starting_price >= 0
    - availability is boolean (never None)
    - At least one entry required in: skills, niches, platforms
    - follower_count, content_url, thumbnail_url: optional (None allowed)
    """
    id: str
    display_name: str
    handle: str                        # Unique; used as tie-break key in matching
    bio: str
    skills: list[str]                  # e.g. ["video editing", "AI voiceover"]
    ai_tools: list[str]                # e.g. ["Midjourney", "Runway", "ElevenLabs"]
    niches: list[str]                  # e.g. ["tech", "sustainability"]
    platforms: list[PlatformDetail]
    portfolio_items: list[PortfolioItem]
    style_tags: list[str]              # e.g. ["minimalist", "educational", "humorous"]
    starting_price: float              # Per-campaign starting rate (0 = negotiable)
    currency: str                      # ISO 4217, e.g. "USD"
    availability: bool                 # True = currently available for campaigns
    portfolio_evidence: str            # Short prose describing portfolio strengths
    created_at: str                    # ISO 8601


def validate_creator_dict(data: dict) -> list[str]:
    """
    Validates a dictionary against CreatorProfile contract requirements.
    Returns a list of error strings; empty list if completely valid.
    """
    errors: list[str] = []
    if not isinstance(data, dict):
        return ["Record must be a JSON object (dict)."]

    # Required non-empty string fields
    required_str_fields = ["id", "display_name", "handle", "bio", "portfolio_evidence", "currency", "created_at"]
    for field_name in required_str_fields:
        val = data.get(field_name)
        if not val or not isinstance(val, str) or not val.strip():
            errors.append(f"Field '{field_name}' must be a non-empty string.")

    # starting_price
    price = data.get("starting_price")
    if price is None or not isinstance(price, (int, float)) or price < 0:
        errors.append(f"Field 'starting_price' must be a non-negative number, got {price}.")

    # availability
    avail = data.get("availability")
    if avail is None or not isinstance(avail, bool):
        errors.append(f"Field 'availability' must be a boolean (True or False), got {avail}.")

    # Non-empty list fields
    for list_field in ["skills", "niches"]:
        items = data.get(list_field)
        if not isinstance(items, list) or len(items) == 0:
            errors.append(f"Field '{list_field}' must be a non-empty list.")
        elif not all(isinstance(x, str) and x.strip() for x in items):
            errors.append(f"Field '{list_field}' must contain non-empty strings.")

    # platforms
    platforms = data.get("platforms")
    if not isinstance(platforms, list) or len(platforms) == 0:
        errors.append("Field 'platforms' must be a non-empty list.")
    else:
        for idx, plat in enumerate(platforms):
            if not isinstance(plat, dict):
                errors.append(f"Platform item {idx} must be a dict.")
                continue
            if not plat.get("name") or not isinstance(plat.get("name"), str):
                errors.append(f"Platform item {idx} must have a non-empty 'name'.")
            if not plat.get("handle") or not isinstance(plat.get("handle"), str):
                errors.append(f"Platform item {idx} must have a non-empty 'handle'.")
            fc = plat.get("follower_count")
            if fc is not None and (not isinstance(fc, int) or fc < 0):
                errors.append(f"Platform item {idx} 'follower_count' must be a non-negative integer or null.")

    # portfolio_items
    items = data.get("portfolio_items")
    if items is not None:
        if not isinstance(items, list):
            errors.append("Field 'portfolio_items' must be a list if provided.")
        else:
            for idx, p_item in enumerate(items):
                if not isinstance(p_item, dict):
                    errors.append(f"Portfolio item {idx} must be a dict.")
                    continue
                for p_req in ["id", "title", "description", "platform"]:
                    if not p_item.get(p_req) or not isinstance(p_item.get(p_req), str):
                        errors.append(f"Portfolio item {idx} must have non-empty string '{p_req}'.")

    # ai_tools, style_tags (must be lists if present)
    for opt_list in ["ai_tools", "style_tags"]:
        val = data.get(opt_list)
        if val is not None and not isinstance(val, list):
            errors.append(f"Field '{opt_list}' must be a list.")

    return errors

