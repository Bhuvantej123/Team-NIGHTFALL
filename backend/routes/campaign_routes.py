"""
backend/routes/campaign_routes.py
Flask routes for campaign management, brief generation/regeneration, and brief editing.
P1 owns all changes.
"""

import logging
from flask import Blueprint, request, jsonify, current_app

from backend.services.brief_service import (
    create_campaign,
    get_campaign_detail,
    list_campaigns,
    generate_or_regenerate_brief,
    update_editable_brief_fields,
    CampaignValidationError,
    CampaignNotFoundError,
    ImmutableFieldError,
)
from backend.providers.gemini_provider import (
    GeminiRateLimitError,
    GeminiTimeoutError,
    GeminiAPIError,
)
from backend.providers.mock_provider import MockProvider

logger = logging.getLogger(__name__)

campaign_bp = Blueprint("campaigns", __name__)


@campaign_bp.post("/campaigns")
def create_new_campaign():
    """
    POST /api/campaigns
    Accepts:
      - brand_name: str (required)
      - product_description: str (required)
      - target_audience: str (required)
      - budget_min: number (required, >= 0)
      - budget_max: number (required, >= budget_min)
      - currency: str (required, e.g. 'USD')
      - deadline: str (optional ISO 8601 date or null)
    Returns HTTP 201 with the created CampaignBrief and CampaignWorkflow.
    """
    payload = request.get_json(silent=True)
    if payload is None:
        return jsonify({
            "error": "Request body must be valid JSON.",
            "code": "VALIDATION_ERROR",
            "details": {},
        }), 400

    try:
        brief_dict, workflow_dict = create_campaign(payload)
        response_data = {
            **brief_dict,
            "brief": brief_dict,
            "workflow": workflow_dict,
        }
        return jsonify(response_data), 201
    except CampaignValidationError as exc:
        return jsonify({
            "error": exc.message,
            "code": exc.code,
            "details": exc.details,
        }), 400
    except Exception as exc:
        logger.exception("Unexpected error in POST /api/campaigns: %s", exc)
        return jsonify({
            "error": "An internal error occurred while creating the campaign.",
            "code": "INTERNAL_ERROR",
            "details": {},
        }), 500


@campaign_bp.get("/campaigns")
def get_campaigns():
    """
    GET /api/campaigns
    Lists all saved campaigns, newest first.
    """
    try:
        campaigns = list_campaigns()
        return jsonify(campaigns), 200
    except Exception as exc:
        logger.exception("Unexpected error in GET /api/campaigns: %s", exc)
        return jsonify({
            "error": "An internal error occurred while retrieving campaigns.",
            "code": "INTERNAL_ERROR",
            "details": {},
        }), 500


@campaign_bp.get("/campaigns/<campaign_id>")
def get_campaign(campaign_id: str):
    """
    GET /api/campaigns/<campaign_id>
    Returns:
      - brief: serialized CampaignBrief
      - workflow: serialized CampaignWorkflow
    Returns 404 NOT_FOUND for unknown campaigns.
    """
    try:
        detail = get_campaign_detail(campaign_id)
        if detail is None:
            return jsonify({
                "error": f"Campaign with ID '{campaign_id}' was not found.",
                "code": "NOT_FOUND",
                "details": {"campaign_id": campaign_id},
            }), 404
        return jsonify(detail), 200
    except Exception as exc:
        logger.exception("Unexpected error in GET /api/campaigns/%s: %s", campaign_id, exc)
        return jsonify({
            "error": "An internal error occurred while retrieving the campaign.",
            "code": "INTERNAL_ERROR",
            "details": {},
        }), 500


@campaign_bp.post("/campaigns/<campaign_id>/generate-brief")
def generate_brief(campaign_id: str):
    """
    POST /api/campaigns/<campaign_id>/generate-brief
    Generates or regenerates editable brief fields using configured provider.
    Preserves immutable fields and user_edited_fields.
    Returns 200 with BriefGenerationResponse shape.
    """
    provider = current_app.config.get("BRIEF_PROVIDER")
    if provider is None:
        provider = MockProvider()

    try:
        result = generate_or_regenerate_brief(campaign_id, provider)
        return jsonify(result), 200
    except CampaignNotFoundError as exc:
        return jsonify({
            "error": exc.message,
            "code": exc.code,
            "details": exc.details,
        }), 404
    except GeminiRateLimitError as exc:
        logger.warning("Gemini rate limit in brief generation: %s", exc)
        return jsonify({
            "error": "Gemini API rate limit reached. Please wait a moment and retry.",
            "code": "RATE_LIMIT_EXCEEDED",
            "details": {"retry_after": 30},
        }), 429
    except GeminiTimeoutError as exc:
        logger.warning("Gemini timeout in brief generation: %s", exc)
        return jsonify({
            "error": "Brief generation timed out waiting for the AI provider.",
            "code": "GATEWAY_TIMEOUT",
            "details": {},
        }), 504
    except GeminiAPIError as exc:
        logger.error("Gemini API error in brief generation: %s", exc)
        return jsonify({
            "error": "Upstream AI provider encountered an error.",
            "code": "UPSTREAM_ERROR",
            "details": {},
        }), 502
    except Exception as exc:
        logger.exception("Unexpected error in generate-brief for %s: %s", campaign_id, exc)
        return jsonify({
            "error": "An internal error occurred while generating the campaign brief.",
            "code": "INTERNAL_ERROR",
            "details": {},
        }), 500


@campaign_bp.patch("/campaigns/<campaign_id>")
def edit_brief(campaign_id: str):
    """
    PATCH /api/campaigns/<campaign_id>
    Accepts partial updates to editable brief fields:
      campaign_title, objective, deliverables, preferred_platforms,
      required_skills, preferred_niches, preferred_style, tone,
      key_messages, call_to_action.
    Rejects modification of immutable fields with 400 IMMUTABLE_FIELD.
    Adds edited fields to user_edited_fields.
    """
    payload = request.get_json(silent=True)
    if payload is None:
        return jsonify({
            "error": "Request body must be valid JSON.",
            "code": "VALIDATION_ERROR",
            "details": {},
        }), 400

    try:
        updated_brief = update_editable_brief_fields(campaign_id, payload)
        return jsonify(updated_brief), 200
    except ImmutableFieldError as exc:
        return jsonify({
            "error": exc.message,
            "code": exc.code,
            "details": exc.details,
        }), 400
    except CampaignValidationError as exc:
        return jsonify({
            "error": exc.message,
            "code": exc.code,
            "details": exc.details,
        }), 400
    except CampaignNotFoundError as exc:
        return jsonify({
            "error": exc.message,
            "code": exc.code,
            "details": exc.details,
        }), 404
    except Exception as exc:
        logger.exception("Unexpected error in PATCH /api/campaigns/%s: %s", campaign_id, exc)
        return jsonify({
            "error": "An internal error occurred while updating the campaign brief.",
            "code": "INTERNAL_ERROR",
            "details": {},
        }), 500
