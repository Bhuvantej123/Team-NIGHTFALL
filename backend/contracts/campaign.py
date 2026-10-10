"""
backend/contracts/campaign.py
Canonical Python data shapes for CampaignBrief and CampaignWorkflow.
P1 owns all changes. Other team members must not edit this file.
"""

from dataclasses import dataclass, field
from typing import Optional


# ── Valid values ───────────────────────────────────────────────────────────────

GENERATED_BY_VALUES = frozenset({
    "gemini",          # Gemini generated all editable fields successfully
    "gemini_partial",  # Gemini generated some fields; user-edited fields preserved
    "gemini_raw",      # Gemini returned unparseable output; raw text stored
    "mock",            # Deterministic mock provider was used
    "user",            # Fields set directly by the user; no AI generation yet
})

CAMPAIGN_STATUS_VALUES = frozenset({
    "draft",           # Brief form started; brief not yet generated
    "brief_ready",     # Brief generated (Gemini or mock)
    "matches_ready",   # Matching engine has run; results persisted
    "shortlisted",     # At least one creator added to shortlist
    "completed",       # Campaign finalised
})

# Forward-only transition map (for demo)
WORKFLOW_TRANSITIONS: dict[str, str] = {
    "draft":          "brief_ready",
    "brief_ready":    "matches_ready",
    "matches_ready":  "shortlisted",
    "shortlisted":    "completed",
}

# ── Immutable brief fields (cannot be changed after campaign creation) ─────────
IMMUTABLE_BRIEF_FIELDS = frozenset({
    "brand_name", "product_description", "target_audience",
    "budget_min", "budget_max", "currency", "deadline",
})

# ── Editable brief fields (user or Gemini may populate/update) ─────────────────
EDITABLE_BRIEF_FIELDS = frozenset({
    "campaign_title", "objective", "deliverables", "preferred_platforms",
    "required_skills", "preferred_niches", "preferred_style", "tone",
    "key_messages", "call_to_action",
})


@dataclass
class CampaignBrief:
    """
    A structured campaign brief combining user inputs and AI-generated content.

    Immutable after creation: brand_name, product_description, target_audience,
    budget_min, budget_max, currency, deadline.

    Gemini MUST NOT alter immutable fields.
    Fields in user_edited_fields are preserved verbatim on regeneration.

    budget_min <= budget_max must always hold.
    generated_by must be one of GENERATED_BY_VALUES.
    status must be one of CAMPAIGN_STATUS_VALUES.
    """
    id: str
    brand_name: str                                # Immutable after creation
    product_description: str                       # Immutable after creation
    target_audience: str                           # Immutable after creation
    budget_min: float                              # Immutable; never changed by Gemini
    budget_max: float                              # Immutable; never changed by Gemini
    currency: str                                  # Immutable; never changed by Gemini
    deadline: Optional[str]                        # Immutable; ISO 8601 date or None
    campaign_title: str = ""
    objective: str = ""
    deliverables: list[str] = field(default_factory=list)
    preferred_platforms: list[str] = field(default_factory=list)
    required_skills: list[str] = field(default_factory=list)
    preferred_niches: list[str] = field(default_factory=list)
    preferred_style: str = ""
    tone: str = ""
    key_messages: list[str] = field(default_factory=list)
    call_to_action: str = ""
    generated_by: str = "user"                    # One of GENERATED_BY_VALUES
    user_edited_fields: list[str] = field(default_factory=list)  # Tracks manual edits
    status: str = "draft"                          # One of CAMPAIGN_STATUS_VALUES
    created_at: str = ""                           # ISO 8601


@dataclass
class CampaignWorkflow:
    """
    Tracks the lifecycle state of a campaign through the demo workflow.

    Forward-only transitions: draft → brief_ready → matches_ready → shortlisted → completed
    """
    id: str
    campaign_id: str                               # FK → CampaignBrief.id
    selected_creator_ids: list[str] = field(default_factory=list)
    workflow_status: str = "draft"                 # One of CAMPAIGN_STATUS_VALUES
    created_at: str = ""                           # ISO 8601
    updated_at: str = ""                           # ISO 8601
