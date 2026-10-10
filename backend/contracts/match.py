"""
backend/contracts/match.py
Canonical Python data shapes for MatchResult and ScoreBreakdown.
P1 owns all changes. Other team members must not edit this file.

Matching algorithm weights:
    skill_niche_relevance : 35%
    portfolio_relevance   : 25%
    style_compatibility   : 20%
    budget_fit            : 10%
    availability          : 10%

total_score = (
    skill_niche_relevance * 0.35 +
    portfolio_relevance   * 0.25 +
    style_compatibility   * 0.20 +
    budget_fit_score      * 0.10 +
    availability_score    * 0.10
) * 100   →  range [0.00, 100.00], rounded to 2 dp

Sorting: total_score DESC → skill_niche_relevance DESC → creator.handle ASC
"""

from dataclasses import dataclass, field
from backend.contracts.creator import CreatorProfile


@dataclass
class ScoreBreakdown:
    """
    Component scores — each in the range [0.0, 1.0].
    Multiply by the documented weight to get the component's contribution.
    """
    skill_niche_relevance: float    # weight: 35%
    portfolio_relevance: float      # weight: 25%
    style_compatibility: float      # weight: 20%
    budget_fit: float               # weight: 10%
    availability: float             # weight: 10%


@dataclass
class MatchResult:
    """
    A single creator's match result for a campaign.

    over_budget: True when creator.starting_price > campaign.budget_max
    Creators are NEVER hidden because they are unavailable or over-budget.
    Both flags are always returned so the UI can render appropriate badges.

    evidence: maps component name → list of matched terms / items
    explanation: deterministic prose generated from evidence; never from LLM
    """
    campaign_id: str
    creator_id: str
    creator: CreatorProfile                         # Snapshot embedded at match time
    total_score: float                              # 0.00 – 100.00
    score_breakdown: ScoreBreakdown
    evidence: dict[str, list[str]] = field(default_factory=dict)
    explanation: str = ""
    budget_fit: bool = True                         # True if within budget
    over_budget: bool = False                       # True if starting_price > budget_max
    availability_fit: bool = True
    matched_at: str = ""                            # ISO 8601


# Documented weights — single source of truth used by matching_service.py
SCORE_WEIGHTS: dict[str, float] = {
    "skill_niche_relevance": 0.35,
    "portfolio_relevance":   0.25,
    "style_compatibility":   0.20,
    "budget_fit":            0.10,
    "availability":          0.10,
}
