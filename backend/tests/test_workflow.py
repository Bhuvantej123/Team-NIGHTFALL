"""
backend/tests/test_workflow.py
Tests for campaign workflow status progression, completion,
forward-only transition validation, idempotency, and contract synchronization.
P1 owns all changes.
"""

import pytest
from unittest.mock import patch

from backend.models.database import get_session
from backend.models.campaign_model import CampaignBriefModel, CampaignWorkflowModel
from backend.models.match_model import MatchResultModel
from backend.models.shortlist_model import CampaignShortlistModel


@pytest.fixture
def shortlisted_campaign(client):
    """
    Creates a campaign, generates brief, runs matching, and shortlists a creator.
    Status will be 'shortlisted'.
    """
    create_res = client.post("/api/campaigns", json={
        "brand_name": "Velox Gaming",
        "product_description": "High-performance AI game companion tool.",
        "target_audience": "Competitive esports players and streamers.",
        "budget_min": 1000.0,
        "budget_max": 5000.0,
        "currency": "USD",
        "deadline": "2026-09-01T00:00:00Z",
    })
    cid = create_res.get_json()["id"]

    client.post(f"/api/campaigns/{cid}/generate-brief")
    match_res = client.post(f"/api/campaigns/{cid}/match")
    matched_creators = match_res.get_json()["results"]
    c1 = matched_creators[0]["creator_id"]

    client.post(f"/api/campaigns/{cid}/shortlist", json={"creator_id": c1})

    return {
        "campaign_id": cid,
        "shortlisted_creator_id": c1,
    }


# ── 1. Valid campaign completion persists and returns updated status ──────────
def test_campaign_completion_success(client, shortlisted_campaign):
    cid = shortlisted_campaign["campaign_id"]

    res = client.patch(f"/api/campaigns/{cid}/status", json={"workflow_status": "completed"})
    assert res.status_code == 200
    data = res.get_json()

    assert data["workflow_status"] == "completed"
    assert data["campaign_id"] == cid
    assert shortlisted_campaign["shortlisted_creator_id"] in data["selected_creator_ids"]

    # Verify both brief and workflow models in database are updated
    with get_session() as session:
        brief = session.get(CampaignBriefModel, cid)
        workflow = session.query(CampaignWorkflowModel).filter(
            CampaignWorkflowModel.campaign_id == cid,
        ).first()

        assert brief.status == "completed"
        assert workflow.workflow_status == "completed"

    # Verify GET /api/campaigns/<id> reflects completed status
    get_res = client.get(f"/api/campaigns/{cid}")
    assert get_res.status_code == 200
    detail = get_res.get_json()
    assert detail["brief"]["status"] == "completed"
    assert detail["workflow"]["workflow_status"] == "completed"


# ── 2. Alternative payload key {"status": "completed"} accepted ──────────────
def test_campaign_completion_with_status_key(client, shortlisted_campaign):
    cid = shortlisted_campaign["campaign_id"]

    res = client.patch(f"/api/campaigns/{cid}/status", json={"status": "completed"})
    assert res.status_code == 200
    assert res.get_json()["workflow_status"] == "completed"


# ── 3. Repeated completion does not corrupt data (idempotency) ────────────────
def test_repeated_completion_is_idempotent(client, shortlisted_campaign):
    cid = shortlisted_campaign["campaign_id"]

    # First completion call
    res1 = client.patch(f"/api/campaigns/{cid}/status", json={"workflow_status": "completed"})
    assert res1.status_code == 200

    # Second completion call
    res2 = client.patch(f"/api/campaigns/{cid}/status", json={"workflow_status": "completed"})
    assert res2.status_code == 200
    data2 = res2.get_json()

    assert data2["workflow_status"] == "completed"
    assert shortlisted_campaign["shortlisted_creator_id"] in data2["selected_creator_ids"]

    # Third call using {"status": "completed"}
    res3 = client.patch(f"/api/campaigns/{cid}/status", json={"status": "completed"})
    assert res3.status_code == 200


# ── 4. Reject completion directly from matches_ready ──────────────────────────
def test_cannot_complete_directly_from_matches_ready(client):
    # Setup campaign at matches_ready (no shortlist)
    create_res = client.post("/api/campaigns", json={
        "brand_name": "Apex Wear",
        "product_description": "Smart biometric activewear.",
        "target_audience": "Marathon runners and triathletes.",
        "budget_min": 1500.0,
        "budget_max": 4500.0,
        "currency": "USD",
        "deadline": None,
    })
    cid = create_res.get_json()["id"]
    client.post(f"/api/campaigns/{cid}/generate-brief")
    client.post(f"/api/campaigns/{cid}/match")

    # Attempt to complete without shortlisting
    res = client.patch(f"/api/campaigns/{cid}/status", json={"workflow_status": "completed"})
    assert res.status_code == 400
    err = res.get_json()
    assert err["code"] == "INVALID_TRANSITION"
    assert "matches_ready" in err["error"]


# ── 5. Reject completion directly from draft or brief_ready ───────────────────
def test_cannot_complete_from_draft_or_brief_ready(client):
    create_res = client.post("/api/campaigns", json={
        "brand_name": "Draft Brand",
        "product_description": "Concept only.",
        "target_audience": "Early adopters.",
        "budget_min": 500.0,
        "budget_max": 1000.0,
        "currency": "USD",
        "deadline": None,
    })
    cid = create_res.get_json()["id"]

    # From draft -> completed
    res_draft = client.patch(f"/api/campaigns/{cid}/status", json={"workflow_status": "completed"})
    assert res_draft.status_code == 400
    assert res_draft.get_json()["code"] == "INVALID_TRANSITION"

    # From brief_ready -> completed
    client.post(f"/api/campaigns/{cid}/generate-brief")
    res_brief = client.patch(f"/api/campaigns/{cid}/status", json={"workflow_status": "completed"})
    assert res_brief.status_code == 400
    assert res_brief.get_json()["code"] == "INVALID_TRANSITION"


# ── 6. Reject backward transitions ────────────────────────────────────────────
def test_backward_transitions_rejected(client, shortlisted_campaign):
    cid = shortlisted_campaign["campaign_id"]

    # From shortlisted -> matches_ready
    res1 = client.patch(f"/api/campaigns/{cid}/status", json={"workflow_status": "matches_ready"})
    assert res1.status_code == 400
    assert res1.get_json()["code"] == "INVALID_TRANSITION"

    # From shortlisted -> draft
    res2 = client.patch(f"/api/campaigns/{cid}/status", json={"workflow_status": "draft"})
    assert res2.status_code == 400
    assert res2.get_json()["code"] == "INVALID_TRANSITION"

    # Complete the campaign
    client.patch(f"/api/campaigns/{cid}/status", json={"workflow_status": "completed"})

    # From completed -> shortlisted
    res3 = client.patch(f"/api/campaigns/{cid}/status", json={"workflow_status": "shortlisted"})
    assert res3.status_code == 400
    assert res3.get_json()["code"] == "INVALID_TRANSITION"

    # From completed -> draft
    res4 = client.patch(f"/api/campaigns/{cid}/status", json={"workflow_status": "draft"})
    assert res4.status_code == 400
    assert res4.get_json()["code"] == "INVALID_TRANSITION"


# ── 7. Unknown or invalid status value rejected ───────────────────────────────
def test_unknown_status_value_rejected(client, shortlisted_campaign):
    cid = shortlisted_campaign["campaign_id"]

    res = client.patch(f"/api/campaigns/{cid}/status", json={"workflow_status": "in_progress"})
    assert res.status_code == 400
    assert res.get_json()["code"] == "INVALID_TRANSITION"


# ── 8. Missing status in request body rejected ────────────────────────────────
def test_missing_status_body_rejected(client, shortlisted_campaign):
    cid = shortlisted_campaign["campaign_id"]

    res = client.patch(f"/api/campaigns/{cid}/status", json={})
    assert res.status_code == 400
    assert res.get_json()["code"] == "VALIDATION_ERROR"


# ── 9. Unknown campaign ID returns 404 ────────────────────────────────────────
def test_status_update_unknown_campaign_returns_404(client):
    res = client.patch("/api/campaigns/non-existent-campaign-id/status", json={"workflow_status": "completed"})
    assert res.status_code == 404
    assert res.get_json()["code"] == "NOT_FOUND"


# ── 10. Status update preserves brief, matches, and shortlist data ────────────
def test_status_update_preserves_brief_matches_and_shortlist(client, shortlisted_campaign):
    cid = shortlisted_campaign["campaign_id"]

    # Read original brief and matches count
    with get_session() as session:
        brief_title = session.get(CampaignBriefModel, cid).campaign_title
        matches_count = session.query(MatchResultModel).filter(MatchResultModel.campaign_id == cid).count()
        shortlist_count = session.query(CampaignShortlistModel).filter(CampaignShortlistModel.campaign_id == cid).count()

    assert matches_count > 0
    assert shortlist_count > 0

    # Advance to completed
    res = client.patch(f"/api/campaigns/{cid}/status", json={"workflow_status": "completed"})
    assert res.status_code == 200

    # Verify everything is preserved
    with get_session() as session:
        after_brief = session.get(CampaignBriefModel, cid)
        after_matches_count = session.query(MatchResultModel).filter(MatchResultModel.campaign_id == cid).count()
        after_shortlist_count = session.query(CampaignShortlistModel).filter(CampaignShortlistModel.campaign_id == cid).count()

        assert after_brief.campaign_title == brief_title
        assert after_brief.status == "completed"
        assert after_matches_count == matches_count
        assert after_shortlist_count == shortlist_count


# ── 11. Transaction rollback on failure during status update ──────────────────
def test_status_update_rollback_on_failure(client, shortlisted_campaign):
    cid = shortlisted_campaign["campaign_id"]

    with patch("backend.services.workflow_service.get_session") as mock_get_session:
        from backend.models.database import get_session as real_get_session
        with real_get_session() as real_session:
            patch.object(real_session, "commit", side_effect=RuntimeError("Database write failure")).start()
            from contextlib import contextmanager
            @contextmanager
            def broken_session():
                yield real_session
            mock_get_session.side_effect = broken_session

            res = client.patch(f"/api/campaigns/{cid}/status", json={"workflow_status": "completed"})
            assert res.status_code == 500

    # Verify status remained 'shortlisted' and was NOT updated to 'completed'
    with get_session() as session:
        brief = session.get(CampaignBriefModel, cid)
        wf = session.query(CampaignWorkflowModel).filter(CampaignWorkflowModel.campaign_id == cid).first()
        assert brief.status == "shortlisted"
        assert wf.workflow_status == "shortlisted"
