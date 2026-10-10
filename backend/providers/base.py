"""
backend/providers/base.py
Abstract BriefProvider interface.
Both GeminiProvider and MockProvider implement this interface.
BriefService always calls through BriefProvider; it never instantiates
either concrete class directly.
P1 owns all changes.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional


@dataclass
class BriefResult:
    """
    Output from a brief generation call.
    source: "gemini" | "gemini_partial" | "gemini_raw" | "mock"
    model: the Gemini model name, or None if mock
    raw_text: populated only when source == "gemini_raw" (parse failure)
    warning: non-empty string when the caller should display a user-visible warning
    fields: generated field values to merge into the CampaignBrief record
    """
    source: str
    model: Optional[str]
    fields: dict                  # Editable CampaignBrief fields generated/updated
    raw_text: Optional[str] = None
    warning: Optional[str] = None


class BriefProvider(ABC):
    """Abstract interface for brief generation providers."""

    @abstractmethod
    def generate_brief(
        self,
        raw_inputs: dict,
        user_edited_fields: list[str],
    ) -> BriefResult:
        """
        Generate (or regenerate) structured brief fields from raw campaign inputs.

        raw_inputs: dict containing all CampaignBrief fields (including immutable ones)
        user_edited_fields: list of editable field names that the user has manually
                            edited since the last generation. These must be preserved
                            verbatim and not overwritten by the provider.

        Returns a BriefResult; never raises — failures are encoded in the result.
        """
        ...

    @abstractmethod
    def is_available(self) -> bool:
        """Return True if this provider can reach its backend service."""
        ...

    @abstractmethod
    def source_label(self) -> str:
        """Return the source identifier: 'gemini' or 'mock'."""
        ...
