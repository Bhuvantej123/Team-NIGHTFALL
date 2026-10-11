"""
backend/tests/conftest.py
Pytest fixtures shared across all test files.
P1 (and P4 for test authoring) use these fixtures.
"""

import os
import sys
from pathlib import Path

# Guarantee repository root is on sys.path for direct pytest invocation
_repo_root = str(Path(__file__).resolve().parent.parent.parent)
if _repo_root not in sys.path:
    sys.path.insert(0, _repo_root)

# Guarantee tests run strictly in-memory and NEVER connect to or pollute external databases
os.environ["DATABASE_URL"] = "sqlite:///:memory:"

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
        "id": "test-creator-1",
        "display_name": "Kavita Rao",
        "handle": "@kavita_visuals",
        "bio": "Photorealistic AI visual director creating high-end tech commercials.",
        "skills": ["video editing", "prompt engineering", "motion design"],
        "ai_tools": ["Midjourney", "Runway"],
        "niches": ["tech", "lifestyle"],
        "platforms": [
            {"name": "instagram", "handle": "@kavita_visuals", "url": "https://instagram.com/kavita_visuals", "follower_count": 40000}
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
        "id": "test-creator-2",
        "display_name": "Rishi Verma",
        "handle": "@rishi_gaming",
        "bio": "Narrative gaming shorts and synthetic voice acting for indie games.",
        "skills": ["3D rendering", "AI voiceover"],
        "ai_tools": ["ElevenLabs", "Blender"],
        "niches": ["gaming", "entertainment"],
        "platforms": [
            {"name": "tiktok", "handle": "@rishi_gaming", "url": "https://tiktok.com/@rishi_gaming", "follower_count": 80000},
            {"name": "youtube", "handle": "@rishi_media", "url": "https://youtube.com/@rishi_media", "follower_count": 50000},
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
        "id": "test-creator-3",
        "display_name": "Tara Sen",
        "handle": "@tara_fashion",
        "bio": "Editorial digital styling and virtual lookbooks for sustainable fashion.",
        "skills": ["virtual fashion", "copywriting"],
        "ai_tools": ["Stable Diffusion"],
        "niches": ["fashion", "lifestyle"],
        "platforms": [
            {"name": "instagram", "handle": "@tara_fashion", "url": "https://instagram.com/tara_fashion", "follower_count": 60000}
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

