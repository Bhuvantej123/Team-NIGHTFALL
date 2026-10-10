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
