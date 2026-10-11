"""
backend/tests/test_gemini_provider.py
Unit tests for GeminiProvider timeout, retries, error sanitization, and exception mapping.
"""
from unittest.mock import MagicMock, patch
import httpx
import pytest

from backend.providers.gemini_provider import (
    GeminiProvider,
    GeminiRateLimitError,
    GeminiTimeoutError,
    GeminiAPIError,
    _sanitize_error_message,
)


def test_sanitize_error_message_redacts_secrets():
    raw_error = "API key AIzaSyAbc1234567890DefGhIjKlMnOpQrStU failed with key=secret_key_123 and bearer tok_xyz"
    sanitized = _sanitize_error_message(raw_error)
    assert "AIzaSy" not in sanitized
    assert "secret_key_123" not in sanitized
    assert "[REDACTED]" in sanitized


def test_gemini_provider_configures_http_options():
    with patch("google.genai.Client") as mock_client_cls:
        mock_client = MagicMock()
        mock_client_cls.return_value = mock_client

        provider = GeminiProvider(
            api_key="test-api-key",
            model_name="gemini-3.8-flash",
            timeout_ms=35000,
            max_retries=2,
        )

        assert provider.is_available() is True
        mock_client_cls.assert_called_once()
        _, kwargs = mock_client_cls.call_args
        assert kwargs["api_key"] == "test-api-key"
        assert kwargs["http_options"].timeout == 35000
        assert kwargs["http_options"].retry_options.attempts == 2
        assert kwargs["http_options"].retry_options.http_status_codes == [429, 500, 503, 504]


def test_gemini_provider_raises_timeout_on_httpx_timeout():
    with patch("google.genai.Client") as mock_client_cls:
        mock_client = MagicMock()
        mock_client_cls.return_value = mock_client
        mock_client.models.generate_content.side_effect = httpx.ReadTimeout("The read operation timed out")

        provider = GeminiProvider(
            api_key="test-api-key",
            model_name="gemini-3.8-flash",
            timeout_ms=45000,
        )

        with pytest.raises(GeminiTimeoutError) as exc_info:
            provider.generate_brief(
                raw_inputs={"brand_name": "Test Brand", "product_description": "Test App"},
                user_edited_fields=[],
            )
        assert "timed out" in str(exc_info.value).lower()


def test_gemini_provider_raises_timeout_on_empty_message_read_timeout():
    with patch("google.genai.Client") as mock_client_cls:
        mock_client = MagicMock()
        mock_client_cls.return_value = mock_client
        mock_client.models.generate_content.side_effect = httpx.ReadTimeout("")

        provider = GeminiProvider(
            api_key="test-api-key",
            model_name="gemini-3.8-flash",
            timeout_ms=45000,
        )

        with pytest.raises(GeminiTimeoutError):
            provider.generate_brief(
                raw_inputs={"brand_name": "Test Brand", "product_description": "Test App"},
                user_edited_fields=[],
            )


def test_gemini_provider_raises_rate_limit_on_429():
    with patch("google.genai.Client") as mock_client_cls:
        mock_client = MagicMock()
        mock_client_cls.return_value = mock_client
        mock_client.models.generate_content.side_effect = Exception("429 Resource Exhausted: quota exceeded")

        provider = GeminiProvider(
            api_key="test-api-key",
            model_name="gemini-3.8-flash",
        )

        with pytest.raises(GeminiRateLimitError):
            provider.generate_brief(
                raw_inputs={"brand_name": "Test Brand", "product_description": "Test App"},
                user_edited_fields=[],
            )


def test_gemini_provider_raises_api_error_on_generic_upstream_failure():
    with patch("google.genai.Client") as mock_client_cls:
        mock_client = MagicMock()
        mock_client_cls.return_value = mock_client
        mock_client.models.generate_content.side_effect = Exception("500 Internal Service Error")

        provider = GeminiProvider(
            api_key="test-api-key",
            model_name="gemini-3.8-flash",
        )

        with pytest.raises(GeminiAPIError):
            provider.generate_brief(
                raw_inputs={"brand_name": "Test Brand", "product_description": "Test App"},
                user_edited_fields=[],
            )


def test_gemini_provider_generates_brief_with_json_mime_type():
    with patch("google.genai.Client") as mock_client_cls:
        mock_client = MagicMock()
        mock_client_cls.return_value = mock_client

        mock_resp = MagicMock()
        mock_resp.text = '{"campaign_title": "AI Launch", "objective": "Drive signups", "deliverables": ["1 Reel"]}'
        mock_client.models.generate_content.return_value = mock_resp

        provider = GeminiProvider(
            api_key="test-api-key",
            model_name="gemini-3.8-flash",
        )

        result = provider.generate_brief(
            raw_inputs={"brand_name": "SaaS Co", "product_description": "AI Tool"},
            user_edited_fields=[],
        )

        assert result.source == "gemini"
        assert result.fields["campaign_title"] == "AI Launch"
        assert result.fields["objective"] == "Drive signups"
        assert result.fields["deliverables"] == ["1 Reel"]

        # Verify config had response_mime_type="application/json"
        call_kwargs = mock_client.models.generate_content.call_args.kwargs
        assert call_kwargs["config"].response_mime_type == "application/json"
