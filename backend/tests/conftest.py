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


SAMPLE_TEST_CREATORS = [
    {
        "id": "c-test-1",
        "display_name": "Elena Rostova",
        "handle": "@elena_ai",
        "bio": "Photorealistic AI visual director creating high-end tech commercials.",
        "skills": ["video editing", "prompt engineering", "motion design"],
        "ai_tools": ["Midjourney", "Runway"],
        "niches": ["tech", "lifestyle"],
        "platforms": [
            {"name": "instagram", "handle": "@elena_ai", "url": "https://instagram.com/elena_ai", "follower_count": 40000}
        ],
        "portfolio_items": [
            {"id": "pi-1", "title": "Tech Reel", "description": "AI reel", "platform": "instagram", "content_url": None, "thumbnail_url": None, "tags": ["tech"]}
        ],
        "style_tags": ["cinematic", "futuristic"],
        "starting_price": 600.0,
        "currency": "USD",
        "availability": True,
        "portfolio_evidence": "Worked with global brands.",
        "created_at": "2026-01-01T00:00:00Z",
    },
    {
        "id": "c-test-2",
        "display_name": "Marcus Vance",
        "handle": "@vance_gaming",
        "bio": "Narrative gaming shorts and synthetic voice acting for indie games.",
        "skills": ["3D rendering", "AI voiceover"],
        "ai_tools": ["ElevenLabs", "Blender"],
        "niches": ["gaming", "entertainment"],
        "platforms": [
            {"name": "tiktok", "handle": "@vance_gaming", "url": "https://tiktok.com/@vance_gaming", "follower_count": 80000},
            {"name": "youtube", "handle": "@vance_media", "url": "https://youtube.com/@vance_media", "follower_count": 50000},
        ],
        "portfolio_items": [],
        "style_tags": ["energetic", "humorous"],
        "starting_price": 1200.0,
        "currency": "USD",
        "availability": False,
        "portfolio_evidence": "Top viral gaming clips.",
        "created_at": "2026-01-02T00:00:00Z",
    },
    {
        "id": "c-test-3",
        "display_name": "Aria Chen",
        "handle": "@aria_fashion",
        "bio": "Editorial digital styling and virtual lookbooks for sustainable fashion.",
        "skills": ["virtual fashion", "copywriting"],
        "ai_tools": ["Stable Diffusion"],
        "niches": ["fashion", "lifestyle"],
        "platforms": [
            {"name": "instagram", "handle": "@aria_fashion", "url": "https://instagram.com/aria_fashion", "follower_count": 60000}
        ],
        "portfolio_items": [],
        "style_tags": ["minimalist", "editorial"],
        "starting_price": 450.0,
        "currency": "USD",
        "availability": True,
        "portfolio_evidence": "Sustainable fashion editorials.",
        "created_at": "2026-01-03T00:00:00Z",
    },
]


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


@pytest.fixture(scope="function", autouse=True)
def setup_test_creators(app):
    """Seeds test creators into the in-memory database before each test."""
    from backend.models.database import get_session
    from backend.models.creator_model import CreatorModel

    with get_session() as session:
        for item in SAMPLE_TEST_CREATORS:
            existing = session.get(CreatorModel, item["id"])
            if not existing:
                session.add(CreatorModel.from_dict(item))
            else:
                for key, val in CreatorModel.from_dict(item).__dict__.items():
                    if not key.startswith("_"):
                        setattr(existing, key, val)
        session.commit()
    yield

