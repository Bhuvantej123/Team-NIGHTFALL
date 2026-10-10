"""
backend/providers/mock_provider.py
Deterministic MockProvider — no API key required.

Activated automatically when:
  - GEMINI_API_KEY is not set, OR
  - GEMINI_MODEL is not set, OR
  - GeminiProvider startup validation fails.

Every response is clearly labeled: source="mock", generated_by="mock".
The UI must display a visible amber banner whenever source="mock".
P1 owns all changes.
"""

from backend.providers.base import BriefProvider, BriefResult


# Deterministic sample values used by the mock — stable across runs
_MOCK_DELIVERABLES = [
    "2 × short-form video posts (60–90 seconds)",
    "3 × static image posts with branded captions",
    "1 × behind-the-scenes story series (5 frames)",
]

_MOCK_KEY_MESSAGES = [
    "Authentic quality you can trust",
    "Built for creators, loved by audiences",
    "Join a community that cares about impact",
]


class MockProvider(BriefProvider):
    """
    Deterministic brief generator for development and demos.
    Returns structurally valid CampaignBrief fields derived from raw_inputs.
    Never calls any external API.
    """

    def generate_brief(
        self,
        raw_inputs: dict,
        user_edited_fields: list[str],
    ) -> BriefResult:
        brand = raw_inputs.get("brand_name", "Your Brand")
        product = raw_inputs.get("product_description", "your product")
        audience = raw_inputs.get("target_audience", "your target audience")

        # Build editable fields — skip any the user has already edited
        generated = {
            "campaign_title": f"{brand} Creator Campaign",
            "objective": (
                f"Increase awareness of {product} among {audience} "
                f"through authentic AI-assisted creator content."
            ),
            "deliverables": _MOCK_DELIVERABLES,
            "preferred_platforms": ["instagram", "youtube", "tiktok"],
            "required_skills": ["video editing", "copywriting", "AI content creation"],
            "preferred_niches": ["lifestyle", "tech", "creativity"],
            "preferred_style": "authentic",
            "tone": "friendly and approachable",
            "key_messages": _MOCK_KEY_MESSAGES,
            "call_to_action": f"Discover {brand} — link in bio.",
        }

        # Preserve any fields the user has already manually edited
        for field_name in user_edited_fields:
            if field_name in raw_inputs:
                generated[field_name] = raw_inputs[field_name]

        return BriefResult(
            source="mock",
            model=None,
            fields=generated,
            warning=(
                "⚠ This brief was generated in mock mode. "
                "Gemini was unavailable or not configured."
            ),
        )

    def is_available(self) -> bool:
        return True  # Mock is always available

    def source_label(self) -> str:
        return "mock"
