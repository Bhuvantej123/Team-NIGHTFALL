"""
backend/tests/conftest.py
Pytest fixtures shared across all test files.
P1 (and P4 for test authoring) use these fixtures.
"""

import pytest
from backend.app import create_app
from backend.config import Config
from backend.models.database import init_db, Base, engine


class TestConfig(Config):
    """Override settings for tests: in-memory DB, debug off."""
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    DEBUG = False
    GEMINI_API_KEY = None    # Always uses MockProvider in tests
    GEMINI_MODEL = None


@pytest.fixture(scope="session")
def app():
    """Create Flask app with test config once per session."""
    application = create_app(config_object=TestConfig)
    application.config["TESTING"] = True
    yield application


@pytest.fixture(scope="session")
def client(app):
    """Flask test client."""
    return app.test_client()
