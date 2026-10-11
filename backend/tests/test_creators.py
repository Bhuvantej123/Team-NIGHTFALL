"""
backend/tests/test_creators.py
Integration and unit tests for Creator Directory API and seeding.
Covers all 13 required test scenarios for Phase 1.
P1 owns all changes.
"""

import json
from pathlib import Path
import pytest

from backend.models.database import get_session
from backend.models.creator_model import CreatorModel
from backend.models.campaign_model import CampaignBriefModel, CampaignWorkflowModel
from backend.models.match_model import MatchResultModel
from backend.seed.seed import seed_database
from backend.tests.conftest import SAMPLE_TEST_CREATORS


# ── 1. Listing creators successfully ──────────────────────────────────────────
def test_list_creators_success(client):
    res = client.get("/api/creators")
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data, list)
    assert len(data) == 3
    ids = [c["id"] for c in data]
    assert "test-creator-1" in ids
    assert "test-creator-2" in ids
    assert "test-creator-3" in ids


# ── 2. Filtering by niche ──────────────────────────────────────────────────────
def test_filter_by_niche(client):
    # Case-insensitive partial match
    res = client.get("/api/creators?niche=gaming")
    assert res.status_code == 200
    data = res.get_json()
    assert len(data) == 1
    assert data[0]["id"] == "test-creator-2"

    # Match multiple with common niche "lifestyle"
    res2 = client.get("/api/creators?niche=LiFeStYlE")
    assert res2.status_code == 200
    data2 = res2.get_json()
    assert len(data2) == 2
    ids = {c["id"] for c in data2}
    assert ids == {"test-creator-1", "test-creator-3"}


# ── 3. Filtering by platform ──────────────────────────────────────────────────
def test_filter_by_platform(client):
    # Exact case-insensitive match for platform name
    res = client.get("/api/creators?platform=tiktok")
    assert res.status_code == 200
    data = res.get_json()
    assert len(data) == 1
    assert data[0]["id"] == "test-creator-2"

    res_ig = client.get("/api/creators?platform=INSTAGRAM")
    assert res_ig.status_code == 200
    data_ig = res_ig.get_json()
    assert len(data_ig) == 2
    ids = {c["id"] for c in data_ig}
    assert ids == {"test-creator-1", "test-creator-3"}


# ── 4. Filtering by skill ──────────────────────────────────────────────────────
def test_filter_by_skill(client):
    # Partial case-insensitive match
    res = client.get("/api/creators?skill=voiceover")
    assert res.status_code == 200
    data = res.get_json()
    assert len(data) == 1
    assert data[0]["id"] == "test-creator-2"

    res2 = client.get("/api/creators?skill=video")
    assert res2.status_code == 200
    data2 = res2.get_json()
    assert len(data2) == 1
    assert data2[0]["id"] == "test-creator-1"


# ── 4b. Filtering by creative discipline ──────────────────────────────────────
def test_filter_by_discipline(client):
    # test-creator-1 has video editing/motion design -> matches 'AI Video Ad Creator' or 'Motion Graphics Artist'
    res_disc = client.get("/api/creators?discipline=motion+graphics+artist")
    assert res_disc.status_code == 200
    data = res_disc.get_json()
    ids = [c["id"] for c in data]
    assert "test-creator-1" in ids or "test-creator-2" in ids
    for c in data:
        assert "disciplines" in c
        assert any("motion graphics artist" in d.lower() for d in c["disciplines"])


# ── 5. Filtering by availability, both true and false ──────────────────────────
def test_filter_by_availability_true(client):
    res = client.get("/api/creators?available=true")
    assert res.status_code == 200
    data = res.get_json()
    assert len(data) == 2
    for c in data:
        assert c["availability"] is True


def test_filter_by_availability_false(client):
    res = client.get("/api/creators?available=false")
    assert res.status_code == 200
    data = res.get_json()
    assert len(data) == 1
    assert data[0]["id"] == "test-creator-2"
    assert data[0]["availability"] is False


# ── 6. Combining multiple filters (AND semantics) ──────────────────────────────
def test_combine_multiple_filters(client):
    # niche=lifestyle AND available=true AND platform=instagram -> test-creator-1 and test-creator-3
    res = client.get("/api/creators?niche=lifestyle&available=true&platform=instagram")
    assert res.status_code == 200
    data = res.get_json()
    assert len(data) == 2

    # Add skill=virtual -> only test-creator-3
    res_refined = client.get(
        "/api/creators?niche=lifestyle&available=true&platform=instagram&skill=virtual"
    )
    assert res_refined.status_code == 200
    data_refined = res_refined.get_json()
    assert len(data_refined) == 1
    assert data_refined[0]["id"] == "test-creator-3"

    # Conflicting criteria -> empty list
    res_conflict = client.get(
        "/api/creators?niche=gaming&available=true"
    )
    assert res_conflict.status_code == 200
    assert res_conflict.get_json() == []


# ── 7. Case-insensitive free-text search ──────────────────────────────────────
def test_case_insensitive_text_search(client):
    # Match display name
    res_name = client.get("/api/creators?q=kavita")
    assert res_name.status_code == 200
    data = res_name.get_json()
    assert len(data) == 1
    assert data[0]["id"] == "test-creator-1"

    # Match bio
    res_bio = client.get("/api/creators?q=synthetic+voice")
    assert res_bio.status_code == 200
    data_bio = res_bio.get_json()
    assert len(data_bio) == 1
    assert data_bio[0]["id"] == "test-creator-2"

    # Match style_tag "editorial"
    res_tag = client.get("/api/creators?q=EDITORIAL")
    assert res_tag.status_code == 200
    data_tag = res_tag.get_json()
    assert len(data_tag) == 1
    assert data_tag[0]["id"] == "test-creator-3"


# ── 8. Retrieving an existing creator by ID ───────────────────────────────────
def test_get_creator_by_id_success(client):
    res = client.get("/api/creators/test-creator-1")
    assert res.status_code == 200
    data = res.get_json()
    assert data["id"] == "test-creator-1"
    assert data["display_name"] == "Kavita Rao"
    assert data["handle"] == "@kavita_visuals"
    assert data["starting_price"] == 600.0
    assert data["availability"] is True
    assert isinstance(data["platforms"], list)
    assert len(data["platforms"]) == 1
    assert data["platforms"][0]["name"] == "instagram"


# ── 9. Unknown creator ID returning 404 ───────────────────────────────────────
def test_get_creator_unknown_id_404(client):
    res = client.get("/api/creators/non-existent-uuid")
    assert res.status_code == 404
    err = res.get_json()
    assert err["code"] == "NOT_FOUND"
    assert "not found" in err["error"].lower()
    assert err["details"]["creator_id"] == "non-existent-uuid"


# ── 10. Empty search results returning 200 with an empty array ─────────────────
def test_empty_search_returns_200_empty_list(client):
    res = client.get("/api/creators?q=nonexistentkeyword12345")
    assert res.status_code == 200
    data = res.get_json()
    assert data == []


# ── 11. Invalid availability values returning 400 ─────────────────────────────
def test_invalid_availability_returns_400(client):
    res = client.get("/api/creators?available=maybe")
    assert res.status_code == 400
    err = res.get_json()
    assert err["code"] == "VALIDATION_ERROR"
    assert "available" in err["error"].lower()
    assert err["details"]["parameter"] == "available"
    assert err["details"]["value"] == "maybe"


# ── 12. Repeated seeding without duplicate creators ───────────────────────────
def test_repeated_seeding_idempotence(tmp_path):
    fixture_file = tmp_path / "fixture_creators.json"
    fixture_file.write_text(json.dumps(SAMPLE_TEST_CREATORS), encoding="utf-8")

    # First seed
    summary1 = seed_database(source_path=fixture_file)
    assert summary1["total"] == 3

    with get_session() as session:
        initial_count = session.query(CreatorModel).count()
        assert initial_count >= 3

    # Second seed with identical file
    summary2 = seed_database(source_path=fixture_file)
    assert summary2["inserted"] == 0
    assert summary2["skipped"] == 3

    with get_session() as session:
        second_count = session.query(CreatorModel).count()
        assert second_count == initial_count


# ── 13. Preserving campaign, workflow and match records on reseeding ───────────
def test_reseeding_preserves_campaign_workflow_matches(tmp_path):
    import uuid
    camp_id = f"camp-preserve-{uuid.uuid4().hex[:8]}"
    wf_id = f"wf-preserve-{uuid.uuid4().hex[:8]}"
    match_id = f"match-preserve-{uuid.uuid4().hex[:8]}"

    # Insert dummy campaign brief, workflow, and match records into the test DB
    with get_session() as session:
        brief = CampaignBriefModel(
            id=camp_id,
            brand_name="TestBrand",
            product_description="TestProduct",
            target_audience="TestAudience",
            budget_min=500.0,
            budget_max=1500.0,
            currency="USD",
            deadline="2026-05-01",
            campaign_title="Test Campaign",
            objective="Test Objective",
            deliverables="[]",
            preferred_platforms="[]",
            required_skills="[]",
            preferred_niches="[]",
            preferred_style="test",
            tone="test",
            key_messages="[]",
            call_to_action="test",
            generated_by="mock",
            user_edited_fields="[]",
            status="draft",
            created_at="2026-01-01T00:00:00Z",
        )
        workflow = CampaignWorkflowModel(
            id=wf_id,
            campaign_id=camp_id,
            selected_creator_ids="[]",
            workflow_status="draft",
            created_at="2026-01-01T00:00:00Z",
            updated_at="2026-01-01T00:00:00Z",
        )
        match_record = MatchResultModel(
            id=match_id,
            campaign_id=camp_id,
            creator_id="test-creator-1",
            creator_snapshot=json.dumps(SAMPLE_TEST_CREATORS[0]),
            total_score=88.5,
            score_breakdown=json.dumps({"skill_niche_relevance": 0.9}),
            evidence=json.dumps({}),
            explanation="Strong fit",
            budget_fit=True,
            over_budget=False,
            availability_fit=True,
            matched_at="2026-01-01T00:00:00Z",
        )
        session.add(brief)
        session.add(workflow)
        session.add(match_record)
        session.commit()

    # Re-run seeding
    fixture_file = tmp_path / "fixture_creators_2.json"
    fixture_file.write_text(json.dumps(SAMPLE_TEST_CREATORS), encoding="utf-8")
    seed_database(source_path=fixture_file)

    # Verify that campaign, workflow, and match records are still completely intact
    with get_session() as session:
        b = session.get(CampaignBriefModel, camp_id)
        w = session.get(CampaignWorkflowModel, wf_id)
        m = session.get(MatchResultModel, match_id)

        assert b is not None
        assert b.brand_name == "TestBrand"
        assert w is not None
        assert w.campaign_id == camp_id
        assert m is not None
        assert m.total_score == 88.5
