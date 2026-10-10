"""
backend/models/creator_model.py
SQLAlchemy ORM model for CreatorProfile.
P1 owns all changes.
"""

import json
from sqlalchemy import Column, String, Float, Boolean, Text, Integer
from backend.models.database import Base
from backend.contracts.creator import (
    CreatorProfile, PlatformDetail, PortfolioItem,
)


class CreatorModel(Base):
    __tablename__ = "creators"

    id = Column(String, primary_key=True)
    display_name = Column(String, nullable=False)
    handle = Column(String, nullable=False, unique=True)
    bio = Column(Text, nullable=False)
    skills = Column(Text, nullable=False, default="[]")          # JSON list
    ai_tools = Column(Text, nullable=False, default="[]")        # JSON list
    niches = Column(Text, nullable=False, default="[]")          # JSON list
    platforms = Column(Text, nullable=False, default="[]")       # JSON list of dicts
    portfolio_items = Column(Text, nullable=False, default="[]") # JSON list of dicts
    style_tags = Column(Text, nullable=False, default="[]")      # JSON list
    starting_price = Column(Float, nullable=False, default=0.0)
    currency = Column(String, nullable=False, default="USD")
    availability = Column(Boolean, nullable=False, default=True)
    portfolio_evidence = Column(Text, nullable=False, default="")
    created_at = Column(String, nullable=False)

    # ── Serialisation helpers ──────────────────────────────────────────────────

    def to_dataclass(self) -> CreatorProfile:
        platforms = [
            PlatformDetail(**p) for p in json.loads(self.platforms)
        ]
        portfolio_items = [
            PortfolioItem(**item) for item in json.loads(self.portfolio_items)
        ]
        return CreatorProfile(
            id=self.id,
            display_name=self.display_name,
            handle=self.handle,
            bio=self.bio,
            skills=json.loads(self.skills),
            ai_tools=json.loads(self.ai_tools),
            niches=json.loads(self.niches),
            platforms=platforms,
            portfolio_items=portfolio_items,
            style_tags=json.loads(self.style_tags),
            starting_price=self.starting_price,
            currency=self.currency,
            availability=self.availability,
            portfolio_evidence=self.portfolio_evidence,
            created_at=self.created_at,
        )

    def to_dict(self) -> dict:
        """JSON-serialisable dict matching the TS CreatorProfile interface."""
        return {
            "id": self.id,
            "display_name": self.display_name,
            "handle": self.handle,
            "bio": self.bio,
            "skills": json.loads(self.skills),
            "ai_tools": json.loads(self.ai_tools),
            "niches": json.loads(self.niches),
            "platforms": json.loads(self.platforms),
            "portfolio_items": json.loads(self.portfolio_items),
            "style_tags": json.loads(self.style_tags),
            "starting_price": self.starting_price,
            "currency": self.currency,
            "availability": self.availability,
            "portfolio_evidence": self.portfolio_evidence,
            "created_at": self.created_at,
        }

    @classmethod
    def from_dict(cls, data: dict) -> "CreatorModel":
        return cls(
            id=data["id"],
            display_name=data["display_name"],
            handle=data["handle"],
            bio=data["bio"],
            skills=json.dumps(data.get("skills", [])),
            ai_tools=json.dumps(data.get("ai_tools", [])),
            niches=json.dumps(data.get("niches", [])),
            platforms=json.dumps(data.get("platforms", [])),
            portfolio_items=json.dumps(data.get("portfolio_items", [])),
            style_tags=json.dumps(data.get("style_tags", [])),
            starting_price=float(data.get("starting_price", 0.0)),
            currency=data.get("currency", "USD"),
            availability=bool(data.get("availability", True)),
            portfolio_evidence=data.get("portfolio_evidence", ""),
            created_at=data.get("created_at", ""),
        )
