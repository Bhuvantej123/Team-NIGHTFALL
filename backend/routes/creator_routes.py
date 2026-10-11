"""
backend/routes/creator_routes.py
Flask routes for creator discovery and profile inspection.
P1 owns all changes.
"""

import logging
from flask import Blueprint, request, jsonify

from backend.services.creator_service import (
    list_creators,
    get_creator_by_id,
    CreatorValidationError,
)

logger = logging.getLogger(__name__)

creator_bp = Blueprint("creators", __name__)


@creator_bp.get("/creators")
def get_creators():
    """
    GET /api/creators
    Supports optional query filters:
      - niche: case-insensitive partial match
      - platform: case-insensitive exact match
      - skill: case-insensitive partial match
      - available: 'true' | 'false' (invalid returns 400 VALIDATION_ERROR)
      - q: free-text search across display_name, bio, style_tags
    Returns JSON array of creators (HTTP 200).
    """
    niche = request.args.get("niche")
    platform = request.args.get("platform")
    skill = request.args.get("skill")
    available = request.args.get("available")
    q = request.args.get("q")
    discipline = request.args.get("discipline")

    try:
        creators = list_creators(
            niche=niche,
            platform=platform,
            skill=skill,
            available=available,
            q=q,
            discipline=discipline,
        )
        return jsonify(creators), 200
    except CreatorValidationError as exc:
        return jsonify({
            "error": exc.message,
            "code": "VALIDATION_ERROR",
            "details": exc.details,
        }), 400
    except Exception as exc:
        logger.exception("Unexpected error in GET /api/creators: %s", exc)
        return jsonify({
            "error": "An internal error occurred while retrieving creators.",
            "code": "INTERNAL_ERROR",
            "details": {},
        }), 500


@creator_bp.get("/creators/batch-analytics")
def get_batch_creator_analytics():
    """
    GET /api/creators/batch-analytics?ids=creator-001,creator-002,creator-003
    Returns a dictionary mapping creator_id to their analytics payload.
    Used for multi-creator comparisons.
    """
    ids_param = request.args.get("ids", "")
    creator_ids = [cid.strip() for cid in ids_param.split(",") if cid.strip()]
    if not creator_ids:
        return jsonify({
            "error": "Query parameter 'ids' is required (comma-separated).",
            "code": "VALIDATION_ERROR",
            "details": {"parameter": "ids"},
        }), 400

    from backend.services.creator_analytics_service import get_creator_analytics
    results = {}
    for cid in creator_ids:
        results[cid] = get_creator_analytics(cid)

    return jsonify(results), 200


@creator_bp.get("/creators/<creator_id>/analytics")
def get_single_creator_analytics(creator_id: str):
    """
    GET /api/creators/<creator_id>/analytics
    Returns full intelligence analytics for the creator.
    """
    creator = get_creator_by_id(creator_id)
    if creator is None:
        return jsonify({
            "error": f"Creator with ID '{creator_id}' was not found.",
            "code": "NOT_FOUND",
            "details": {"creator_id": creator_id},
        }), 404

    from backend.services.creator_analytics_service import get_creator_analytics
    analytics = get_creator_analytics(creator_id)
    return jsonify(analytics), 200


@creator_bp.get("/creators/<creator_id>")
def get_creator(creator_id: str):
    """
    GET /api/creators/<creator_id>
    Returns complete creator profile (HTTP 200) or 404 NOT_FOUND.
    """
    try:
        creator = get_creator_by_id(creator_id)
        if creator is None:
            return jsonify({
                "error": f"Creator with ID '{creator_id}' was not found.",
                "code": "NOT_FOUND",
                "details": {"creator_id": creator_id},
            }), 404
        return jsonify(creator), 200
    except Exception as exc:
        logger.exception("Unexpected error in GET /api/creators/%s: %s", creator_id, exc)
        return jsonify({
            "error": "An internal error occurred while retrieving the creator profile.",
            "code": "INTERNAL_ERROR",
            "details": {},
        }), 500

