"""
backend/providers/gemini_provider.py
GeminiProvider — uses the official google-genai SDK.

Activated only when GEMINI_API_KEY and GEMINI_MODEL are both set
AND the model validates successfully on startup.

If validation fails for any reason, the app falls back to MockProvider.
P1 owns all changes.
"""

import json
import logging
import os
import re
import time
from typing import Optional

from backend.providers.base import BriefProvider, BriefResult

logger = logging.getLogger(__name__)

# Sensitive data redaction patterns to avoid leaking credentials into logs
_REDACT_PATTERNS = [
    re.compile(r"AIza[0-9A-Za-z-_]{30,45}"),            # Google API key pattern
    re.compile(r"key=([^& \t\r\n]+)", re.IGNORECASE),   # URL param key=...
    re.compile(r"x-goog-api-key['\":\s=]+([^\s,'\"]+)", re.IGNORECASE),
    re.compile(r"bearer\s+([^\s,'\"]+)", re.IGNORECASE),
    re.compile(r"password=([^& \t\r\n]+)", re.IGNORECASE),
]


def _sanitize_error_message(msg: str) -> str:
    """Removes API keys, bearer tokens, or credentials from error messages."""
    sanitized = str(msg or "")
    for pattern in _REDACT_PATTERNS:
        sanitized = pattern.sub("[REDACTED]", sanitized)
    return sanitized


# Fields Gemini is permitted to generate/update
_EDITABLE_FIELDS = {
    "campaign_title", "objective", "deliverables", "preferred_platforms",
    "required_skills", "preferred_niches", "preferred_style", "tone",
    "key_messages", "call_to_action",
}

_BRIEF_SCHEMA = {
    "campaign_title": "string",
    "objective": "string (one sentence)",
    "deliverables": "list of strings",
    "preferred_platforms": "list of strings (e.g. instagram, youtube, tiktok)",
    "required_skills": "list of strings",
    "preferred_niches": "list of strings",
    "preferred_style": "string (e.g. educational, entertaining, lifestyle)",
    "tone": "string (e.g. playful, professional, friendly)",
    "key_messages": "list of strings (2–4 items)",
    "call_to_action": "string",
}


def _build_prompt(raw_inputs: dict, user_edited_fields: list[str]) -> str:
    brand = raw_inputs.get("brand_name", "")
    product = raw_inputs.get("product_description", "")
    audience = raw_inputs.get("target_audience", "")
    budget_min = raw_inputs.get("budget_min", "")
    budget_max = raw_inputs.get("budget_max", "")
    currency = raw_inputs.get("currency", "USD")
    deadline = raw_inputs.get("deadline", "not specified")

    # Fields the user has edited — Gemini must preserve these exactly
    preserve_block = ""
    if user_edited_fields:
        preserve_lines = []
        for f in user_edited_fields:
            val = raw_inputs.get(f, "")
            preserve_lines.append(f'  "{f}": {json.dumps(val)}')
        preserve_block = (
            "\n\nIMPORTANT — preserve these user-edited values exactly "
            "(do not change them):\n" + "\n".join(preserve_lines)
        )

    return f"""You are a campaign strategist. Generate a structured campaign brief as valid JSON only.
Return ONLY a JSON object with these exact keys (no markdown, no explanation, no code fences):

{json.dumps(_BRIEF_SCHEMA, indent=2)}

Brand context:
- Brand name: {brand}
- Product / service: {product}
- Target audience: {audience}
- Budget: {currency} {budget_min}–{budget_max} (DO NOT change these values in your response)
- Deadline: {deadline} (DO NOT change this value in your response)
{preserve_block}

Return the JSON object now:"""


class GeminiProvider(BriefProvider):
    """
    Brief provider backed by Google Gemini (google-genai SDK).
    Falls back safely if the key or model is invalid.
    """

    def __init__(
        self,
        api_key: str,
        model_name: str,
        timeout_ms: Optional[int] = None,
        max_retries: Optional[int] = None,
    ) -> None:
        self._model_name = model_name
        self._available = False
        self._client = None
        self._timeout_ms = timeout_ms if timeout_ms is not None else int(os.getenv("GEMINI_TIMEOUT_MS", "45000"))
        self._max_retries = max_retries if max_retries is not None else int(os.getenv("GEMINI_MAX_RETRIES", "2"))

        try:
            from google import genai  # type: ignore
            from google.genai import types  # type: ignore

            http_options = types.HttpOptions(
                timeout=self._timeout_ms,
                retry_options=types.HttpRetryOptions(
                    attempts=self._max_retries,
                    http_status_codes=[429, 500, 503, 504],
                ),
            )
            self._client = genai.Client(api_key=api_key, http_options=http_options)
            # Validate the model exists for this key
            self._client.models.get(model=model_name)
            self._available = True
            logger.info(
                "GeminiProvider: model '%s' validated successfully (timeout: %dms, retries: %d).",
                model_name, self._timeout_ms, self._max_retries,
            )
        except ImportError:
            logger.warning("GeminiProvider: google-genai package not installed. Using mock.")
        except Exception as exc:
            safe_err = _sanitize_error_message(str(exc))
            logger.warning(
                "GeminiProvider: model validation failed (%s: %s). Will use mock.",
                type(exc).__name__, safe_err,
            )

    def generate_brief(
        self,
        raw_inputs: dict,
        user_edited_fields: list[str],
    ) -> BriefResult:
        if not self._available or self._client is None:
            # Should not normally be called if is_available() is False,
            # but guard defensively.
            from backend.providers.mock_provider import MockProvider
            return MockProvider().generate_brief(raw_inputs, user_edited_fields)

        prompt = _build_prompt(raw_inputs, user_edited_fields)
        start_time = time.perf_counter()

        try:
            from google.genai import types  # type: ignore

            config = types.GenerateContentConfig(
                response_mime_type="application/json",
            )
            response = self._client.models.generate_content(
                model=self._model_name,
                contents=prompt,
                config=config,
            )
            text = (response.text or "").strip()
            fields = self._parse_response(text)
            if fields is None:
                # Retry with stricter prompt
                logger.info("GeminiProvider: Initial response was not clean JSON. Retrying with stricter instructions.")
                retry_prompt = prompt + "\n\nReturn ONLY the JSON object. No other text."
                retry_response = self._client.models.generate_content(
                    model=self._model_name,
                    contents=retry_prompt,
                    config=config,
                )
                retry_text = (retry_response.text or "").strip()
                fields = self._parse_response(retry_text)
                if fields is None:
                    elapsed = round(time.perf_counter() - start_time, 2)
                    logger.warning(
                        "GeminiProvider: parse failed after %.2fs. Returning partial fallback.",
                        elapsed,
                    )
                    return BriefResult(
                        source="gemini_raw",
                        model=self._model_name,
                        fields={},
                        raw_text=text,
                        warning=(
                            "Brief partially generated. "
                            "Gemini returned an unexpected format. "
                            "Please review and complete missing fields."
                        ),
                    )

            # Preserve user-edited fields
            for field_name in user_edited_fields:
                if field_name in raw_inputs:
                    fields[field_name] = raw_inputs[field_name]

            # Determine source
            source = "gemini_partial" if user_edited_fields else "gemini"
            elapsed = round(time.perf_counter() - start_time, 2)
            logger.info(
                "GeminiProvider: brief successfully generated in %.2fs (source: %s, model: %s).",
                elapsed, source, self._model_name,
            )
            return BriefResult(
                source=source,
                model=self._model_name,
                fields=fields,
            )

        except Exception as exc:
            elapsed = round(time.perf_counter() - start_time, 2)
            exc_name = type(exc).__name__
            safe_msg = _sanitize_error_message(str(exc))
            exc_str = safe_msg.lower()

            logger.warning(
                "GeminiProvider: generation failed after %.2fs with %s: %s",
                elapsed, exc_name, safe_msg,
            )

            # Check for Rate limit
            if (
                "429" in safe_msg
                or "resource_exhausted" in exc_str
                or "rate" in exc_name.lower()
                or "ratelimit" in exc_str
                or "quota" in exc_str
            ):
                raise _GeminiRateLimitError(f"Rate limit exceeded: {safe_msg}") from exc

            # Check for Timeout / deadline / cancelled
            if (
                "timeout" in exc_name.lower()
                or "deadline" in exc_name.lower()
                or "timeout" in exc_str
                or "deadline" in exc_str
            ):
                raise _GeminiTimeoutError(f"Request timed out: {safe_msg}") from exc

            # Other API error
            raise _GeminiAPIError(f"Provider API error: {safe_msg}") from exc

    def _parse_response(self, text: str) -> Optional[dict]:
        """Attempt to parse JSON from Gemini's response. Returns None on failure."""
        if not text:
            return None
        # Strip markdown code fences if present
        if text.startswith("```"):
            lines = text.split("\n")
            text = "\n".join(
                line for line in lines
                if not line.strip().startswith("```")
            ).strip()
        try:
            data = json.loads(text)
            if not isinstance(data, dict):
                return None
            # Filter to only editable fields
            return {k: v for k, v in data.items() if k in _EDITABLE_FIELDS}
        except (json.JSONDecodeError, ValueError):
            return None

    def is_available(self) -> bool:
        return self._available

    def source_label(self) -> str:
        return "gemini"


# ── Custom exceptions ──────────────────────────────────────────────────────────

class _GeminiRateLimitError(Exception):
    pass

class _GeminiTimeoutError(Exception):
    pass

class _GeminiAPIError(Exception):
    pass

# Export for use in routes
GeminiRateLimitError = _GeminiRateLimitError
GeminiTimeoutError = _GeminiTimeoutError
GeminiAPIError = _GeminiAPIError
