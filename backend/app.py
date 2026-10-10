"""
backend/app.py
Flask application factory.
P1 owns all changes.
"""

import logging
from flask import Flask
from flask_cors import CORS

from backend.config import Config
from backend.models.database import init_db
import backend.models  # noqa: F401 — registers all ORM models with Base.metadata

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
)
logger = logging.getLogger(__name__)


def _build_provider(app: Flask) -> None:
    """Initialise the BriefProvider and attach it to app.config."""
    api_key = app.config.get("GEMINI_API_KEY")
    model_name = app.config.get("GEMINI_MODEL")

    if api_key and model_name:
        from backend.providers.gemini_provider import GeminiProvider
        provider = GeminiProvider(api_key=api_key, model_name=model_name)
        if provider.is_available():
            app.config["BRIEF_PROVIDER"] = provider
            app.config["MOCK_REASON"] = None
            logger.info("BriefProvider: GeminiProvider active (model: %s).", model_name)
            return
        else:
            mock_reason = "GEMINI_INVALID_MODEL"
    elif not api_key:
        mock_reason = "GEMINI_NO_KEY"
    else:
        mock_reason = "GEMINI_NO_MODEL"

    from backend.providers.mock_provider import MockProvider
    app.config["BRIEF_PROVIDER"] = MockProvider()
    app.config["MOCK_REASON"] = mock_reason
    logger.warning("BriefProvider: MockProvider active (reason: %s).", mock_reason)


def create_app(config_object: type = Config) -> Flask:
    app = Flask(__name__)

    # Load config
    app.config["SECRET_KEY"] = config_object.SECRET_KEY
    app.config["DEBUG"] = config_object.DEBUG
    app.config["FRONTEND_URL"] = config_object.FRONTEND_URL
    app.config["SQLALCHEMY_DATABASE_URI"] = config_object.SQLALCHEMY_DATABASE_URI
    app.config["GEMINI_API_KEY"] = config_object.GEMINI_API_KEY
    app.config["GEMINI_MODEL"] = config_object.GEMINI_MODEL

    # CORS — allow the Vite dev server
    CORS(app, resources={r"/api/*": {"origins": config_object.FRONTEND_URL}})

    # Database
    init_db(config_object.SQLALCHEMY_DATABASE_URI)
    logger.info("Database initialised: %s", config_object.SQLALCHEMY_DATABASE_URI)

    # AI provider
    _build_provider(app)

    # Register blueprints
    from backend.routes.health_routes import health_bp
    app.register_blueprint(health_bp, url_prefix="/api")

    # Phase 1 blueprints
    from backend.routes.creator_routes import creator_bp
    app.register_blueprint(creator_bp, url_prefix="/api")

    # Phase 2 blueprints
    from backend.routes.campaign_routes import campaign_bp
    app.register_blueprint(campaign_bp, url_prefix="/api")

    # Phase 3 blueprints
    from backend.routes.match_routes import match_bp
    app.register_blueprint(match_bp, url_prefix="/api")

    logger.info("CreatorConnect AI backend started.")
    return app


# Allow `flask run` and `python backend/app.py` from the project root
app = create_app()

if __name__ == "__main__":
    app.run(port=5000, debug=True)
