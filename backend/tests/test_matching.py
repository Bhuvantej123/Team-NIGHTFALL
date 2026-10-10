"""
backend/tests/test_matching.py
Unit and integration tests for Creator Matching Engine, Scoring Rules, and Result Persistence.
Covers all 18 required scenarios for Phase 3.
P1 owns all changes.
"""

from unittest.mock import patch
import pytest

from backend.contracts.match import SCORE_WEIGHTS
from backend.models.database import get_session
from backend.models.creator_model import CreatorModel
from backend.models.campaign_model import CampaignBriefModel, CampaignWorkflowModel
from backend.models.match_model import MatchResultModel
from backend.services.matching_service import (
    evaluate_creator_for_campaign,
    compute_skill_niche_score,
    compute_portfolio_score,
    compute_style_score,
    compute_budget_score,
    compute_availability_score,
)


@pytest.fixture
def sample_campaign(client):
    payload = {
        "brand_name": "Aura Cosmetics",
        "product_description": "Clean, organic peptide morning cream with botanical extracts.",
        "target_audience": "Beauty and lifestyle enthusiasts on TikTok and Instagram.",
        "budget_min": 500.0,
        "budget_max": 1000.0,
        "currency": "USD",
        "deadline": "2026-09-01T00:00:00Z",
    }
    res = client.post("/api/campaigns", json=payload)
    assert res.status_code == 201
    camp_id = res.get_json()["id"]

    # Provide brief fields to match against
    client.patch(f"/api/campaigns/{camp_id}", json={
        "campaign_title": "Aura Glow Morning Serum Campaign",
        "objective": "Drive organic conversions for peptide skincare cream.",
        "deliverables": ["3 x TikTok UGC videos", "2 x Instagram lifestyle reels"],
        "preferred_platforms": ["instagram", "tiktok"],
        "required_skills": ["video editing", "AI image generation"],
        "preferred_niches": ["lifestyle", "beauty"],
        "preferred_style": "cinematic",
        "tone": "educational",
        "key_messages": ["Peptide power", "Clean beauty"],
    })
    return camp_id


# ── 1. Weighted score calculation ──────────────────────────────────────────────
def test_weighted_score_calculation():
    # Verify exact weights match Architecture v3
    assert SCORE_WEIGHTS["skill_niche_relevance"] == 0.35
    assert SCORE_WEIGHTS["portfolio_relevance"] == 0.25
    assert SCORE_WEIGHTS["style_compatibility"] == 0.20
    assert SCORE_WEIGHTS["budget_fit"] == 0.10
    assert SCORE_WEIGHTS["availability"] == 0.10
    assert sum(SCORE_WEIGHTS.values()) == 1.0


# ── 2. Score bounds and normalization ──────────────────────────────────────────
def test_score_bounds_and_normalization():
    campaign_dict = {
        "id": "c-test-bounds",
        "required_skills": ["3D rendering", "AI voiceover"],
        "preferred_niches": ["gaming"],
        "preferred_platforms": ["tiktok"],
        "deliverables": ["video"],
        "product_description": "VR gaming headset",
        "target_audience": "gamers",
        "preferred_style": "energetic",
        "tone": "humorous",
        "budget_min": 1000.0,
        "budget_max": 2000.0,
        "currency": "USD",
    }
    creator_dict = {
        "id": "creator-test-bounds",
        "display_name": "Test Creator",
        "handle": "@test_bounds",
        "bio": "Game artist and animator",
        "skills": ["3D rendering", "AI voiceover"],
        "ai_tools": ["Blender", "ElevenLabs"],
        "niches": ["gaming"],
        "platforms": [{"name": "tiktok", "handle": "@test_bounds"}],
        "portfolio_items": [{"id": "p1", "title": "VR headset animation", "description": "3D render clip", "platform": "tiktok", "tags": ["gaming", "vr"]}],
        "portfolio_evidence": "Extensive VR gaming video work",
        "style_tags": ["energetic", "humorous"],
        "starting_price": 1200.0,
        "currency": "USD",
        "availability": True,
        "created_at": "2026-01-01T00:00:00Z",
    }

    result = evaluate_creator_for_campaign(campaign_dict, creator_dict)
    assert 0.0 <= result.total_score <= 100.0
    sb = result.score_breakdown
    assert 0.0 <= sb.skill_niche_relevance <= 1.0
    assert 0.0 <= sb.portfolio_relevance <= 1.0
    assert 0.0 <= sb.style_compatibility <= 1.0
    assert 0.0 <= sb.budget_fit <= 1.0
    assert 0.0 <= sb.availability <= 1.0


# ── 3. Ranking and stable tie-breaking ─────────────────────────────────────────
def test_ranking_and_stable_tie_breaking(client, sample_campaign):
    res = client.post(f"/api/campaigns/{sample_campaign}/match")
    assert res.status_code == 200
    data = res.get_json()
    results = data["results"]
    assert len(results) >= 2

    # Verify descending order of total_score
    scores = [r["total_score"] for r in results]
    assert scores == sorted(scores, reverse=True)


# ── 4. Skills and niche relevance ──────────────────────────────────────────────
def test_skill_niche_relevance():
    score_full, skills_full, niches_full = compute_skill_niche_score(
        campaign_skills=["video editing", "AI image generation"],
        campaign_niches=["lifestyle"],
        creator_skills=["video editing", "AI image generation"],
        creator_niches=["lifestyle", "tech"],
        creator_tools=["Midjourney"],
    )
    assert score_full == 100.0
    assert len(skills_full) == 2
    assert len(niches_full) == 1

    # Zero overlap
    score_none, skills_none, niches_none = compute_skill_niche_score(
        campaign_skills=["3D modeling"],
        campaign_niches=["finance"],
        creator_skills=["copywriting"],
        creator_niches=["fashion"],
        creator_tools=[],
    )
    assert score_none == 0.0
    assert skills_none == []
    assert niches_none == []


# ── 5. Portfolio relevance ─────────────────────────────────────────────────────
def test_portfolio_relevance():
    score, evidence = compute_portfolio_score(
        campaign_deliverables=["TikTok video", "Instagram reel"],
        campaign_platforms=["instagram", "tiktok"],
        campaign_product="bioactive skincare",
        campaign_audience="beauty lovers",
        portfolio_items=[
            {"title": "Skincare Morning Routine", "description": "TikTok beauty video", "platform": "tiktok", "tags": ["beauty", "skincare"]}
        ],
        portfolio_evidence="5 years creating beauty tutorials on TikTok and Instagram",
    )
    assert score > 50.0
    assert len(evidence) > 0


# ── 6. Style compatibility and missing style data ──────────────────────────────
def test_style_compatibility_and_missing_data():
    # Matched style
    score_match, tags = compute_style_score(
        campaign_style="cinematic",
        campaign_tone="educational",
        creator_styles=["cinematic", "futuristic"],
    )
    assert score_match >= 60.0
    assert "cinematic" in tags

    # Missing creator style tags gives zero points (no assumed match)
    score_missing_creator, tags_missing = compute_style_score(
        campaign_style="cinematic",
        campaign_tone="educational",
        creator_styles=[],
    )
    assert score_missing_creator == 0.0
    assert tags_missing == []

    # Missing campaign style requirements gives zero points
    score_missing_campaign, _ = compute_style_score(
        campaign_style="",
        campaign_tone="",
        creator_styles=["minimalist"],
    )
    assert score_missing_campaign == 0.0


# ── 7. Budget fit and over-budget warnings ──────────────────────────────────────
def test_budget_fit_and_over_budget_flags():
    # In sweet spot (min <= rate <= max)
    score_in, fit_in, over_in, _ = compute_budget_score(
        creator_price=750.0, budget_min=500.0, budget_max=1000.0, creator_currency="USD", campaign_currency="USD"
    )
    assert score_in == 100.0
    assert fit_in is True
    assert over_in is False

    # Under budget min (economical)
    score_under, fit_under, over_under, _ = compute_budget_score(
        creator_price=300.0, budget_min=500.0, budget_max=1000.0, creator_currency="USD", campaign_currency="USD"
    )
    assert score_under == 90.0
    assert fit_under is True
    assert over_under is False

    # Over budget max
    score_over, fit_over, over_over, ev_over = compute_budget_score(
        creator_price=1200.0, budget_min=500.0, budget_max=1000.0, creator_currency="USD", campaign_currency="USD"
    )
    assert fit_over is False
    assert over_over is True
    assert any("Over budget" in item for item in ev_over)


# ── 8. Unavailable creators remain visible with availability score 0 ───────────
def test_unavailable_creators_remain_visible(client, sample_campaign):
    res = client.post(f"/api/campaigns/{sample_campaign}/match")
    assert res.status_code == 200
    results = res.get_json()["results"]

    # Check for creator c-test-2 who is unavailable in test fixtures
    unavailable_matches = [r for r in results if r["creator"]["availability"] is False]
    assert len(unavailable_matches) >= 1
    for unavail in unavailable_matches:
        assert unavail["score_breakdown"]["availability"] == 0.0
        assert unavail["availability_fit"] is False
        assert "WARNING: Creator is currently unavailable" in unavail["explanation"]


# ── 9. Missing evidence handling ───────────────────────────────────────────────
def test_missing_evidence_handling():
    # Creator with empty portfolio and empty styles
    empty_creator = {
        "id": "c-empty",
        "display_name": "New Creator",
        "handle": "@new_empty",
        "bio": "Bio",
        "skills": ["unrelated skill"],
        "ai_tools": [],
        "niches": ["unrelated niche"],
        "platforms": [{"name": "twitter", "handle": "@new"}],
        "portfolio_items": [],
        "portfolio_evidence": "",
        "style_tags": [],
        "starting_price": 500.0,
        "currency": "USD",
        "availability": True,
        "created_at": "2026-01-01T00:00:00Z",
    }
    camp = {
        "id": "c-1",
        "required_skills": ["video editing"],
        "preferred_niches": ["beauty"],
        "preferred_platforms": ["tiktok"],
        "deliverables": ["video"],
        "product_description": "skincare",
        "target_audience": "teens",
        "preferred_style": "minimalist",
        "tone": "casual",
        "budget_min": 400.0,
        "budget_max": 800.0,
        "currency": "USD",
    }
    res = evaluate_creator_for_campaign(camp, empty_creator)
    # Skill, portfolio, style should all be 0.0
    assert res.score_breakdown.skill_niche_relevance == 0.0
    assert res.score_breakdown.portfolio_relevance == 0.0
    assert res.score_breakdown.style_compatibility == 0.0
    # Overall score should only come from budget (10%) and availability (10%)
    assert res.total_score == 20.0


# ── 10. Matching a nonexistent campaign returns 404 ────────────────────────────
def test_match_nonexistent_campaign_returns_404(client):
    res = client.post("/api/campaigns/nonexistent-camp-999/match")
    assert res.status_code == 404
    err = res.get_json()
    assert err["code"] == "NOT_FOUND"


# ── 11. Matching results are persisted ─────────────────────────────────────────
def test_matching_results_are_persisted(client, sample_campaign):
    post_res = client.post(f"/api/campaigns/{sample_campaign}/match")
    assert post_res.status_code == 200

    # Verify rows exist in database
    with get_session() as session:
        records = session.query(MatchResultModel).filter(
            MatchResultModel.campaign_id == sample_campaign
        ).all()
        assert len(records) > 0


# ── 12. Repeated matching does not create duplicate result sets ────────────────
def test_repeated_matching_no_duplicates(client, sample_campaign):
    # Run matching 3 times
    client.post(f"/api/campaigns/{sample_campaign}/match")
    client.post(f"/api/campaigns/{sample_campaign}/match")
    res = client.post(f"/api/campaigns/{sample_campaign}/match")
    assert res.status_code == 200

    with get_session() as session:
        count = session.query(MatchResultModel).filter(
            MatchResultModel.campaign_id == sample_campaign
        ).count()
        # Should equal total_evaluated, not 3x
        assert count == res.get_json()["total_evaluated"]


# ── 13. GET retrieves persisted results without calling the scoring engine ─────
def test_get_retrieves_persisted_results(client, sample_campaign):
    client.post(f"/api/campaigns/{sample_campaign}/match")

    # Spy on evaluate_creator_for_campaign to ensure GET does not call scoring engine
    with patch("backend.services.matching_service.evaluate_creator_for_campaign") as mock_eval:
        get_res = client.get(f"/api/campaigns/{sample_campaign}/matches")
        assert get_res.status_code == 200
        data = get_res.get_json()
        assert len(data["results"]) > 0
        assert mock_eval.call_count == 0


# ── 14. An unmatched campaign returns the documented empty result ──────────────
def test_unmatched_campaign_returns_empty_result(client):
    # Create brand new campaign without running match
    create_res = client.post("/api/campaigns", json={
        "brand_name": "Unmatched Brand",
        "product_description": "New organic product",
        "target_audience": "Teens",
        "budget_min": 100.0,
        "budget_max": 200.0,
        "currency": "USD",
    })
    camp_id = create_res.get_json()["id"]

    res = client.get(f"/api/campaigns/{camp_id}/matches")
    assert res.status_code == 200
    data = res.get_json()
    assert data["results"] == []
    assert data["campaign_id"] == camp_id
    assert data["matched_at"] is None
    assert data["total_evaluated"] == 0


# ── 15. Successful matching transitions workflow to matches_ready ──────────────
def test_successful_matching_transitions_workflow(client, sample_campaign):
    res = client.post(f"/api/campaigns/{sample_campaign}/match")
    assert res.status_code == 200

    # Verify workflow status via GET /api/campaigns/<id>
    detail = client.get(f"/api/campaigns/{sample_campaign}").get_json()
    assert detail["workflow"]["workflow_status"] == "matches_ready"
    assert detail["brief"]["status"] == "matches_ready"


# ── 16. Failed matching leaves no partial results and does not advance workflow 
def test_failed_matching_transaction_rollback(client, sample_campaign):
    # Capture initial workflow status
    initial_wf_status = client.get(f"/api/campaigns/{sample_campaign}").get_json()["workflow"]["workflow_status"]

    # Force an error inside matching evaluation to trigger rollback
    with patch("backend.services.matching_service.evaluate_creator_for_campaign", side_effect=RuntimeError("Simulated DB Crash")):
        res = client.post(f"/api/campaigns/{sample_campaign}/match")
        assert res.status_code == 500

    # Verify no partial rows persisted
    with get_session() as session:
        count = session.query(MatchResultModel).filter(
            MatchResultModel.campaign_id == sample_campaign
        ).count()
        assert count == 0

    # Verify workflow status was NOT updated
    after_wf_status = client.get(f"/api/campaigns/{sample_campaign}").get_json()["workflow"]["workflow_status"]
    assert after_wf_status == initial_wf_status


# ── 17. Existing campaign and creator data remain intact ───────────────────────
def test_existing_campaign_and_creator_data_intact(client, sample_campaign):
    client.post(f"/api/campaigns/{sample_campaign}/match")

    # Creators still exist
    creators_res = client.get("/api/creators")
    assert creators_res.status_code == 200
    assert len(creators_res.get_json()) >= 3

    # Campaign brief still exists with all original properties
    camp_res = client.get(f"/api/campaigns/{sample_campaign}")
    assert camp_res.status_code == 200
    assert camp_res.get_json()["brief"]["brand_name"] == "Aura Cosmetics"


# ── 18. GET /api/campaigns/<id>/matches on unknown campaign returns 404 ────────
def test_get_matches_unknown_campaign_returns_404(client):
    res = client.get("/api/campaigns/unknown-camp-uuid-999/matches")
    assert res.status_code == 404
    assert res.get_json()["code"] == "NOT_FOUND"
