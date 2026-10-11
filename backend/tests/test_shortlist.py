"""
backend/tests/test_shortlist.py
Tests for shortlist operations: add, remove, get, duplicate-prevention,
campaign isolation, database uniqueness, and error handling.
P1 owns all changes.
"""

import json
import pytest
from unittest.mock import patch
from sqlalchemy.exc import IntegrityError

from backend.models.database import get_session
from backend.models.campaign_model import CampaignBriefModel, CampaignWorkflowModel
from backend.models.shortlist_model import CampaignShortlistModel
from backend.models.match_model import MatchResultModel


@pytest.fixture
def matched_campaign(client):
    """
    Creates a campaign, generates a brief, and runs matching.
    Leaves the campaign in 'matches_ready' status with persisted match results.
    """
    create_res = client.post("/api/campaigns", json={
        "brand_name": "Lumina Skincare",
        "product_description": "Organic peptide night serum powered by bioactive botanicals.",
        "target_audience": "Eco-conscious millennials interested in clean beauty.",
        "budget_min": 500.0,
        "budget_max": 2500.0,
        "currency": "USD",
        "deadline": "2026-07-01T00:00:00Z",
    })
    assert create_res.status_code == 201
    campaign_id = create_res.get_json()["id"]

    # Generate brief (advances to brief_ready)
    gen_res = client.post(f"/api/campaigns/{campaign_id}/generate-brief")
    assert gen_res.status_code == 200

    # Run matching (advances to matches_ready)
    match_res = client.post(f"/api/campaigns/{campaign_id}/match")
    assert match_res.status_code == 200
    match_data = match_res.get_json()
    assert len(match_data["results"]) > 0

    return {
        "campaign_id": campaign_id,
        "matched_creator_ids": [r["creator_id"] for r in match_data["results"]],
    }


# ── 1. Successfully adding a creator to a shortlist ───────────────────────────
def test_add_creator_to_shortlist_success(client, matched_campaign):
    cid = matched_campaign["campaign_id"]
    creator_id = matched_campaign["matched_creator_ids"][0]

    res = client.post(f"/api/campaigns/{cid}/shortlist", json={"creator_id": creator_id})
    assert res.status_code == 200
    data = res.get_json()

    assert data["campaign_id"] == cid
    assert creator_id in data["selected_creator_ids"]
    assert data["workflow_status"] == "shortlisted"
    assert data["total_shortlisted"] == 1
    assert len(data["shortlist"]) == 1
    assert data["shortlist"][0]["creator_id"] == creator_id
    assert "creator" in data["shortlist"][0]

    # Verify database persistence directly
    with get_session() as session:
        sl = session.query(CampaignShortlistModel).filter(
            CampaignShortlistModel.campaign_id == cid,
            CampaignShortlistModel.creator_id == creator_id,
        ).first()
        assert sl is not None

        wf = session.query(CampaignWorkflowModel).filter(
            CampaignWorkflowModel.campaign_id == cid,
        ).first()
        assert creator_id in json.loads(wf.selected_creator_ids)
        assert wf.workflow_status == "shortlisted"

        brief = session.get(CampaignBriefModel, cid)
        assert brief.status == "shortlisted"


# ── 2. Successfully retrieving the shortlist ──────────────────────────────────
def test_retrieve_shortlist_success(client, matched_campaign):
    cid = matched_campaign["campaign_id"]
    creator_id_1 = matched_campaign["matched_creator_ids"][0]
    creator_id_2 = matched_campaign["matched_creator_ids"][1]

    client.post(f"/api/campaigns/{cid}/shortlist", json={"creator_id": creator_id_1})
    client.post(f"/api/campaigns/{cid}/shortlist", json={"creator_id": creator_id_2})

    res = client.get(f"/api/campaigns/{cid}/shortlist")
    assert res.status_code == 200
    data = res.get_json()

    assert data["campaign_id"] == cid
    assert data["total_shortlisted"] == 2
    assert creator_id_1 in data["selected_creator_ids"]
    assert creator_id_2 in data["selected_creator_ids"]
    assert len(data["shortlist"]) == 2

    # Check that creator details and match scores are included
    item_map = {item["creator_id"]: item for item in data["shortlist"]}
    assert creator_id_1 in item_map
    assert creator_id_2 in item_map
    assert item_map[creator_id_1]["display_name"] != ""


# ── 3. Successfully removing a shortlisted creator ────────────────────────────
def test_remove_shortlisted_creator_success(client, matched_campaign):
    cid = matched_campaign["campaign_id"]
    c1 = matched_campaign["matched_creator_ids"][0]
    c2 = matched_campaign["matched_creator_ids"][1]

    client.post(f"/api/campaigns/{cid}/shortlist", json={"creator_id": c1})
    client.post(f"/api/campaigns/{cid}/shortlist", json={"creator_id": c2})

    # Remove c1
    del_res = client.delete(f"/api/campaigns/{cid}/shortlist/{c1}")
    assert del_res.status_code == 200
    del_data = del_res.get_json()

    assert c1 not in del_data["selected_creator_ids"]
    assert c2 in del_data["selected_creator_ids"]
    assert del_data["total_shortlisted"] == 1

    # Verify via GET endpoint
    get_res = client.get(f"/api/campaigns/{cid}/shortlist")
    assert get_res.status_code == 200
    assert get_res.get_json()["selected_creator_ids"] == [c2]

    # Verify DB table
    with get_session() as session:
        entry = session.query(CampaignShortlistModel).filter(
            CampaignShortlistModel.campaign_id == cid,
            CampaignShortlistModel.creator_id == c1,
        ).first()
        assert entry is None


# ── 4. Duplicate-add behavior and database uniqueness ─────────────────────────
def test_duplicate_add_rejected(client, matched_campaign):
    cid = matched_campaign["campaign_id"]
    c1 = matched_campaign["matched_creator_ids"][0]

    # First add succeeds
    res1 = client.post(f"/api/campaigns/{cid}/shortlist", json={"creator_id": c1})
    assert res1.status_code == 200

    # Second add fails with 400 VALIDATION_ERROR
    res2 = client.post(f"/api/campaigns/{cid}/shortlist", json={"creator_id": c1})
    assert res2.status_code == 400
    err = res2.get_json()
    assert err["code"] == "VALIDATION_ERROR"
    assert "already shortlisted" in err["error"].lower()

    # Verify DB contains exactly 1 record
    with get_session() as session:
        count = session.query(CampaignShortlistModel).filter(
            CampaignShortlistModel.campaign_id == cid,
            CampaignShortlistModel.creator_id == c1,
        ).count()
        assert count == 1


# ── 5. Database-level constraint catches race conditions ─────────────────────
def test_database_unique_constraint_enforced(matched_campaign):
    cid = matched_campaign["campaign_id"]
    c1 = matched_campaign["matched_creator_ids"][0]

    import uuid
    id1 = f"sl-test-uniq-{uuid.uuid4()}"
    id2 = f"sl-test-uniq-{uuid.uuid4()}"
    with get_session() as session:
        e1 = CampaignShortlistModel(id=id1, campaign_id=cid, creator_id=c1, added_at="2026-01-01T00:00:00Z")
        session.add(e1)
        session.commit()

        # Direct duplicate insert with different ID should trigger IntegrityError on (campaign_id, creator_id)
        e2 = CampaignShortlistModel(id=id2, campaign_id=cid, creator_id=c1, added_at="2026-01-01T00:00:00Z")
        session.add(e2)
        with pytest.raises(IntegrityError):
            session.commit()
        session.rollback()


# ── 6. Unknown campaign returns 404 ───────────────────────────────────────────
def test_unknown_campaign_returns_404(client):
    res_post = client.post("/api/campaigns/non-existent-campaign/shortlist", json={"creator_id": "test-creator-1"})
    assert res_post.status_code == 404
    assert res_post.get_json()["code"] == "NOT_FOUND"

    res_get = client.get("/api/campaigns/non-existent-campaign/shortlist")
    assert res_get.status_code == 404
    assert res_get.get_json()["code"] == "NOT_FOUND"

    res_del = client.delete("/api/campaigns/non-existent-campaign/shortlist/test-creator-1")
    assert res_del.status_code == 404
    assert res_del.get_json()["code"] == "NOT_FOUND"


# ── 7. Unknown creator returns 404 ────────────────────────────────────────────
def test_unknown_creator_returns_404(client, matched_campaign):
    cid = matched_campaign["campaign_id"]
    res = client.post(f"/api/campaigns/{cid}/shortlist", json={"creator_id": "c-non-existent-999"})
    assert res.status_code == 404
    assert res.get_json()["code"] == "NOT_FOUND"


# ── 8. Creator not in saved match results rejected ────────────────────────────
def test_unmatched_creator_rejected_from_shortlist(client):
    # Create campaign without running matching
    create_res = client.post("/api/campaigns", json={
        "brand_name": "Solaris Energy",
        "product_description": "Clean tech smart home battery.",
        "target_audience": "Homeowners interested in renewable energy.",
        "budget_min": 1000.0,
        "budget_max": 4000.0,
        "currency": "USD",
        "deadline": None,
    })
    cid = create_res.get_json()["id"]

    # Attempt to shortlist valid creator that has not been matched
    res = client.post(f"/api/campaigns/{cid}/shortlist", json={"creator_id": "test-creator-1"})
    assert res.status_code == 400
    err = res.get_json()
    assert err["code"] == "VALIDATION_ERROR"
    assert "saved match results" in err["error"].lower()


# ── 9. Removing nonexistent entry returns 404 ────────────────────────────────
def test_remove_nonexistent_entry_returns_404(client, matched_campaign):
    cid = matched_campaign["campaign_id"]
    res = client.delete(f"/api/campaigns/{cid}/shortlist/test-creator-2")
    assert res.status_code == 404
    err = res.get_json()
    assert err["code"] == "NOT_FOUND"


# ── 10. Empty shortlist returns documented 200 response ───────────────────────
def test_empty_shortlist_returns_200(client, matched_campaign):
    cid = matched_campaign["campaign_id"]
    res = client.get(f"/api/campaigns/{cid}/shortlist")
    assert res.status_code == 200
    data = res.get_json()

    assert data["campaign_id"] == cid
    assert data["selected_creator_ids"] == []
    assert data["shortlist"] == []
    assert data["total_shortlisted"] == 0


# ── 11. Shortlist persistence and campaign isolation ──────────────────────────
def test_shortlist_campaign_isolation(client, matched_campaign):
    cid1 = matched_campaign["campaign_id"]
    c1 = matched_campaign["matched_creator_ids"][0]

    # Create and match a second campaign
    create_res2 = client.post("/api/campaigns", json={
        "brand_name": "Aura Water",
        "product_description": "Sparkling alkaline mineral water.",
        "target_audience": "Athletes and fitness enthusiasts.",
        "budget_min": 400.0,
        "budget_max": 1500.0,
        "currency": "USD",
        "deadline": None,
    })
    cid2 = create_res2.get_json()["id"]
    client.post(f"/api/campaigns/{cid2}/generate-brief")
    match_res2 = client.post(f"/api/campaigns/{cid2}/match")
    cid2_matched = match_res2.get_json()["results"][0]["creator_id"]

    # Shortlist on campaign 1
    client.post(f"/api/campaigns/{cid1}/shortlist", json={"creator_id": c1})

    # Verify campaign 2's shortlist is completely isolated and empty
    res2 = client.get(f"/api/campaigns/{cid2}/shortlist")
    assert res2.get_json()["selected_creator_ids"] == []
    assert res2.get_json()["total_shortlisted"] == 0

    # Shortlist on campaign 2
    client.post(f"/api/campaigns/{cid2}/shortlist", json={"creator_id": cid2_matched})

    # Verify campaign 1's shortlist only contains c1
    res1 = client.get(f"/api/campaigns/{cid1}/shortlist")
    assert res1.get_json()["selected_creator_ids"] == [c1]


# ── 12. Transaction rollback on database failure ──────────────────────────────
def test_shortlist_transaction_rollback_on_failure(client, matched_campaign):
    cid = matched_campaign["campaign_id"]
    c1 = matched_campaign["matched_creator_ids"][0]

    # Simulate database commit error during shortlist addition
    with patch("backend.services.workflow_service.get_session") as mock_get_session:
        from backend.models.database import get_session as real_get_session
        with real_get_session() as real_session:
            mock_session = patch.object(real_session, "commit", side_effect=RuntimeError("DB disk failure")).start()
            from contextlib import contextmanager
            @contextmanager
            def broken_session():
                yield real_session
            mock_get_session.side_effect = broken_session

            res = client.post(f"/api/campaigns/{cid}/shortlist", json={"creator_id": c1})
            assert res.status_code == 500

    # Verify that partial changes were rolled back and c1 was NOT shortlisted
    get_res = client.get(f"/api/campaigns/{cid}/shortlist")
    assert get_res.status_code == 200
    assert c1 not in get_res.get_json()["selected_creator_ids"]


# ── 13. Missing or invalid request body validation ───────────────────────────
def test_shortlist_invalid_payload_validation(client, matched_campaign):
    cid = matched_campaign["campaign_id"]

    # Missing creator_id
    res1 = client.post(f"/api/campaigns/{cid}/shortlist", json={})
    assert res1.status_code == 400
    assert res1.get_json()["code"] == "VALIDATION_ERROR"

    # Non-string creator_id
    res2 = client.post(f"/api/campaigns/{cid}/shortlist", json={"creator_id": 12345})
    assert res2.status_code == 400
    assert res2.get_json()["code"] == "VALIDATION_ERROR"

    # Empty string creator_id
    res3 = client.post(f"/api/campaigns/{cid}/shortlist", json={"creator_id": "   "})
    assert res3.status_code == 400
    assert res3.get_json()["code"] == "VALIDATION_ERROR"
