"""
backend/services/workflow_service.py
Workflow state transitions and shortlist persistence for CreatorConnect AI.
P1 owns all changes.
"""

from datetime import datetime, timezone
import json
import logging
from typing import Optional
import uuid

from sqlalchemy.exc import IntegrityError

from backend.contracts.campaign import (
    CAMPAIGN_STATUS_VALUES,
    WORKFLOW_TRANSITIONS,
)
from backend.models.database import get_session
from backend.models.campaign_model import CampaignBriefModel, CampaignWorkflowModel
from backend.models.creator_model import CreatorModel
from backend.models.match_model import MatchResultModel
from backend.models.shortlist_model import CampaignShortlistModel

logger = logging.getLogger(__name__)

STATUS_ORDER = {
    "draft": 0,
    "brief_ready": 1,
    "matches_ready": 2,
    "shortlisted": 3,
    "completed": 4,
}


# ── Custom Exceptions ──────────────────────────────────────────────────────────

class WorkflowCampaignNotFoundError(Exception):
    def __init__(self, message: str, campaign_id: str):
        super().__init__(message)
        self.message = message
        self.campaign_id = campaign_id
        self.code = "NOT_FOUND"


class WorkflowCreatorNotFoundError(Exception):
    def __init__(self, message: str, creator_id: str):
        super().__init__(message)
        self.message = message
        self.creator_id = creator_id
        self.code = "NOT_FOUND"


class ShortlistEntryNotFoundError(Exception):
    def __init__(self, message: str, details: Optional[dict] = None):
        super().__init__(message)
        self.message = message
        self.details = details or {}
        self.code = "NOT_FOUND"


class WorkflowValidationError(Exception):
    def __init__(self, message: str, details: Optional[dict] = None, code: str = "VALIDATION_ERROR"):
        super().__init__(message)
        self.message = message
        self.details = details or {}
        self.code = code


class InvalidStatusTransitionError(Exception):
    def __init__(self, message: str, details: Optional[dict] = None):
        super().__init__(message)
        self.message = message
        self.details = details or {}
        self.code = "INVALID_TRANSITION"


# ── Shortlist Operations ──────────────────────────────────────────────────────

def add_to_shortlist(campaign_id: str, creator_id: str) -> dict:
    """
    Adds a creator to a campaign's shortlist.
    Validations:
      - Campaign must exist (404).
      - Creator must exist (404).
      - Creator must belong to saved matching results for this campaign (400 VALIDATION_ERROR).
      - Creator must not already be in shortlist (400 VALIDATION_ERROR).
    Advances workflow and brief status to 'shortlisted' if currently in matches_ready or earlier.
    Persists atomically to CampaignShortlistModel and updates CampaignWorkflowModel.
    """
    if not creator_id or not isinstance(creator_id, str) or not creator_id.strip():
        raise WorkflowValidationError("Field 'creator_id' is required and must be a non-empty string.")

    creator_id = creator_id.strip()

    with get_session() as session:
        # 1. Verify campaign exists
        brief = session.get(CampaignBriefModel, campaign_id)
        if brief is None:
            raise WorkflowCampaignNotFoundError(
                f"Campaign with ID '{campaign_id}' was not found.",
                campaign_id=campaign_id,
            )

        # 2. Verify creator exists
        creator = session.get(CreatorModel, creator_id)
        if creator is None:
            raise WorkflowCreatorNotFoundError(
                f"Creator with ID '{creator_id}' was not found.",
                creator_id=creator_id,
            )

        # 3. Verify creator is in saved match results for this campaign
        match_entry = session.query(MatchResultModel).filter(
            MatchResultModel.campaign_id == campaign_id,
            MatchResultModel.creator_id == creator_id,
        ).first()

        if match_entry is None:
            raise WorkflowValidationError(
                f"Creator '{creator_id}' is not present in saved match results for campaign '{campaign_id}'.",
                details={"campaign_id": campaign_id, "creator_id": creator_id},
            )

        # 4. Check for duplicate shortlist entry
        existing_shortlist = session.query(CampaignShortlistModel).filter(
            CampaignShortlistModel.campaign_id == campaign_id,
            CampaignShortlistModel.creator_id == creator_id,
        ).first()

        if existing_shortlist is not None:
            raise WorkflowValidationError(
                f"Creator '{creator_id}' is already shortlisted for campaign '{campaign_id}'.",
                details={"campaign_id": campaign_id, "creator_id": creator_id},
            )

        # 5. Fetch or initialize workflow
        workflow = session.query(CampaignWorkflowModel).filter(
            CampaignWorkflowModel.campaign_id == campaign_id,
        ).first()

        now_iso = datetime.now(timezone.utc).isoformat()
        if workflow is None:
            workflow = CampaignWorkflowModel(
                id=str(uuid.uuid4()),
                campaign_id=campaign_id,
                selected_creator_ids="[]",
                workflow_status="draft",
                created_at=now_iso,
                updated_at=now_iso,
            )
            session.add(workflow)

        try:
            current_selected = json.loads(workflow.selected_creator_ids)
        except Exception:
            current_selected = []

        if creator_id in current_selected:
            raise WorkflowValidationError(
                f"Creator '{creator_id}' is already shortlisted for campaign '{campaign_id}'.",
                details={"campaign_id": campaign_id, "creator_id": creator_id},
            )

        current_selected.append(creator_id)
        workflow.selected_creator_ids = json.dumps(current_selected)
        workflow.updated_at = now_iso

        # Advance workflow status to 'shortlisted' if currently in draft, brief_ready, or matches_ready
        if workflow.workflow_status in ("draft", "brief_ready", "matches_ready"):
            workflow.workflow_status = "shortlisted"

        # Keep brief status synchronized
        if brief.status in ("draft", "brief_ready", "matches_ready"):
            brief.status = "shortlisted"

        # Create persistent shortlist entry
        shortlist_entry = CampaignShortlistModel(
            id=str(uuid.uuid4()),
            campaign_id=campaign_id,
            creator_id=creator_id,
            added_at=now_iso,
        )
        session.add(shortlist_entry)

        try:
            session.commit()
        except IntegrityError:
            session.rollback()
            raise WorkflowValidationError(
                f"Creator '{creator_id}' is already shortlisted for campaign '{campaign_id}'.",
                details={"campaign_id": campaign_id, "creator_id": creator_id},
            )
        except Exception:
            session.rollback()
            raise

        # Query all shortlisted creators to build full response
        shortlist_records = session.query(CampaignShortlistModel).filter(
            CampaignShortlistModel.campaign_id == campaign_id,
        ).order_by(CampaignShortlistModel.added_at.asc()).all()

        creator_ids = [r.creator_id for r in shortlist_records]
        creators = session.query(CreatorModel).filter(
            CreatorModel.id.in_(creator_ids),
        ).all() if creator_ids else []
        creator_map = {c.id: c.to_dict() for c in creators}

        shortlist_items = []
        for r in shortlist_records:
            c_dict = creator_map.get(r.creator_id)
            shortlist_items.append({
                "creator_id": r.creator_id,
                "display_name": c_dict.get("display_name", "") if c_dict else "",
                "handle": c_dict.get("handle", "") if c_dict else "",
                "starting_price": c_dict.get("starting_price", 0.0) if c_dict else 0.0,
                "availability": c_dict.get("availability", True) if c_dict else True,
                "added_at": r.added_at,
                "creator": c_dict,
            })

        return {
            "id": workflow.id,
            "campaign_id": workflow.campaign_id,
            "selected_creator_ids": current_selected,
            "workflow_status": workflow.workflow_status,
            "created_at": workflow.created_at,
            "updated_at": workflow.updated_at,
            "shortlist": shortlist_items,
            "total_shortlisted": len(current_selected),
        }


def remove_from_shortlist(campaign_id: str, creator_id: str) -> dict:
    """
    Removes a creator from a campaign's shortlist.
    Validations:
      - Campaign must exist (404).
      - Entry must exist in shortlist (404).
    Safe removal does not affect other campaigns or creators.
    Preserves workflow status (forward-only transitions).
    """
    with get_session() as session:
        brief = session.get(CampaignBriefModel, campaign_id)
        if brief is None:
            raise WorkflowCampaignNotFoundError(
                f"Campaign with ID '{campaign_id}' was not found.",
                campaign_id=campaign_id,
            )

        entry = session.query(CampaignShortlistModel).filter(
            CampaignShortlistModel.campaign_id == campaign_id,
            CampaignShortlistModel.creator_id == creator_id,
        ).first()

        if entry is None:
            raise ShortlistEntryNotFoundError(
                f"Creator '{creator_id}' is not in the shortlist for campaign '{campaign_id}'.",
                details={"campaign_id": campaign_id, "creator_id": creator_id},
            )

        session.delete(entry)

        now_iso = datetime.now(timezone.utc).isoformat()
        workflow = session.query(CampaignWorkflowModel).filter(
            CampaignWorkflowModel.campaign_id == campaign_id,
        ).first()

        current_selected = []
        if workflow is not None:
            try:
                current_selected = [cid for cid in json.loads(workflow.selected_creator_ids) if cid != creator_id]
            except Exception:
                current_selected = []
            workflow.selected_creator_ids = json.dumps(current_selected)
            workflow.updated_at = now_iso

        try:
            session.commit()
        except Exception:
            session.rollback()
            raise

        # Query remaining shortlisted creators
        remaining_records = session.query(CampaignShortlistModel).filter(
            CampaignShortlistModel.campaign_id == campaign_id,
        ).order_by(CampaignShortlistModel.added_at.asc()).all()

        creator_ids = [r.creator_id for r in remaining_records]
        creators = session.query(CreatorModel).filter(
            CreatorModel.id.in_(creator_ids),
        ).all() if creator_ids else []
        creator_map = {c.id: c.to_dict() for c in creators}

        shortlist_items = []
        for r in remaining_records:
            c_dict = creator_map.get(r.creator_id)
            shortlist_items.append({
                "creator_id": r.creator_id,
                "display_name": c_dict.get("display_name", "") if c_dict else "",
                "handle": c_dict.get("handle", "") if c_dict else "",
                "starting_price": c_dict.get("starting_price", 0.0) if c_dict else 0.0,
                "availability": c_dict.get("availability", True) if c_dict else True,
                "added_at": r.added_at,
                "creator": c_dict,
            })

        return {
            "id": workflow.id if workflow else "",
            "campaign_id": campaign_id,
            "selected_creator_ids": current_selected,
            "workflow_status": workflow.workflow_status if workflow else brief.status,
            "created_at": workflow.created_at if workflow else "",
            "updated_at": workflow.updated_at if workflow else now_iso,
            "shortlist": shortlist_items,
            "total_shortlisted": len(current_selected),
        }


def get_shortlist(campaign_id: str) -> dict:
    """
    Retrieves the persisted shortlist for a campaign.
    Validations:
      - Campaign must exist (404).
    Returns empty list if no creators have been shortlisted yet.
    """
    with get_session() as session:
        brief = session.get(CampaignBriefModel, campaign_id)
        if brief is None:
            raise WorkflowCampaignNotFoundError(
                f"Campaign with ID '{campaign_id}' was not found.",
                campaign_id=campaign_id,
            )

        workflow = session.query(CampaignWorkflowModel).filter(
            CampaignWorkflowModel.campaign_id == campaign_id,
        ).first()

        records = session.query(CampaignShortlistModel).filter(
            CampaignShortlistModel.campaign_id == campaign_id,
        ).order_by(CampaignShortlistModel.added_at.asc()).all()

        creator_ids = [r.creator_id for r in records]
        creators = session.query(CreatorModel).filter(
            CreatorModel.id.in_(creator_ids),
        ).all() if creator_ids else []
        creator_map = {c.id: c.to_dict() for c in creators}

        # Query matching score if present
        matches = session.query(MatchResultModel).filter(
            MatchResultModel.campaign_id == campaign_id,
            MatchResultModel.creator_id.in_(creator_ids),
        ).all() if creator_ids else []
        match_map = {m.creator_id: m.total_score for m in matches}

        shortlist_items = []
        for r in records:
            c_dict = creator_map.get(r.creator_id)
            shortlist_items.append({
                "creator_id": r.creator_id,
                "display_name": c_dict.get("display_name", "") if c_dict else "",
                "handle": c_dict.get("handle", "") if c_dict else "",
                "starting_price": c_dict.get("starting_price", 0.0) if c_dict else 0.0,
                "availability": c_dict.get("availability", True) if c_dict else True,
                "added_at": r.added_at,
                "match_score": match_map.get(r.creator_id),
                "creator": c_dict,
            })

        return {
            "campaign_id": campaign_id,
            "selected_creator_ids": creator_ids,
            "workflow_status": workflow.workflow_status if workflow else brief.status,
            "shortlist": shortlist_items,
            "total_shortlisted": len(shortlist_items),
        }


# ── Workflow State Transitions ────────────────────────────────────────────────

def transition_campaign_status(campaign_id: str, new_status: str) -> dict:
    """
    Transitions campaign workflow and brief status according to Architecture v3.
    Forward-only transitions:
      draft -> brief_ready -> matches_ready -> shortlisted -> completed
    Validations:
      - Campaign must exist (404).
      - new_status must be a valid status value.
      - Backward transitions are rejected with 400 INVALID_TRANSITION.
      - Jumping directly to 'completed' without shortlisting is rejected with 400 INVALID_TRANSITION.
      - Idempotent: repeated request to current status returns 200 without corrupting state.
      - Synchronizes CampaignWorkflowModel.workflow_status and CampaignBriefModel.status.
    """
    if not new_status or not isinstance(new_status, str):
        raise WorkflowValidationError(
            "Field 'workflow_status' or 'status' is required.",
            code="VALIDATION_ERROR",
        )

    new_status = new_status.strip()

    if new_status not in CAMPAIGN_STATUS_VALUES:
        raise InvalidStatusTransitionError(
            f"Invalid status '{new_status}'. Allowed statuses: {sorted(list(CAMPAIGN_STATUS_VALUES))}.",
            details={"requested_status": new_status, "allowed_statuses": sorted(list(CAMPAIGN_STATUS_VALUES))},
        )

    with get_session() as session:
        brief = session.get(CampaignBriefModel, campaign_id)
        if brief is None:
            raise WorkflowCampaignNotFoundError(
                f"Campaign with ID '{campaign_id}' was not found.",
                campaign_id=campaign_id,
            )

        workflow = session.query(CampaignWorkflowModel).filter(
            CampaignWorkflowModel.campaign_id == campaign_id,
        ).first()

        now_iso = datetime.now(timezone.utc).isoformat()
        if workflow is None:
            workflow = CampaignWorkflowModel(
                id=str(uuid.uuid4()),
                campaign_id=campaign_id,
                selected_creator_ids="[]",
                workflow_status=brief.status,
                created_at=now_iso,
                updated_at=now_iso,
            )
            session.add(workflow)

        current_status = workflow.workflow_status

        # 1. Idempotent check
        if current_status == new_status:
            return {
                "id": workflow.id,
                "campaign_id": campaign_id,
                "selected_creator_ids": json.loads(workflow.selected_creator_ids),
                "workflow_status": workflow.workflow_status,
                "created_at": workflow.created_at,
                "updated_at": workflow.updated_at,
                "brief": brief.to_dict(),
                "workflow": workflow.to_dict(),
            }

        current_idx = STATUS_ORDER.get(current_status, -1)
        new_idx = STATUS_ORDER.get(new_status, -1)

        # 2. Reject backward transitions
        if new_idx < current_idx:
            raise InvalidStatusTransitionError(
                f"Cannot transition backwards from '{current_status}' to '{new_status}'. Workflow transitions are forward-only.",
                details={"current_status": current_status, "requested_status": new_status},
            )

        # 3. Transition to 'completed'
        if new_status == "completed":
            if current_status != "shortlisted":
                if current_status == "matches_ready":
                    raise InvalidStatusTransitionError(
                        "Cannot mark campaign complete directly from 'matches_ready'. Creator(s) must be shortlisted first.",
                        details={"current_status": current_status, "requested_status": new_status},
                    )
                raise InvalidStatusTransitionError(
                    f"Cannot mark campaign complete from '{current_status}'. Campaign must be in 'shortlisted' status.",
                    details={"current_status": current_status, "requested_status": new_status},
                )

        # 4. Transition to 'shortlisted'
        elif new_status == "shortlisted":
            shortlist_count = session.query(CampaignShortlistModel).filter(
                CampaignShortlistModel.campaign_id == campaign_id,
            ).count()
            if shortlist_count == 0:
                raise InvalidStatusTransitionError(
                    "Cannot transition campaign to 'shortlisted' without any shortlisted creators.",
                    details={"current_status": current_status, "requested_status": new_status},
                )

        # 5. Non-sequential jumps
        elif new_idx > current_idx + 1:
            raise InvalidStatusTransitionError(
                f"Cannot skip workflow stages from '{current_status}' to '{new_status}'.",
                details={"current_status": current_status, "requested_status": new_status},
            )

        # Apply transition
        workflow.workflow_status = new_status
        workflow.updated_at = now_iso
        brief.status = new_status

        try:
            session.commit()
        except Exception:
            session.rollback()
            raise

        return {
            "id": workflow.id,
            "campaign_id": campaign_id,
            "selected_creator_ids": json.loads(workflow.selected_creator_ids),
            "workflow_status": workflow.workflow_status,
            "created_at": workflow.created_at,
            "updated_at": workflow.updated_at,
            "brief": brief.to_dict(),
            "workflow": workflow.to_dict(),
        }
