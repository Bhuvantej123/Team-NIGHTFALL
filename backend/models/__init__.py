# backend/models/__init__.py
# Imports all models so Base.metadata.create_all() picks them up in one call.
from backend.models.creator_model import CreatorModel       # noqa: F401
from backend.models.campaign_model import CampaignBriefModel, CampaignWorkflowModel  # noqa: F401
from backend.models.match_model import MatchResultModel     # noqa: F401
from backend.models.shortlist_model import CampaignShortlistModel  # noqa: F401
