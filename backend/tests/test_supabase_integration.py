"""
backend/tests/test_supabase_integration.py
Opt-in integration test verifying live Supabase PostgreSQL read/write persistence.
Runs ONLY when RUN_SUPABASE_INTEGRATION=1 is set in the environment.
P1 owns all changes.
"""

from datetime import datetime, timezone
import os
import uuid
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.config import load_environment, normalize_database_url
from backend.models.campaign_model import CampaignBriefModel
from backend.scripts.init_supabase_db import mask_db_url

# Ensure backend/.env is loaded
load_environment()

RUN_INTEGRATION = os.getenv("RUN_SUPABASE_INTEGRATION") == "1"

pytestmark = pytest.mark.skipif(
    not RUN_INTEGRATION,
    reason="Live Supabase integration test is opt-in. Set RUN_SUPABASE_INTEGRATION=1 to run.",
)


def test_supabase_live_read_write_persistence():
    """
    Verifies live Supabase PostgreSQL read/write persistence:
      1. Validates DATABASE_URL is present and points to PostgreSQL (not SQLite).
      2. Creates a uniquely identifiable test record.
      3. Commits the record in session 1.
      4. Opens a completely new database session 2 to retrieve and verify fields.
      5. Cleans up only the test record in a finally block.
      6. Verifies deletion in a new session.
    """
    raw_url = os.getenv("DATABASE_URL", "").strip()

    # Refuse to run if database URL is missing or points to SQLite
    if not raw_url:
        pytest.fail("DATABASE_URL is missing. Live Supabase test requires a configured PostgreSQL database.")

    if raw_url.lower().startswith("sqlite"):
        pytest.fail("DATABASE_URL points to SQLite. Refusing to run live Supabase integration test against SQLite.")

    normalized_url = normalize_database_url(raw_url)
    if "postgres" not in normalized_url.lower():
        pytest.fail(f"DATABASE_URL does not appear to be PostgreSQL: {mask_db_url(normalized_url)}")

    # Create an isolated engine for this test using standard connection settings
    engine = create_engine(
        normalized_url,
        pool_pre_ping=True,
        pool_recycle=300,
    )
    SessionFactory = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    test_id = f"test-supabase-probe-{uuid.uuid4()}"
    now_iso = datetime.now(timezone.utc).isoformat()

    probe_record = CampaignBriefModel(
        id=test_id,
        brand_name="Supabase Live Probe",
        product_description="Automated probe validating real read/write persistence.",
        target_audience="Quality Assurance & Verification",
        budget_min=1200.0,
        budget_max=4800.0,
        currency="USD",
        deadline="2026-12-31",
        campaign_title="Live Probe Campaign",
        objective="Verify round-trip database persistence",
        deliverables="[\"test_video\", \"test_post\"]",
        preferred_platforms="[\"instagram\"]",
        required_skills="[\"ai testing\"]",
        preferred_niches="[\"tech\"]",
        preferred_style="clean",
        tone="professional",
        key_messages="[\"persistence verified\"]",
        call_to_action="None",
        generated_by="user",
        user_edited_fields="[]",
        status="draft",
        created_at=now_iso,
    )

    try:
        # Step 1: Write and commit in session 1
        session1 = SessionFactory()
        try:
            session1.add(probe_record)
            session1.commit()
        finally:
            session1.close()

        # Step 2: Read and verify in a completely new session 2
        session2 = SessionFactory()
        try:
            retrieved = session2.get(CampaignBriefModel, test_id)
            assert retrieved is not None, f"Failed to retrieve record {test_id} from Supabase"
            assert retrieved.id == test_id
            assert retrieved.brand_name == "Supabase Live Probe"
            assert retrieved.budget_min == 1200.0
            assert retrieved.budget_max == 4800.0
            assert retrieved.currency == "USD"
            assert retrieved.status == "draft"
            assert retrieved.created_at == now_iso

            # Convert to dict and verify serialized structure
            data = retrieved.to_dict()
            assert data["deliverables"] == ["test_video", "test_post"]
            assert data["preferred_platforms"] == ["instagram"]
        finally:
            session2.close()

    finally:
        # Step 3: Strictly clean up only the test record created by this test
        cleanup_session = SessionFactory()
        try:
            cleanup_session.query(CampaignBriefModel).filter(
                CampaignBriefModel.id == test_id
            ).delete()
            cleanup_session.commit()
        finally:
            cleanup_session.close()

        # Step 4: Verify the test record no longer exists
        verify_session = SessionFactory()
        try:
            assert verify_session.get(CampaignBriefModel, test_id) is None
        finally:
            verify_session.close()

        # Dispose connection pool
        engine.dispose()
