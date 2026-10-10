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
from typing import Optional

from backend.providers.base import BriefProvider, BriefResult

logger = logging.getLogger(__name__)

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

    def __init__(self, api_key: str, model_name: str) -> None:
        self._model_name = model_name
        self._available = False
        self._client = None

        try:
            from google import genai  # type: ignore
            self._client = genai.Client(api_key=api_key)
            # Validate the model exists for this key
            self._client.models.get(model=model_name)
            self._available = True
            logger.info("GeminiProvider: model '%s' validated successfully.", model_name)
        except ImportError:
            logger.warning("GeminiProvider: google-genai package not installed. Using mock.")
        except Exception as exc:
            logger.warning(
                "GeminiProvider: model validation failed (%s). Will use mock.", exc
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

        try:
            response = self._client.models.generate_content(
                model=self._model_name,
                contents=prompt,
            )
            text = response.text.strip()
            fields = self._parse_response(text)
            if fields is None:
                # Retry with stricter prompt
                retry_prompt = prompt + "\n\nReturn ONLY the JSON object. No other text."
                retry_response = self._client.models.generate_content(
                    model=self._model_name,
                    contents=retry_prompt,
                )
                retry_text = retry_response.text.strip()
                fields = self._parse_response(retry_text)
                if fields is None:
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
            return BriefResult(
                source=source,
                model=self._model_name,
                fields=fields,
            )

        except Exception as exc:
            exc_name = type(exc).__name__
            exc_str = str(exc).lower()

            # Rate limit
            if "429" in str(exc) or "resource_exhausted" in exc_str or "rate" in exc_str:
                raise _GeminiRateLimitError(str(exc)) from exc
            # Timeout
            if "timeout" in exc_str or "deadline" in exc_str:
                raise _GeminiTimeoutError(str(exc)) from exc
            # Other API error
            raise _GeminiAPIError(str(exc)) from exc

    def _parse_response(self, text: str) -> Optional[dict]:
        """Attempt to parse JSON from Gemini's response. Returns None on failure."""
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
