"""
backend/services/matching_service.py
Deterministic 5-factor matching algorithm and persistence for CreatorConnect AI.
P1 owns all changes.

Formula:
    overall_score = (
        skill_score        * 0.35 +
        portfolio_score    * 0.25 +
        style_score        * 0.20 +
        budget_score       * 0.10 +
        availability_score * 0.10
    )
Range: [0.00, 100.00], rounded to 2 decimal places.
Sorting: total_score DESC, then skill_score DESC, then creator_id ASC.
"""

from datetime import datetime, timezone
import json
import logging
import re
from typing import Optional
import uuid

from backend.contracts.match import SCORE_WEIGHTS, ScoreBreakdown, MatchResult
from backend.models.database import get_session
from backend.models.creator_model import CreatorModel
from backend.models.campaign_model import CampaignBriefModel, CampaignWorkflowModel
from backend.models.match_model import MatchResultModel

logger = logging.getLogger(__name__)


# ── Custom Exceptions ──────────────────────────────────────────────────────────

class MatchingCampaignNotFoundError(Exception):
    def __init__(self, campaign_id: str):
        super().__init__(f"Campaign with ID '{campaign_id}' was not found.")
        self.campaign_id = campaign_id
        self.code = "NOT_FOUND"


class InsufficientCampaignDataError(Exception):
    def __init__(self, message: str, details: Optional[dict] = None):
        super().__init__(message)
        self.message = message
        self.details = details or {}
        self.code = "INSUFFICIENT_CAMPAIGN_DATA"


# ── Helpers for text and token comparison ─────────────────────────────────────

def _tokenize(text: str) -> set[str]:
    """Extracts lowercase alphanumeric words (length >= 3) from text."""
    if not text:
        return set()
    return set(re.findall(r"\b[a-zA-Z0-9_\-]{3,}\b", text.lower()))


def _subphrase_match(term: str, target_tokens_or_string: str) -> bool:
    """Checks if a term appears as a substring in target string or token list."""
    term_clean = term.strip().lower()
    if not term_clean:
        return False
    return term_clean in target_tokens_or_string.lower()


# ── Scoring Components ────────────────────────────────────────────────────────

def compute_skill_niche_score(
    campaign_skills: list[str],
    campaign_niches: list[str],
    creator_skills: list[str],
    creator_niches: list[str],
    creator_tools: list[str],
    creator_disciplines: Optional[list[str]] = None,
) -> tuple[float, list[str], list[str]]:
    """
    Computes skill and niche relevance (0.0 to 100.0).
    Weight: 35%.
    """
    matched_skills = []
    creator_skill_corpus = " ".join(creator_skills + creator_tools + (creator_disciplines or [])).lower()

    for req in campaign_skills:
        req_clean = req.strip()
        if not req_clean:
            continue
        if _subphrase_match(req_clean, creator_skill_corpus):
            matched_skills.append(req_clean)
        else:
            # Check individual tokens
            req_tokens = _tokenize(req_clean)
            if req_tokens and req_tokens.issubset(_tokenize(creator_skill_corpus)):
                matched_skills.append(req_clean)

    matched_niches = []
    creator_niche_corpus = " ".join(creator_niches).lower()

    for niche in campaign_niches:
        niche_clean = niche.strip()
        if not niche_clean:
            continue
        if _subphrase_match(niche_clean, creator_niche_corpus):
            matched_niches.append(niche_clean)

    # Calculate ratios
    req_skills_count = len([s for s in campaign_skills if s.strip()])
    req_niches_count = len([n for n in campaign_niches if n.strip()])

    if req_skills_count == 0 and req_niches_count == 0:
        return 0.0, [], []

    skill_ratio = (len(matched_skills) / req_skills_count) if req_skills_count > 0 else 0.0
    niche_ratio = (len(matched_niches) / req_niches_count) if req_niches_count > 0 else 0.0

    if req_skills_count > 0 and req_niches_count > 0:
        score = (skill_ratio * 0.60 + niche_ratio * 0.40) * 100.0
    elif req_skills_count > 0:
        score = skill_ratio * 100.0
    else:
        score = niche_ratio * 100.0

    return min(100.0, max(0.0, score)), matched_skills, matched_niches


def compute_portfolio_score(
    campaign_deliverables: list[str],
    campaign_platforms: list[str],
    campaign_product: str,
    campaign_audience: str,
    portfolio_items: list[dict],
    portfolio_evidence: str,
) -> tuple[float, list[str]]:
    """
    Computes portfolio relevance (0.0 to 100.0).
    Weight: 25%.
    Only uses evidence that exists in creator's portfolio items and evidence text.
    """
    if not portfolio_items and not (portfolio_evidence and portfolio_evidence.strip()):
        return 0.0, []

    matched_evidence = []
    points = 0.0

    UNKNOWN_PLATFORMS = {"unspecified", "unknown", "none", ""}

    # 1. Platform alignment (up to 30 points)
    preferred_platforms = {
        p.strip().lower() for p in campaign_platforms
        if p.strip() and p.strip().lower() not in UNKNOWN_PLATFORMS
    }
    creator_portfolio_platforms = {
        item.get("platform", "").strip().lower()
        for item in portfolio_items
        if item.get("platform") and item.get("platform").strip().lower() not in UNKNOWN_PLATFORMS
    }
    common_platforms = preferred_platforms.intersection(creator_portfolio_platforms)
    if preferred_platforms:
        if common_platforms:
            points += min(30.0, (len(common_platforms) / len(preferred_platforms)) * 30.0)
            matched_evidence.append(f"Platforms: {', '.join(sorted(common_platforms))}")
    else:
        if creator_portfolio_platforms:
            points += 15.0

    # 2. Content & Tag relevance from items (up to 40 points)
    campaign_text = f"{' '.join(campaign_deliverables)} {campaign_product} {campaign_audience}".lower()
    campaign_tokens = _tokenize(campaign_text)

    item_matches = 0
    for item in portfolio_items:
        title = item.get("title", "")
        desc = item.get("description", "")
        tags = item.get("tags", [])
        ctype = item.get("content_type", "")
        item_corpus = f"{title} {desc} {' '.join(tags)} {ctype}".lower()

        # Check for token overlap
        overlap = campaign_tokens.intersection(_tokenize(item_corpus))
        if overlap:
            item_matches += 1
            if len(matched_evidence) < 5:
                matched_evidence.append(f"Portfolio: '{title}' ({', '.join(list(overlap)[:3])})")

    if portfolio_items:
        match_ratio = min(1.0, item_matches / len(portfolio_items))
        points += match_ratio * 40.0

    # 3. Portfolio evidence narrative strength (up to 30 points)
    if portfolio_evidence and portfolio_evidence.strip():
        evidence_tokens = _tokenize(portfolio_evidence)
        shared_evidence_tokens = campaign_tokens.intersection(evidence_tokens)
        if shared_evidence_tokens:
            points += min(30.0, 15.0 + len(shared_evidence_tokens) * 3.0)
            matched_evidence.append("Strong relevant background evidence")
        else:
            points += 15.0
            matched_evidence.append("Demonstrated portfolio history")

    return min(100.0, max(0.0, points)), matched_evidence


def compute_style_score(
    campaign_style: str,
    campaign_tone: str,
    creator_styles: list[str],
) -> tuple[float, list[str]]:
    """
    Computes style compatibility (0.0 to 100.0).
    Weight: 20%.
    Missing style information must NOT count as a confirmed match.
    """
    if not creator_styles:
        return 0.0, []

    campaign_style_text = f"{campaign_style} {campaign_tone}".strip().lower()
    if not campaign_style_text:
        return 0.0, []

    campaign_tokens = _tokenize(campaign_style_text)
    matched_tags = []

    for st in creator_styles:
        st_clean = st.strip().lower()
        if not st_clean:
            continue
        if _subphrase_match(st_clean, campaign_style_text) or _tokenize(st_clean).intersection(campaign_tokens):
            matched_tags.append(st.strip())

    if not matched_tags:
        return 0.0, []

    # Score scaling: first match gives 60 points, each additional match gives 20 points
    score = min(100.0, 60.0 + (len(matched_tags) - 1) * 20.0)
    return score, matched_tags


def compute_budget_score(
    creator_price: float,
    budget_min: float,
    budget_max: float,
    creator_currency: str,
    campaign_currency: str,
) -> tuple[float, bool, bool, list[str]]:
    """
    Computes budget fit (0.0 to 100.0).
    Weight: 10%.
    Returns (budget_score, budget_fit, over_budget, evidence_list).
    """
    c_curr = (
        creator_currency.strip().upper()
        if (isinstance(creator_currency, str) and creator_currency.strip())
        else None
    )
    camp_curr = (
        campaign_currency.strip().upper()
        if (isinstance(campaign_currency, str) and campaign_currency.strip())
        else None
    )

    # If currencies differ or are missing, mark budget fit as unknown without claiming over or compatible
    if not c_curr or not camp_curr or c_curr != camp_curr:
        c_disp = c_curr or "unspecified"
        camp_disp = camp_curr or "unspecified"
        evidence = [
            f"Creator starting rate: {c_disp} {creator_price:.2f}",
            f"Campaign budget range: {camp_disp} {budget_min:.2f}–{budget_max:.2f}",
            f"Budget compatibility unknown: differing or missing currencies ({c_disp} vs {camp_disp}).",
        ]
        return 0.0, False, False, evidence

    evidence = [
        f"Creator starting rate: {c_curr} {creator_price:.2f}",
        f"Campaign budget range: {camp_curr} {budget_min:.2f}–{budget_max:.2f}",
    ]

    # Perfect fit: within minimum and maximum
    if budget_min <= creator_price <= budget_max:
        return 100.0, True, False, evidence

    # Under budget (economical)
    if creator_price < budget_min:
        # Score remains high: 90 points
        evidence.append("Highly economical rate (below campaign minimum)")
        return 90.0, True, False, evidence

    # Over budget
    over_amount = creator_price - budget_max
    excess_ratio = over_amount / budget_max if budget_max > 0 else 1.0

    evidence.append(f"Over budget by {camp_curr} {over_amount:.2f} ({excess_ratio * 100:.1f}%)")

    if excess_ratio <= 0.25:
        # Slightly over budget (1-25%): 40 to 10 points
        score = max(10.0, 40.0 - (excess_ratio / 0.25) * 30.0)
        return score, False, True, evidence
    elif excess_ratio <= 0.50:
        # Moderately over budget (25-50%): 5 to 0 points
        score = max(0.0, 10.0 - ((excess_ratio - 0.25) / 0.25) * 10.0)
        return score, False, True, evidence
    else:
        # Severely over budget (>50%): 0 points
        return 0.0, False, True, evidence


def compute_availability_score(
    availability: bool,
) -> tuple[float, bool, list[str]]:
    """
    Computes availability score (0.0 or 100.0).
    Weight: 10%.
    Unavailable creators receive 0 and clear warning.
    """
    if availability:
        return 100.0, True, ["Creator is currently available"]
    else:
        return 0.0, False, ["WARNING: Creator is currently unavailable for bookings"]


# ── Narrative explanation generator ───────────────────────────────────────────

def generate_match_explanation(
    creator_name: str,
    total_score: float,
    skill_score: float,
    portfolio_score: float,
    style_score: float,
    budget_score: float,
    availability_score: float,
    matched_skills: list[str],
    matched_niches: list[str],
    matched_styles: list[str],
    over_budget: bool,
    available: bool,
    budget_status: str = "compatible",
    matched_disciplines: Optional[list[str]] = None,
) -> str:
    """Generates human-readable deterministic explanation grounded in evidence."""
    sentences = []

    # Overall match tier
    if total_score >= 80.0:
        tier_str = "Outstanding match"
    elif total_score >= 60.0:
        tier_str = "Strong match"
    elif total_score >= 40.0:
        tier_str = "Moderate match"
    else:
        tier_str = "Limited match"

    sentences.append(f"{tier_str} with an overall score of {total_score:.1f}/100.")

    # Skills & Niches
    skill_parts = []
    if matched_skills:
        skill_parts.append(f"skills in {', '.join(matched_skills)}")
    if matched_niches:
        skill_parts.append(f"niche expertise in {', '.join(matched_niches)}")
    if skill_parts:
        sentences.append(f"Demonstrates confirmed {' and '.join(skill_parts)}.")
    elif skill_score == 0.0:
        sentences.append("No overlap found with required campaign skills or niches.")

    # Disciplines
    if matched_disciplines:
        sentences.append(f"Specialized creative discipline: {', '.join(matched_disciplines)} with verified portfolio history.")

    # Style
    if matched_styles:
        sentences.append(f"Aesthetic aligns with requested tone ({', '.join(matched_styles)}).")
    else:
        sentences.append("Style tags do not strongly match the requested campaign tone.")

    # Budget & Availability warnings
    if budget_status == "unknown":
        sentences.append("Budget compatibility unknown because currencies differ or are missing.")
    elif budget_status == "over_budget" or over_budget:
        sentences.append("WARNING: Creator starting rate exceeds the campaign budget ceiling.")
    elif budget_status == "below_min":
        sentences.append("Creator rate is economical (below campaign minimum).")
    else:
        sentences.append("Pricing is compatible with the campaign budget.")

    if not available:
        sentences.append("WARNING: Creator is currently unavailable for bookings.")

    return " ".join(sentences)


# ── Evaluation Engine ──────────────────────────────────────────────────────────

def evaluate_creator_for_campaign(
    campaign_dict: dict,
    creator_dict: dict,
) -> MatchResult:
    """
    Scores a single creator against a campaign brief using deterministic rules.
    Returns MatchResult.
    """
    camp_skills = campaign_dict.get("required_skills", [])
    camp_niches = campaign_dict.get("preferred_niches", [])
    camp_platforms = campaign_dict.get("preferred_platforms", [])
    camp_deliverables = campaign_dict.get("deliverables", [])
    camp_product = campaign_dict.get("product_description", "")
    camp_audience = campaign_dict.get("target_audience", "")
    camp_style = campaign_dict.get("preferred_style", "")
    camp_tone = campaign_dict.get("tone", "")
    budget_min = float(campaign_dict.get("budget_min", 0.0))
    budget_max = float(campaign_dict.get("budget_max", 0.0))
    camp_currency = campaign_dict.get("currency")

    creator_skills = creator_dict.get("skills", [])
    creator_tools = creator_dict.get("ai_tools", [])
    creator_niches = creator_dict.get("niches", [])
    portfolio_items = creator_dict.get("portfolio_items", [])
    portfolio_evidence = creator_dict.get("portfolio_evidence", "")
    creator_styles = creator_dict.get("style_tags", [])
    creator_price = float(creator_dict.get("starting_price", 0.0))
    creator_currency = creator_dict.get("currency")
    creator_avail = bool(creator_dict.get("availability", False))

    creator_disciplines = creator_dict.get("disciplines")
    if not creator_disciplines:
        from backend.services.creator_service import derive_creator_disciplines
        creator_disciplines = derive_creator_disciplines(creator_dict)
        creator_dict["disciplines"] = creator_disciplines

    # 1. Skill & Niche (35%)
    skill_score, matched_skills, matched_niches = compute_skill_niche_score(
        camp_skills, camp_niches, creator_skills, creator_niches, creator_tools,
        creator_disciplines=creator_disciplines,
    )

    # 2. Portfolio (25%)
    portfolio_score, matched_portfolio = compute_portfolio_score(
        camp_deliverables, camp_platforms, camp_product, camp_audience,
        portfolio_items, portfolio_evidence
    )

    # 3. Style (20%)
    style_score, matched_styles = compute_style_score(
        camp_style, camp_tone, creator_styles
    )

    # Check currency matching
    c_curr = (
        creator_currency.strip().upper()
        if (isinstance(creator_currency, str) and creator_currency.strip())
        else None
    )
    camp_curr = (
        camp_currency.strip().upper()
        if (isinstance(camp_currency, str) and camp_currency.strip())
        else None
    )
    currencies_match = bool(c_curr and camp_curr and c_curr == camp_curr)

    # 4. Budget (10%)
    budget_score, budget_fit, over_budget, budget_evidence = compute_budget_score(
        creator_price, budget_min, budget_max, creator_currency, camp_currency
    )

    if not currencies_match:
        budget_status = "unknown"
    elif over_budget:
        budget_status = "over_budget"
    elif creator_price < budget_min:
        budget_status = "below_min"
    else:
        budget_status = "compatible"

    # 5. Availability (10%)
    avail_score, avail_fit, avail_evidence = compute_availability_score(
        creator_avail
    )

    # Calculate overall score [0.00, 100.00]
    if currencies_match:
        total_score = round(
            skill_score        * SCORE_WEIGHTS["skill_niche_relevance"] +
            portfolio_score    * SCORE_WEIGHTS["portfolio_relevance"]   +
            style_score        * SCORE_WEIGHTS["style_compatibility"]   +
            budget_score       * SCORE_WEIGHTS["budget_fit"]            +
            avail_score        * SCORE_WEIGHTS["availability"],
            2
        )
    else:
        # Exclude budget component from overall score and renormalize remaining weights proportionally
        active_weight_sum = (
            SCORE_WEIGHTS["skill_niche_relevance"] +
            SCORE_WEIGHTS["portfolio_relevance"]   +
            SCORE_WEIGHTS["style_compatibility"]   +
            SCORE_WEIGHTS["availability"]
        )
        raw_score = (
            skill_score        * SCORE_WEIGHTS["skill_niche_relevance"] +
            portfolio_score    * SCORE_WEIGHTS["portfolio_relevance"]   +
            style_score        * SCORE_WEIGHTS["style_compatibility"]   +
            avail_score        * SCORE_WEIGHTS["availability"]
        )
        total_score = round(min(100.0, max(0.0, raw_score / active_weight_sum)), 2) if active_weight_sum > 0 else 0.0

    score_breakdown = ScoreBreakdown(
        skill_niche_relevance=round(skill_score / 100.0, 4),
        portfolio_relevance=round(portfolio_score / 100.0, 4),
        style_compatibility=round(style_score / 100.0, 4),
        budget_fit=round(budget_score / 100.0, 4) if currencies_match else 0.0,
        availability=round(avail_score / 100.0, 4),
    )

    # Check for discipline alignment with brief
    campaign_corpus = f"{' '.join(camp_skills)} {' '.join(camp_niches)} {' '.join(camp_deliverables)} {camp_product} {camp_style}".lower()
    matched_disciplines = [
        d for d in creator_disciplines
        if d.lower() in campaign_corpus or any(tok in campaign_corpus for tok in d.lower().split() if len(tok) >= 4)
    ]

    evidence_dict: dict[str, list[str]] = {
        "skills": matched_skills,
        "niches": matched_niches,
        "portfolio": matched_portfolio,
        "style": matched_styles,
        "budget": budget_evidence,
        "availability": avail_evidence,
    }
    if matched_disciplines:
        evidence_dict["disciplines"] = [f"Verified {d}" for d in matched_disciplines]

    explanation = generate_match_explanation(
        creator_name=creator_dict.get("display_name", "Creator"),
        total_score=total_score,
        skill_score=skill_score,
        portfolio_score=portfolio_score,
        style_score=style_score,
        budget_score=budget_score,
        availability_score=avail_score,
        matched_skills=matched_skills,
        matched_niches=matched_niches,
        matched_styles=matched_styles,
        over_budget=over_budget,
        available=creator_avail,
        budget_status=budget_status,
        matched_disciplines=matched_disciplines,
    )

    from backend.models.creator_model import CreatorModel
    creator_profile_dataclass = CreatorModel.from_dict(creator_dict).to_dataclass()

    return MatchResult(
        campaign_id=campaign_dict["id"],
        creator_id=creator_dict["id"],
        creator=creator_profile_dataclass,
        total_score=total_score,
        score_breakdown=score_breakdown,
        evidence=evidence_dict,
        explanation=explanation,
        budget_fit=budget_fit,
        over_budget=over_budget,
        availability_fit=avail_fit,
        matched_at=datetime.now(timezone.utc).isoformat(),
    )


# ── Service Operations (Run Match & Retrieve Matches) ──────────────────────────

def run_campaign_matching(campaign_id: str) -> dict:
    """
    Loads campaign and creators, executes matching, atomically replaces previous results,
    advances workflow status to 'matches_ready', and returns MatchResponse dict.
    """
    with get_session() as session:
        # 1. Load campaign
        brief = session.get(CampaignBriefModel, campaign_id)
        if brief is None:
            raise MatchingCampaignNotFoundError(campaign_id)

        campaign_dict = brief.to_dict()

        # 2. Validate sufficient campaign information exists
        # Requires at least product_description and brand_name (present in brief)
        if not campaign_dict.get("brand_name") or not campaign_dict.get("product_description"):
            raise InsufficientCampaignDataError(
                "Campaign lacks essential brand or product information for creator matching.",
                {"campaign_id": campaign_id}
            )

        # 3. Load creators
        creators = session.query(CreatorModel).all()
        creator_dicts = [c.to_dict() for c in creators]

        matched_results: list[MatchResult] = []
        for c_dict in creator_dicts:
            res = evaluate_creator_for_campaign(campaign_dict, c_dict)
            matched_results.append(res)

        # 4. Sort: total_score DESC, skill_score DESC, creator_id ASC (stable tie-breaker)
        matched_results.sort(
            key=lambda r: (
                -r.total_score,
                -r.score_breakdown.skill_niche_relevance,
                r.creator_id,
            )
        )

        match_time_iso = datetime.now(timezone.utc).isoformat()

        # 5. Atomically replace previous match results for this campaign
        session.query(MatchResultModel).filter(
            MatchResultModel.campaign_id == campaign_id
        ).delete()

        for r in matched_results:
            r.matched_at = match_time_iso
            model_inst = MatchResultModel(
                id=f"match-{uuid.uuid4().hex[:12]}",
                campaign_id=r.campaign_id,
                creator_id=r.creator_id,
                creator_snapshot=json.dumps(r.creator.__dict__, default=str),
                total_score=r.total_score,
                score_breakdown=json.dumps(r.score_breakdown.__dict__),
                evidence=json.dumps(r.evidence),
                explanation=r.explanation,
                budget_fit=r.budget_fit,
                over_budget=r.over_budget,
                availability_fit=r.availability_fit,
                matched_at=match_time_iso,
            )
            session.add(model_inst)

        # 6. Advance workflow status to 'matches_ready'
        workflow = session.query(CampaignWorkflowModel).filter(
            CampaignWorkflowModel.campaign_id == campaign_id
        ).first()

        if workflow:
            workflow.workflow_status = "matches_ready"
            workflow.updated_at = match_time_iso

        # Also update brief status if in draft or brief_ready
        if brief.status in ("draft", "brief_ready"):
            brief.status = "matches_ready"

        session.commit()

        # Retrieve saved models in order to build response
        saved_records = session.query(MatchResultModel).filter(
            MatchResultModel.campaign_id == campaign_id
        ).order_by(
            MatchResultModel.total_score.desc(),
            MatchResultModel.creator_id.asc(),
        ).all()

        results_data = [item.to_dict() for item in saved_records]

    return {
        "results": results_data,
        "campaign_id": campaign_id,
        "matched_at": match_time_iso,
        "total_evaluated": len(creator_dicts),
    }


def get_persisted_campaign_matches(campaign_id: str) -> dict:
    """
    Retrieves previously persisted match results for a campaign without recomputing.
    Returns empty results if matching has not been run.
    Raises MatchingCampaignNotFoundError if campaign does not exist.
    """
    with get_session() as session:
        brief = session.get(CampaignBriefModel, campaign_id)
        if brief is None:
            raise MatchingCampaignNotFoundError(campaign_id)

        saved_records = session.query(MatchResultModel).filter(
            MatchResultModel.campaign_id == campaign_id
        ).order_by(
            MatchResultModel.total_score.desc(),
            MatchResultModel.creator_id.asc(),
        ).all()

        if not saved_records:
            return {
                "results": [],
                "campaign_id": campaign_id,
                "matched_at": None,
                "total_evaluated": 0,
            }

        matched_at = saved_records[0].matched_at if saved_records else None
        results_data = [item.to_dict() for item in saved_records]

        return {
            "results": results_data,
            "campaign_id": campaign_id,
            "matched_at": matched_at,
            "total_evaluated": len(results_data),
        }
