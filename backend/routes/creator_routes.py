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

    try:
        creators = list_creators(
            niche=niche,
            platform=platform,
            skill=skill,
            available=available,
            q=q,
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
