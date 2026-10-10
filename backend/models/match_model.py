"""
backend/models/match_model.py
SQLAlchemy ORM model for persisted MatchResults.
P1 owns all changes.
"""

import json
from sqlalchemy import Column, String, Float, Boolean, Text
from backend.models.database import Base


class MatchResultModel(Base):
    """
    Persisted match results for a campaign.
    Keyed by campaign_id; all results from the latest run are stored together.
    When /match is re-run, previous results for that campaign are replaced.
    """
    __tablename__ = "match_results"

    id = Column(String, primary_key=True)                # UUID
    campaign_id = Column(String, nullable=False, index=True)
    creator_id = Column(String, nullable=False)
    creator_snapshot = Column(Text, nullable=False)      # JSON: full CreatorProfile dict
    total_score = Column(Float, nullable=False)
    score_breakdown = Column(Text, nullable=False)       # JSON: ScoreBreakdown dict
    evidence = Column(Text, nullable=False, default="{}") # JSON: dict[str, list[str]]
    explanation = Column(Text, nullable=False, default="")
    budget_fit = Column(Boolean, nullable=False, default=True)
    over_budget = Column(Boolean, nullable=False, default=False)
    availability_fit = Column(Boolean, nullable=False, default=True)
    matched_at = Column(String, nullable=False)          # ISO 8601

    def to_dict(self) -> dict:
        return {
            "campaign_id": self.campaign_id,
            "creator_id": self.creator_id,
            "creator": json.loads(self.creator_snapshot),
            "total_score": self.total_score,
            "score_breakdown": json.loads(self.score_breakdown),
            "evidence": json.loads(self.evidence),
            "explanation": self.explanation,
            "budget_fit": self.budget_fit,
            "over_budget": self.over_budget,
            "availability_fit": self.availability_fit,
            "matched_at": self.matched_at,
        }
