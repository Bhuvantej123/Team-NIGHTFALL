"""
backend/tests/test_health.py
Smoke tests for GET /api/health.
Phase 0 tests — must all pass before Phase 1 begins.
"""


def test_health_returns_200(client):
    response = client.get("/api/health")
    assert response.status_code == 200


def test_health_json_structure(client):
    data = client.get("/api/health").get_json()
    assert "status" in data
    assert "gemini_available" in data
    assert "source" in data
    assert data["status"] == "ok"


def test_health_no_api_key_uses_mock(client):
    """With no GEMINI_API_KEY configured, source must be 'mock'."""
    data = client.get("/api/health").get_json()
    assert data["source"] == "mock"
    assert data["gemini_available"] is False
    assert "mock_reason" in data
    assert data["mock_reason"] in ("GEMINI_NO_KEY", "GEMINI_NO_MODEL", "GEMINI_INVALID_MODEL")


def test_health_mock_reason_present_when_mock(client):
    data = client.get("/api/health").get_json()
    if data["source"] == "mock":
        assert data["mock_reason"] is not None
    else:
        # Live mode — mock_reason may be None or absent
        assert data.get("mock_reason") is None
