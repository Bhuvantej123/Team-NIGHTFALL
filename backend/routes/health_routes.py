"""
backend/routes/health_routes.py
GET /api/health — liveness check with Gemini provider status.
P1 owns all changes.
"""

from flask import Blueprint, jsonify, current_app

health_bp = Blueprint("health", __name__)


@health_bp.get("/health")
def health():
    provider = current_app.config.get("BRIEF_PROVIDER")
    if provider and provider.is_available() and provider.source_label() == "gemini":
        return jsonify({
            "status": "ok",
            "gemini_available": True,
            "gemini_model": current_app.config.get("GEMINI_MODEL"),
            "source": "gemini",
        }), 200
    else:
        mock_reason = current_app.config.get("MOCK_REASON", "GEMINI_NO_KEY")
        return jsonify({
            "status": "ok",
            "gemini_available": False,
            "gemini_model": None,
            "source": "mock",
            "mock_reason": mock_reason,
        }), 200
