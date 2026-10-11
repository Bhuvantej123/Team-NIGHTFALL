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
    res = client.get("/api/creators/c-test-1/analytics")
    assert res.status_code == 200
    data = res.get_json()
    assert data["creator_id"] == "c-test-1"

    # Test non-existent creator
    res_404 = client.get("/api/creators/nonexistent-999/analytics")
    assert res_404.status_code == 404

    # Test batch analytics
    res_batch = client.get("/api/creators/batch-analytics?ids=c-test-1,creator-001")
    assert res_batch.status_code == 200
    batch_data = res_batch.get_json()
    assert "c-test-1" in batch_data
    assert "creator-001" in batch_data

