"""
backend/models/shortlist_model.py
SQLAlchemy ORM model for persisted Campaign Shortlist entries.
P1 owns all changes.
"""

from sqlalchemy import Column, String, UniqueConstraint
from backend.models.database import Base


class CampaignShortlistModel(Base):
    """
    Persisted shortlist entries for a campaign.
    Ensures unique (campaign_id, creator_id) pairs at the database level.
    """
    __tablename__ = "campaign_shortlists"
    __table_args__ = (
        UniqueConstraint("campaign_id", "creator_id", name="uq_campaign_creator_shortlist"),
    )

    id = Column(String, primary_key=True)  # UUID
    campaign_id = Column(String, nullable=False, index=True)
    creator_id = Column(String, nullable=False, index=True)
    added_at = Column(String, nullable=False)  # ISO 8601

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "campaign_id": self.campaign_id,
            "creator_id": self.creator_id,
            "added_at": self.added_at,
        }
