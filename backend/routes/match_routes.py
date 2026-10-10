"""
backend/routes/match_routes.py
Flask routes for running creator matching and retrieving saved match results.
P1 owns all changes.
"""

import logging
from flask import Blueprint, jsonify

from backend.services.matching_service import (
    run_campaign_matching,
    get_persisted_campaign_matches,
    MatchingCampaignNotFoundError,
    InsufficientCampaignDataError,
)

logger = logging.getLogger(__name__)

match_bp = Blueprint("matches", __name__)


@match_bp.post("/campaigns/<campaign_id>/match")
def match_creators(campaign_id: str):
    """
    POST /api/campaigns/<campaign_id>/match
    Runs 5-factor scoring engine, atomically saves results, advances workflow to 'matches_ready'.
    Returns 200 with MatchResponse.
    """
    try:
        response_data = run_campaign_matching(campaign_id)
        return jsonify(response_data), 200
    except MatchingCampaignNotFoundError as exc:
        return jsonify({
            "error": str(exc),
            "code": "NOT_FOUND",
            "details": {"campaign_id": campaign_id},
        }), 404
    except InsufficientCampaignDataError as exc:
        return jsonify({
            "error": exc.message,
            "code": exc.code,
            "details": exc.details,
        }), 400
    except Exception as exc:
        logger.exception("Unexpected error in POST /api/campaigns/%s/match: %s", campaign_id, exc)
        return jsonify({
            "error": "An internal error occurred while calculating creator matches.",
            "code": "INTERNAL_ERROR",
            "details": {},
        }), 500


@match_bp.get("/campaigns/<campaign_id>/matches")
def get_matches(campaign_id: str):
    """
    GET /api/campaigns/<campaign_id>/matches
    Retrieves saved match results without recomputing.
    Returns 404 for unknown campaign.
    Returns 200 with empty list if matching has not been executed yet.
    """
    try:
        response_data = get_persisted_campaign_matches(campaign_id)
        return jsonify(response_data), 200
    except MatchingCampaignNotFoundError as exc:
        return jsonify({
            "error": str(exc),
            "code": "NOT_FOUND",
            "details": {"campaign_id": campaign_id},
        }), 404
    except Exception as exc:
        logger.exception("Unexpected error in GET /api/campaigns/%s/matches: %s", campaign_id, exc)
        return jsonify({
            "error": "An internal error occurred while retrieving campaign matches.",
            "code": "INTERNAL_ERROR",
            "details": {},
        }), 500
