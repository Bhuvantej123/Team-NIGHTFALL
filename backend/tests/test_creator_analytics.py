"""
backend/tests/test_creator_analytics.py
Unit and endpoint tests for creator intelligence analytics service and routes.
"""

import pytest
from backend.services.creator_analytics_service import (
    get_creator_analytics,
    get_all_social_metrics,
    get_all_campaign_performance,
    get_all_portfolio_metadata,
)


def test_social_metrics_loaded():
    records = get_all_social_metrics()
    assert len(records) > 0, "Social metrics should not be empty"
    first = records[0]
    assert "creator_id" in first
    assert "followers_at_start" in first
    assert "followers_at_end" in first


def test_campaign_performance_loaded():
    records = get_all_campaign_performance()
    assert len(records) > 0, "Campaign performance records should not be empty"
    first = records[0]
    assert "creator_id" in first
    assert "fictional_brand" in first
    assert "campaign_spend_inr" in first


def test_portfolio_metadata_loaded():
    records = get_all_portfolio_metadata()
    assert len(records) > 0, "Portfolio metadata should not be empty"
    first = records[0]
    assert "creator_id" in first
    assert "title" in first


def test_get_creator_analytics_known_creator():
    analytics = get_creator_analytics("creator-001")
    assert analytics["creator_id"] == "creator-001"
    assert analytics["has_telemetry"] is True
    assert analytics["summary"]["current_followers"] == 91200
    assert analytics["summary"]["avg_engagement_rate"] > 0
    assert len(analytics["growth_history"]) >= 2
    assert len(analytics["past_campaigns"]) >= 1
    assert len(analytics["portfolio_metadata"]) >= 1


def test_get_creator_analytics_unknown_creator():
    analytics = get_creator_analytics("nonexistent-creator-id")
    assert analytics["creator_id"] == "nonexistent-creator-id"
    assert analytics["has_telemetry"] is False
    assert analytics["summary"]["current_followers"] is None
    assert analytics["growth_history"] == []
    assert analytics["past_campaigns"] == []


def test_analytics_api_endpoints(client):
    # Test single creator analytics with seeded test creator
    res = client.get("/api/creators/test-creator-1/analytics")
    assert res.status_code == 200
    data = res.get_json()
    assert data["creator_id"] == "test-creator-1"

    # Test non-existent creator
    res_404 = client.get("/api/creators/nonexistent-999/analytics")
    assert res_404.status_code == 404

    # Test batch analytics
    res_batch = client.get("/api/creators/batch-analytics?ids=test-creator-1,creator-001")
    assert res_batch.status_code == 200
    batch_data = res_batch.get_json()
    assert "test-creator-1" in batch_data
    assert "creator-001" in batch_data


def test_creator_to_deal_attribution():
    """Verify exact creator-to-deal attribution based on creator_id."""
    # Check creator-001 (Aarav Sharma) -> camp-002 (CyberForge Dynamics)
    a1 = get_creator_analytics("creator-001")
    assert a1["has_collaborations"] is True
    assert len(a1["past_campaigns"]) == 1
    deal1 = a1["past_campaigns"][0]
    assert deal1["campaign_id"] == "camp-002"
    assert deal1["brand"] == "CyberForge Dynamics"
    assert deal1["product"] == "NovaStation AI Mini-PC"
    assert deal1["content_type"] == "brand_film"
    assert deal1["deliverables"] == "1x Dedicated 4K Cinematic Hardware Showcase (16:9) + Pinned UTM Tracking Link"
    assert deal1["associated_portfolio_work"] is not None
    assert deal1["associated_portfolio_work"]["id"] == "portfolio-003"
    assert deal1["associated_portfolio_work"]["title"] == "Neon Monolith: Brand Identity Film"

    # Check creator-002 (Pooja Varma) -> camp-001 (AuraSound Labs)
    a2 = get_creator_analytics("creator-002")
    assert a2["has_collaborations"] is True
    assert len(a2["past_campaigns"]) == 1
    deal2 = a2["past_campaigns"][0]
    assert deal2["campaign_id"] == "camp-001"
    assert deal2["brand"] == "AuraSound Labs"
    assert deal2["associated_portfolio_work"]["id"] == "portfolio-004"
    assert deal2["associated_portfolio_work"]["title"] == "Aura Pulse: Wireless Audio Launch Ad"

    # Check creator-003 (Meera Sen) -> camp-003 (Velluto Cosmetics)
    a3 = get_creator_analytics("creator-003")
    assert a3["past_campaigns"][0]["campaign_id"] == "camp-003"
    assert a3["past_campaigns"][0]["associated_portfolio_work"]["id"] == "portfolio-008"


def test_missing_collaboration_history():
    """Verify that creators without documented collaborations return an empty list and has_collaborations=False."""
    empty_creators = ["creator-011", "creator-014", "creator-015"]
    for cid in empty_creators:
        analytics = get_creator_analytics(cid)
        assert analytics["has_collaborations"] is False, f"{cid} should have has_collaborations=False"
        assert analytics["past_campaigns"] == [], f"{cid} should have empty past_campaigns"
        assert analytics["summary"]["total_verified_sponsorships"] == 0, f"{cid} should have 0 sponsorships"

    # Overall counts: exactly 12 creators have documented collaborations out of the 15 creators
    all_campaigns = get_all_campaign_performance()
    unique_creator_ids_in_source = {c["creator_id"] for c in all_campaigns}
    assert len(unique_creator_ids_in_source) == 12, "Exactly 12 distinct creators have source-backed campaigns"
    assert len(all_campaigns) == 12, "Exactly 12 campaign records exist in source data"


def test_provenance_and_metric_integrity():
    """Verify provenance metadata, demo labels, and lack of fabricated CTR."""
    analytics = get_creator_analytics("creator-001")
    deal = analytics["past_campaigns"][0]
    assert deal["provenance_label"] == "Sample / Demo Dataset (Simulated Merchant Audit)"
    assert deal["is_sample_demo"] is True
    assert deal["verification_status"] in ["Audited Telemetry", "Sample / Demo"]
    assert deal["status"] == "Completed"

    # Available genuine metrics for creator-001 / camp-002
    assert "sales_lift_pct" in deal and deal["sales_lift_pct"] == 104.4
    assert "traffic_lift_pct" in deal and deal["traffic_lift_pct"] == 255.6
    assert "link_clicks" in deal and deal["link_clicks"] == 2850
    assert "conversions" in deal and deal["conversions"] == 42
    assert "conversion_rate_pct" in deal and deal["conversion_rate_pct"] == 1.47
    assert "spend_inr" in deal and deal["spend_inr"] == 120000
    assert "roas_estimate" in deal and deal["roas_estimate"] is not None

    # Ensure CTR is NOT fabricated in source data
    all_campaigns = get_all_campaign_performance()
    for c in all_campaigns:
        assert "impressions" not in c, "Impressions should not exist in source campaign data"
        assert "ctr" not in c, "CTR should not exist in source campaign data"


def test_exclusion_of_deleted_creators():
    """Verify that Elena Rostova, Marcus Vance, and Aria Chen are excluded from all campaign data and analytics."""
    all_campaigns = get_all_campaign_performance()
    deleted_ids = {"creator-demo-01", "creator-demo-02", "creator-demo-03", "elena-rostova", "marcus-vance", "aria-chen"}
    for camp in all_campaigns:
        assert camp.get("creator_id") not in deleted_ids
        brand = camp.get("fictional_brand", "").lower()
        assert "elena rostova" not in brand
        assert "marcus vance" not in brand
        assert "aria chen" not in brand

    # Calling analytics for any deleted ID yields 0 campaigns
    for did in ["creator-demo-01", "creator-demo-02", "creator-demo-03"]:
        res = get_creator_analytics(did)
        assert res["has_collaborations"] is False
        assert res["past_campaigns"] == []


