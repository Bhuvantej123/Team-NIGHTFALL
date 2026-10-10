"""
backend/tests/test_mock_provider.py
Unit tests for MockProvider — verifies the deterministic fallback is correct.
"""

from backend.providers.mock_provider import MockProvider


def test_mock_provider_is_available():
    provider = MockProvider()
    assert provider.is_available() is True


def test_mock_provider_source_label():
    assert MockProvider().source_label() == "mock"


def test_mock_provider_returns_brief_result():
    provider = MockProvider()
    result = provider.generate_brief(
        raw_inputs={
            "brand_name": "TestBrand",
            "product_description": "A test product",
            "target_audience": "Developers",
            "budget_min": 500,
            "budget_max": 5000,
            "currency": "USD",
        },
        user_edited_fields=[],
    )
    assert result.source == "mock"
    assert result.model is None
    assert isinstance(result.fields, dict)
    assert result.warning is not None and "mock" in result.warning.lower()


def test_mock_provider_populates_required_fields():
    provider = MockProvider()
    result = provider.generate_brief(
        raw_inputs={"brand_name": "Acme", "product_description": "Anvils"},
        user_edited_fields=[],
    )
    for field in ("campaign_title", "objective", "deliverables", "tone",
                  "key_messages", "call_to_action"):
        assert field in result.fields, f"Missing field: {field}"


def test_mock_provider_preserves_user_edited_fields():
    provider = MockProvider()
    raw = {
        "brand_name": "Acme",
        "product_description": "Anvils",
        "tone": "very_serious_user_chosen_tone",
    }
    result = provider.generate_brief(raw_inputs=raw, user_edited_fields=["tone"])
    assert result.fields["tone"] == "very_serious_user_chosen_tone"


def test_mock_provider_brand_name_in_title():
    provider = MockProvider()
    result = provider.generate_brief(
        raw_inputs={"brand_name": "GloboCorp"},
        user_edited_fields=[],
    )
    assert "GloboCorp" in result.fields.get("campaign_title", "")
