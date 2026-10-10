"""
backend/models/campaign_model.py
SQLAlchemy ORM models for CampaignBrief and CampaignWorkflow.
P1 owns all changes.
"""

import json
from sqlalchemy import Column, String, Float, Text, Boolean
from backend.models.database import Base


class CampaignBriefModel(Base):
    __tablename__ = "campaign_briefs"

    id = Column(String, primary_key=True)
    brand_name = Column(String, nullable=False)
    product_description = Column(Text, nullable=False)
    target_audience = Column(Text, nullable=False)
    budget_min = Column(Float, nullable=False)
    budget_max = Column(Float, nullable=False)
    currency = Column(String, nullable=False, default="USD")
    deadline = Column(String, nullable=True)
    campaign_title = Column(String, nullable=False, default="")
    objective = Column(Text, nullable=False, default="")
    deliverables = Column(Text, nullable=False, default="[]")         # JSON
    preferred_platforms = Column(Text, nullable=False, default="[]")  # JSON
    required_skills = Column(Text, nullable=False, default="[]")      # JSON
    preferred_niches = Column(Text, nullable=False, default="[]")     # JSON
    preferred_style = Column(String, nullable=False, default="")
    tone = Column(String, nullable=False, default="")
    key_messages = Column(Text, nullable=False, default="[]")         # JSON
    call_to_action = Column(Text, nullable=False, default="")
    generated_by = Column(String, nullable=False, default="user")
    user_edited_fields = Column(Text, nullable=False, default="[]")   # JSON list of field names
    status = Column(String, nullable=False, default="draft")
    created_at = Column(String, nullable=False)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "brand_name": self.brand_name,
            "product_description": self.product_description,
            "target_audience": self.target_audience,
            "budget_min": self.budget_min,
            "budget_max": self.budget_max,
            "currency": self.currency,
            "deadline": self.deadline,
            "campaign_title": self.campaign_title,
            "objective": self.objective,
            "deliverables": json.loads(self.deliverables),
            "preferred_platforms": json.loads(self.preferred_platforms),
            "required_skills": json.loads(self.required_skills),
            "preferred_niches": json.loads(self.preferred_niches),
            "preferred_style": self.preferred_style,
            "tone": self.tone,
            "key_messages": json.loads(self.key_messages),
            "call_to_action": self.call_to_action,
            "generated_by": self.generated_by,
            "user_edited_fields": json.loads(self.user_edited_fields),
            "status": self.status,
            "created_at": self.created_at,
        }


class CampaignWorkflowModel(Base):
    __tablename__ = "campaign_workflows"

    id = Column(String, primary_key=True)
    campaign_id = Column(String, nullable=False)
    selected_creator_ids = Column(Text, nullable=False, default="[]")  # JSON
    workflow_status = Column(String, nullable=False, default="draft")
    created_at = Column(String, nullable=False)
    updated_at = Column(String, nullable=False)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "campaign_id": self.campaign_id,
            "selected_creator_ids": json.loads(self.selected_creator_ids),
            "workflow_status": self.workflow_status,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
