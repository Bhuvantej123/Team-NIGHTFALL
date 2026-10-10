"""
backend/tests/test_campaigns.py
Integration and unit tests for Campaign Creation, Brief Generation/Regeneration,
Manual Brief Editing, Workflow Initialization, and Provider Failures.
P1 owns all changes.
"""

from unittest.mock import MagicMock
import pytest

from backend.models.database import get_session
from backend.models.campaign_model import CampaignBriefModel, CampaignWorkflowModel
from backend.providers.base import BriefProvider, BriefResult
from backend.providers.gemini_provider import (
    GeminiRateLimitError,
    GeminiTimeoutError,
    GeminiAPIError,
)


@pytest.fixture
def valid_campaign_payload():
    return {
        "brand_name": "Lumina Skincare",
        "product_description": "Organic peptide night serum powered by bioactive botanicals.",
        "target_audience": "Eco-conscious millennials interested in clean beauty.",
        "budget_min": 1000.0,
        "budget_max": 3000.0,
        "currency": "USD",
        "deadline": "2026-06-30T00:00:00Z",
    }


# ── 1. Valid campaign creation ────────────────────────────────────────────────
def test_create_campaign_success(client, valid_campaign_payload):
    res = client.post("/api/campaigns", json=valid_campaign_payload)
    assert res.status_code == 201
    data = res.get_json()

    assert "id" in data
    assert data["brand_name"] == "Lumina Skincare"
    assert data["status"] == "draft"
    assert data["generated_by"] == "user"
    assert data["user_edited_fields"] == []
    assert data["budget_min"] == 1000.0
    assert data["budget_max"] == 3000.0

    # Verify workflow was initialized simultaneously
    assert "workflow" in data
    wf = data["workflow"]
    assert wf["campaign_id"] == data["id"]
    assert wf["workflow_status"] == "draft"
    assert wf["selected_creator_ids"] == []


# ── 2. Missing and invalid required fields ────────────────────────────────────
def test_create_campaign_missing_fields(client):
    # Missing brand_name
    res = client.post("/api/campaigns", json={
        "product_description": "Description",
        "target_audience": "Audience",
        "budget_min": 100,
        "budget_max": 200,
        "currency": "USD",
    })
    assert res.status_code == 400
    err = res.get_json()
    assert err["code"] == "VALIDATION_ERROR"
    assert "brand_name" in err["error"]

    # Empty string product_description
    res2 = client.post("/api/campaigns", json={
        "brand_name": "Brand",
        "product_description": "   ",
        "target_audience": "Audience",
        "budget_min": 100,
        "budget_max": 200,
        "currency": "USD",
    })
    assert res2.status_code == 400
    assert res2.get_json()["code"] == "VALIDATION_ERROR"


# ── 3. Negative budgets and budget_min > budget_max ───────────────────────────
def test_create_campaign_invalid_budgets(client, valid_campaign_payload):
    # Negative budget_min
    bad_payload = dict(valid_campaign_payload, budget_min=-50)
    res = client.post("/api/campaigns", json=bad_payload)
    assert res.status_code == 400
    assert res.get_json()["code"] == "VALIDATION_ERROR"

    # budget_min > budget_max
    bad_payload2 = dict(valid_campaign_payload, budget_min=5000, budget_max=2000)
    res2 = client.post("/api/campaigns", json=bad_payload2)
    assert res2.status_code == 400
    assert res2.get_json()["code"] == "VALIDATION_ERROR"
    assert "greater than or equal" in res2.get_json()["error"]


# ── 4. Invalid currency and deadline formats ──────────────────────────────────
def test_create_campaign_invalid_currency(client, valid_campaign_payload):
    bad_payload = dict(valid_campaign_payload, currency="XYZ")
    res = client.post("/api/campaigns", json=bad_payload)
    assert res.status_code == 400
    err = res.get_json()
    assert err["code"] == "VALIDATION_ERROR"
    assert "currency" in err["error"].lower()


def test_create_campaign_invalid_deadline(client, valid_campaign_payload):
    bad_payload = dict(valid_campaign_payload, deadline="not-a-valid-date-str")
    res = client.post("/api/campaigns", json=bad_payload)
    assert res.status_code == 400
    err = res.get_json()
    assert err["code"] == "VALIDATION_ERROR"
    assert "deadline" in err["error"].lower()


# ── 5. Workflow initialization correctness ─────────────────────────────────────
def test_workflow_initialization_in_db(client, valid_campaign_payload):
    res = client.post("/api/campaigns", json=valid_campaign_payload)
    assert res.status_code == 201
    camp_id = res.get_json()["id"]

    with get_session() as session:
        wf = session.query(CampaignWorkflowModel).filter(
            CampaignWorkflowModel.campaign_id == camp_id
        ).all()
        # Exactly one workflow record must exist
        assert len(wf) == 1
        assert wf[0].workflow_status == "draft"
        assert wf[0].selected_creator_ids == "[]"


# ── 6. Successful mock brief generation ────────────────────────────────────────
def test_mock_brief_generation_success(client, valid_campaign_payload):
    res = client.post("/api/campaigns", json=valid_campaign_payload)
    camp_id = res.get_json()["id"]

    # Generate brief
    gen_res = client.post(f"/api/campaigns/{camp_id}/generate-brief")
    assert gen_res.status_code == 200
    data = gen_res.get_json()

    assert data["source"] == "mock"
    assert data["model"] is None
    assert "warning" in data
    assert "brief" in data

    brief = data["brief"]
    assert brief["status"] == "brief_ready"
    assert brief["generated_by"] == "mock"
    assert brief["campaign_title"] != ""
    assert brief["objective"] != ""
    assert len(brief["deliverables"]) > 0


# ── 7. Immutable fields preserved through generation ───────────────────────────
def test_immutable_fields_preserved_through_generation(client, valid_campaign_payload):
    res = client.post("/api/campaigns", json=valid_campaign_payload)
    camp_id = res.get_json()["id"]

    gen_res = client.post(f"/api/campaigns/{camp_id}/generate-brief")
    assert gen_res.status_code == 200
    brief = gen_res.get_json()["brief"]

    # Verify immutable fields match original input
    assert brief["brand_name"] == valid_campaign_payload["brand_name"]
    assert brief["product_description"] == valid_campaign_payload["product_description"]
    assert brief["target_audience"] == valid_campaign_payload["target_audience"]
    assert brief["budget_min"] == valid_campaign_payload["budget_min"]
    assert brief["budget_max"] == valid_campaign_payload["budget_max"]
    assert brief["currency"] == valid_campaign_payload["currency"]
    assert brief["deadline"] == valid_campaign_payload["deadline"]


# ── 8. User-edited fields preserved through regeneration ───────────────────────
def test_user_edited_fields_preserved_on_regeneration(client, valid_campaign_payload):
    res = client.post("/api/campaigns", json=valid_campaign_payload)
    camp_id = res.get_json()["id"]

    # First generation
    client.post(f"/api/campaigns/{camp_id}/generate-brief")

    # User manually edits campaign_title and deliverables via PATCH
    custom_title = "My Handcrafted Custom Campaign Title"
    custom_deliverables = ["10 x custom TikTok videos"]
    patch_res = client.patch(f"/api/campaigns/{camp_id}", json={
        "campaign_title": custom_title,
        "deliverables": custom_deliverables,
    })
    assert patch_res.status_code == 200
    patched_brief = patch_res.get_json()
    assert "campaign_title" in patched_brief["user_edited_fields"]
    assert "deliverables" in patched_brief["user_edited_fields"]

    # Regenerate brief
    regen_res = client.post(f"/api/campaigns/{camp_id}/generate-brief")
    assert regen_res.status_code == 200
    regen_brief = regen_res.get_json()["brief"]

    # User edits must be preserved verbatim
    assert regen_brief["campaign_title"] == custom_title
    assert regen_brief["deliverables"] == custom_deliverables


# ── 9. PATCH updates editable fields ───────────────────────────────────────────
def test_patch_updates_editable_fields(client, valid_campaign_payload):
    res = client.post("/api/campaigns", json=valid_campaign_payload)
    camp_id = res.get_json()["id"]

    patch_payload = {
        "campaign_title": "Summer Spark Glow",
        "tone": "luxurious yet approachable",
        "key_messages": ["Pure peptide power", "Visible results in 7 days"],
    }
    patch_res = client.patch(f"/api/campaigns/{camp_id}", json={
        **patch_payload
    })
    assert patch_res.status_code == 200
    data = patch_res.get_json()

    assert data["campaign_title"] == "Summer Spark Glow"
    assert data["tone"] == "luxurious yet approachable"
    assert data["key_messages"] == ["Pure peptide power", "Visible results in 7 days"]
    assert set(data["user_edited_fields"]) >= {"campaign_title", "tone", "key_messages"}


# ── 10. PATCH rejects immutable fields ─────────────────────────────────────────
def test_patch_rejects_immutable_fields(client, valid_campaign_payload):
    res = client.post("/api/campaigns", json=valid_campaign_payload)
    camp_id = res.get_json()["id"]

    # Attempt to change brand_name
    bad_patch = client.patch(f"/api/campaigns/{camp_id}", json={
        "brand_name": "New Brand Name",
    })
    assert bad_patch.status_code == 400
    err = bad_patch.get_json()
    assert err["code"] == "IMMUTABLE_FIELD"
    assert "brand_name" in err["error"]

    # Attempt to change budget_min
    bad_patch2 = client.patch(f"/api/campaigns/{camp_id}", json={
        "budget_min": 50.0,
    })
    assert bad_patch2.status_code == 400
    assert bad_patch2.get_json()["code"] == "IMMUTABLE_FIELD"


# ── 11. Campaign retrieval returns both brief and workflow ─────────────────────
def test_get_campaign_detail_returns_brief_and_workflow(client, valid_campaign_payload):
    res = client.post("/api/campaigns", json=valid_campaign_payload)
    camp_id = res.get_json()["id"]

    get_res = client.get(f"/api/campaigns/{camp_id}")
    assert get_res.status_code == 200
    detail = get_res.get_json()

    assert "brief" in detail
    assert "workflow" in detail
    assert detail["brief"]["id"] == camp_id
    assert detail["workflow"]["campaign_id"] == camp_id


def test_list_campaigns(client, valid_campaign_payload):
    client.post("/api/campaigns", json=valid_campaign_payload)
    res = client.get("/api/campaigns")
    assert res.status_code == 200
    campaigns = res.get_json()
    assert isinstance(campaigns, list)
    assert len(campaigns) >= 1


# ── 12. Unknown campaign returns 404 ──────────────────────────────────────────
def test_unknown_campaign_returns_404(client):
    assert client.get("/api/campaigns/unknown-camp-999").status_code == 404
    assert client.post("/api/campaigns/unknown-camp-999/generate-brief").status_code == 404
    assert client.patch("/api/campaigns/unknown-camp-999", json={"tone": "warm"}).status_code == 404


# ── 13. Repeated generation does not duplicate workflow records ────────────────
def test_repeated_generation_no_duplicate_workflows(client, valid_campaign_payload):
    res = client.post("/api/campaigns", json=valid_campaign_payload)
    camp_id = res.get_json()["id"]

    # Run generation three times
    for _ in range(3):
        gen_res = client.post(f"/api/campaigns/{camp_id}/generate-brief")
        assert gen_res.status_code == 200

    with get_session() as session:
        workflows = session.query(CampaignWorkflowModel).filter(
            CampaignWorkflowModel.campaign_id == camp_id
        ).all()
        # Must still be exactly one workflow record
        assert len(workflows) == 1
        assert workflows[0].workflow_status == "brief_ready"


# ── 14. Provider failures return expected responses ────────────────────────────
def test_provider_rate_limit_error(app, client, valid_campaign_payload):
    res = client.post("/api/campaigns", json=valid_campaign_payload)
    camp_id = res.get_json()["id"]

    mock_failing_provider = MagicMock(spec=BriefProvider)
    mock_failing_provider.generate_brief.side_effect = GeminiRateLimitError("429 Resource Exhausted")

    # Temporarily set app config BRIEF_PROVIDER
    orig_provider = app.config.get("BRIEF_PROVIDER")
    app.config["BRIEF_PROVIDER"] = mock_failing_provider
    try:
        call_res = client.post(f"/api/campaigns/{camp_id}/generate-brief")
        assert call_res.status_code == 429
        err = call_res.get_json()
        assert err["code"] == "RATE_LIMIT_EXCEEDED"
        assert err["details"]["retry_after"] == 30
    finally:
        app.config["BRIEF_PROVIDER"] = orig_provider


def test_provider_timeout_error(app, client, valid_campaign_payload):
    res = client.post("/api/campaigns", json=valid_campaign_payload)
    camp_id = res.get_json()["id"]

    mock_failing_provider = MagicMock(spec=BriefProvider)
    mock_failing_provider.generate_brief.side_effect = GeminiTimeoutError("Deadline exceeded")

    orig_provider = app.config.get("BRIEF_PROVIDER")
    app.config["BRIEF_PROVIDER"] = mock_failing_provider
    try:
        call_res = client.post(f"/api/campaigns/{camp_id}/generate-brief")
        assert call_res.status_code == 504
        err = call_res.get_json()
        assert err["code"] == "GATEWAY_TIMEOUT"
    finally:
        app.config["BRIEF_PROVIDER"] = orig_provider


def test_provider_api_error(app, client, valid_campaign_payload):
    res = client.post("/api/campaigns", json=valid_campaign_payload)
    camp_id = res.get_json()["id"]

    mock_failing_provider = MagicMock(spec=BriefProvider)
    mock_failing_provider.generate_brief.side_effect = GeminiAPIError("General upstream failure")

    orig_provider = app.config.get("BRIEF_PROVIDER")
    app.config["BRIEF_PROVIDER"] = mock_failing_provider
    try:
        call_res = client.post(f"/api/campaigns/{camp_id}/generate-brief")
        assert call_res.status_code == 502
        err = call_res.get_json()
        assert err["code"] == "UPSTREAM_ERROR"
    finally:
        app.config["BRIEF_PROVIDER"] = orig_provider
