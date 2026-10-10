"""
backend/services/shortlist_service.py
Convenience re-exports for shortlist persistence operations.
P1 owns all changes.
"""

from backend.services.workflow_service import (
    add_to_shortlist,
    remove_from_shortlist,
    get_shortlist,
    transition_campaign_status,
    WorkflowCampaignNotFoundError,
    WorkflowCreatorNotFoundError,
    ShortlistEntryNotFoundError,
    WorkflowValidationError,
    InvalidStatusTransitionError,
)

__all__ = [
    "add_to_shortlist",
    "remove_from_shortlist",
    "get_shortlist",
    "transition_campaign_status",
    "WorkflowCampaignNotFoundError",
    "WorkflowCreatorNotFoundError",
    "ShortlistEntryNotFoundError",
    "WorkflowValidationError",
    "InvalidStatusTransitionError",
]
