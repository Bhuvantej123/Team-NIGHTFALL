"""
backend/routes/shortlist_routes.py
Flask routes for campaign shortlist operations and workflow status progression.
P1 owns all changes.
"""

import logging
from flask import Blueprint, request, jsonify

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

logger = logging.getLogger(__name__)

shortlist_bp = Blueprint("shortlist", __name__)


@shortlist_bp.post("/campaigns/<campaign_id>/shortlist")
def add_creator_to_shortlist(campaign_id: str):
    """
    POST /api/campaigns/<campaign_id>/shortlist
    Adds a creator to the campaign shortlist.
    Body: {"creator_id": "string"}
    Requires creator to be present in saved match results.
    Advances workflow and brief status to 'shortlisted' on first addition.
    """
    payload = request.get_json(silent=True)
    if payload is None:
        return jsonify({
            "error": "Request body must be valid JSON.",
            "code": "VALIDATION_ERROR",
            "details": {},
        }), 400

    creator_id = payload.get("creator_id")
    if not creator_id or not isinstance(creator_id, str) or not creator_id.strip():
        return jsonify({
            "error": "Field 'creator_id' is required and must be a non-empty string.",
            "code": "VALIDATION_ERROR",
            "details": {"required_fields": ["creator_id"]},
        }), 400

    try:
        result = add_to_shortlist(campaign_id, creator_id.strip())
        return jsonify(result), 200
    except WorkflowCampaignNotFoundError as exc:
        return jsonify({
            "error": exc.message,
            "code": exc.code,
            "details": {"campaign_id": exc.campaign_id},
        }), 404
    except WorkflowCreatorNotFoundError as exc:
        return jsonify({
            "error": exc.message,
            "code": exc.code,
            "details": {"creator_id": exc.creator_id},
        }), 404
    except WorkflowValidationError as exc:
        return jsonify({
            "error": exc.message,
            "code": exc.code,
            "details": exc.details,
        }), 400
    except Exception as exc:
        logger.exception("Unexpected error adding creator to shortlist: %s", exc)
        return jsonify({
            "error": "An internal error occurred while adding creator to shortlist.",
            "code": "INTERNAL_ERROR",
            "details": {},
        }), 500


@shortlist_bp.delete("/campaigns/<campaign_id>/shortlist/<creator_id>")
def remove_creator_from_shortlist(campaign_id: str, creator_id: str):
    """
    DELETE /api/campaigns/<campaign_id>/shortlist/<creator_id>
    Removes a creator from the campaign shortlist.
    Returns 404 if campaign or creator not in shortlist.
    """
    try:
        result = remove_from_shortlist(campaign_id, creator_id)
        return jsonify(result), 200
    except WorkflowCampaignNotFoundError as exc:
        return jsonify({
            "error": exc.message,
            "code": exc.code,
            "details": {"campaign_id": exc.campaign_id},
        }), 404
    except ShortlistEntryNotFoundError as exc:
        return jsonify({
            "error": exc.message,
            "code": exc.code,
            "details": exc.details,
        }), 404
    except Exception as exc:
        logger.exception("Unexpected error removing creator from shortlist: %s", exc)
        return jsonify({
            "error": "An internal error occurred while removing creator from shortlist.",
            "code": "INTERNAL_ERROR",
            "details": {},
        }), 500


@shortlist_bp.get("/campaigns/<campaign_id>/shortlist")
def retrieve_campaign_shortlist(campaign_id: str):
    """
    GET /api/campaigns/<campaign_id>/shortlist
    Retrieves the persisted shortlist for a campaign.
    Returns 404 if campaign does not exist.
    """
    try:
        result = get_shortlist(campaign_id)
        return jsonify(result), 200
    except WorkflowCampaignNotFoundError as exc:
        return jsonify({
            "error": exc.message,
            "code": exc.code,
            "details": {"campaign_id": exc.campaign_id},
        }), 404
    except Exception as exc:
        logger.exception("Unexpected error retrieving shortlist: %s", exc)
        return jsonify({
            "error": "An internal error occurred while retrieving campaign shortlist.",
            "code": "INTERNAL_ERROR",
            "details": {},
        }), 500


@shortlist_bp.patch("/campaigns/<campaign_id>/status")
def update_campaign_status(campaign_id: str):
    """
    PATCH /api/campaigns/<campaign_id>/status
    Advances campaign workflow status (e.g. to 'completed').
    Body: {"workflow_status": "completed"} or {"status": "completed"}
    Rejects invalid or backward transitions with 400 INVALID_TRANSITION.
    """
    payload = request.get_json(silent=True)
    if payload is None:
        return jsonify({
            "error": "Request body must be valid JSON.",
            "code": "VALIDATION_ERROR",
            "details": {},
        }), 400

    new_status = payload.get("workflow_status") or payload.get("status")
    if not new_status or not isinstance(new_status, str) or not new_status.strip():
        return jsonify({
            "error": "Field 'workflow_status' or 'status' is required.",
            "code": "VALIDATION_ERROR",
            "details": {"required_fields": ["workflow_status"]},
        }), 400

    try:
        result = transition_campaign_status(campaign_id, new_status.strip())
        return jsonify(result), 200
    except WorkflowCampaignNotFoundError as exc:
        return jsonify({
            "error": exc.message,
            "code": exc.code,
            "details": {"campaign_id": exc.campaign_id},
        }), 404
    except InvalidStatusTransitionError as exc:
        return jsonify({
            "error": exc.message,
            "code": exc.code,
            "details": exc.details,
        }), 400
    except WorkflowValidationError as exc:
        return jsonify({
            "error": exc.message,
            "code": exc.code,
            "details": exc.details,
        }), 400
    except Exception as exc:
        logger.exception("Unexpected error updating campaign status: %s", exc)
        return jsonify({
            "error": "An internal error occurred while updating campaign status.",
            "code": "INTERNAL_ERROR",
            "details": {},
        }), 500
