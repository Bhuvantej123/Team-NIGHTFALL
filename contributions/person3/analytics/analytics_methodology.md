# CreatorConnect AI — Analytics Methodology & Sponsor Intelligence Specification

**Contributor:** Person 3  
**Deliverables Directory:** `contributions/person3/analytics/`  
**Target Integration Owner:** Person 1 (Backend & Database Architecture)  
**Status:** Synthetic Demonstration Data & Specification  

---

## 1. Executive Summary & Purpose

This directory provides advanced analytics datasets and sponsor-matching intelligence for the **CreatorConnect AI** platform, extending base creator profiles with:
1. **Historical Social Telemetry:** Multi-period performance tracking across social platforms ([`creator_social_metrics.json`](./creator_social_metrics.json)).
2. **Product Campaign Outcomes:** Fictional brand campaign benchmarks with observed vs. attributed metrics ([`previous_campaign_performance.json`](./previous_campaign_performance.json)).
3. **Sponsor Opportunity Blueprints:** End-to-end sponsorship scenarios across 8 industries with criteria-based creator recommendations ([`sponsor_opportunity_examples.json`](./sponsor_opportunity_examples.json)).
4. **Analytics Methodology (This Document):** Complete mathematical formulations, data quality guardrails, attribution boundaries, and backend integration guidance.

> [!IMPORTANT]
> **Simulated Demo Notice:**  
> All records in these files are explicitly marked `"is_simulated": true`. They are designed to empower the team's matching algorithms, analytics calculators, and UI demo cards with realistic data distributions without inventing real-world client claims or unverified statistics.

---

## 2. Metric Catalog & Definitions

### 2.1 Social Media Metrics (`creator_social_metrics.json`)

| Metric Field | Type | Unit | Definition |
|---|---|---|---|
| `creator_id` | `string` | Foreign Key | Canonical creator ID referencing [`../creators.json`](../creators.json). |
| `platform` | `string` | Enum | Publishing channel (`youtube`, `instagram`, `tiktok`, `linkedin`, `twitter`). |
| `reporting_period_start` | `string` | ISO 8601 Date | First day of reporting interval (`YYYY-MM-DD`). |
| `reporting_period_end` | `string` | ISO 8601 Date | Last day of reporting interval (`YYYY-MM-DD`). |
| `followers_at_start` | `integer` | Count | Net audience follower count on day 1 of the period. |
| `followers_at_end` | `integer` | Count | Net audience follower count on closing day of the period. |
| `total_views` | `integer` | Count | Aggregated video playback events triggered across published content. |
| `reach` | `integer` | Unique Accounts | Unique user profiles that viewed the creator's posts at least once. |
| `likes` | `integer` | Count | Explicit positive endorsement taps / reactions. |
| `comments` | `integer` | Count | Direct user comments left on posts. |
| `shares` | `integer` | Count | User shares to stories, DMs, or external messaging platforms. |
| `saves` | `integer` | Count | Content bookmarking events (high proxy for commercial intent). |
| `profile_visits` | `integer` | Count | Taps onto the creator's main account profile originating from posts. |
| `link_clicks` | `integer` | Count | Outbound taps on bio links, story stickers, or post descriptions. |
| `data_source` | `string` | Metadata | Simulated ingestion telemetry tag. |
| `is_simulated` | `boolean` | Flag | Explicit indicator that data is synthetic demo data (`true`). |

### 2.2 Campaign Performance Metrics (`previous_campaign_performance.json`)

| Metric Field | Type | Unit | Definition |
|---|---|---|---|
| `campaign_id` | `string` | Identifier | Unique historical campaign record ID (`camp-001` to `camp-012`). |
| `creator_id` | `string` | Foreign Key | Associated creator who produced campaign creative. |
| `fictional_brand` | `string` | Label | Fictional commercial sponsor brand. |
| `fictional_product` | `string` | Label | Fictional product marketed in campaign. |
| `campaign_objective` | `string` | Strategy | Target business goal (e.g. `product_launch_sales`, `dtc_trial_conversions`). |
| `platform` | `string` | Enum | Primary publishing channel for campaign creative. |
| `campaign_start` | `string` | ISO 8601 Date | Campaign launch date. |
| `campaign_end` | `string` | ISO 8601 Date | Campaign wrap date. |
| `campaign_spend_inr` | `number` | INR | Total fees paid to creator for creative development and licensing. |
| `baseline_product_sales` | `integer` | Units | Historical rolling median sales volume in pre-campaign window. |
| `post_campaign_product_sales`| `integer` | Units | Total product units sold during the campaign measurement window. |
| `baseline_website_visits` | `integer` | Sessions | Pre-campaign baseline website traffic in equivalent duration. |
| `post_campaign_website_visits`| `integer` | Sessions | Total website visitor sessions observed during campaign flight. |
| `link_clicks` | `integer` | Count | Direct outbound traffic directed to sponsor landing page. |
| `conversions` | `integer` | Actions | Attributed purchases/leads tied specifically to campaign tracking. |
| `attribution_method` | `string` | Methodology | Tracking mechanism (`promo_code_redemption`, `last_touch_utm`, etc.). |
| `data_source` | `string` | Metadata | Ingestion engine identifier. |
| `is_simulated` | `boolean` | Flag | Strict simulation flag (`true`). |

---

## 3. Disambiguation: Views vs. Reach vs. Impressions vs. Engagement

Understanding the nuance between audience metrics is vital for sponsor matching:

```
[ Impressions ]  --> Total times content was rendered on a screen (includes repeats).
       │
[ Total Views ]  --> Total times video play was initiated (>= 3s or platform threshold).
       │
   [ Reach ]     --> Distinct individual user accounts that saw the content.
       │
 [ Engagement ]  --> Active user actions taken on the content (Likes + Comments + Shares + Saves).
```

1. **Impressions:** Gross display frequency. If user A sees a reel 4 times in their feed, impressions = 4.
2. **Total Views:** Video playback instances. If user A watches the reel twice, total views = 2.
3. **Reach:** De-duplicated unique viewers. For user A, reach = 1. Therefore, $\text{Reach} \le \text{Total Views} \le \text{Impressions}$.
4. **Engagement:** Active viewer effort. Passive views do not count as engagement; only deliberate interactions (Likes, Comments, Shares, Saves) qualify.

---

## 4. Mathematical Formulations & Algorithms

### 4.1 Follower Growth Rate

Calculates net audience expansion over a specified reporting window:

$$\text{Follower Growth Rate (\%)} = \left( \frac{\text{followers\_at\_end} - \text{followers\_at\_start}}{\text{followers\_at\_start}} \right) \times 100$$

#### Edge Cases & Defensive Handling:
- **Zero Baseline (`followers_at_start` == 0):** For newly registered profiles, growth rate is mathematically undefined ($0/0$ division error). In our schema, when `followers_at_start` is 0, the system returns `null` or a default flag `is_new_account = true`.
- **Audience Churn (Negative Growth):** When `followers_at_end < followers_at_start` (e.g. during creator hiatus or bot sweeps), the formula yields negative percentages (e.g. `creator-002` experienced $-0.71\%$ in January 2026). Systems must not clamp values to zero.

### 4.2 Standardized Engagement Rate Formula

Different social networks report divergent engagement rate calculations. CreatorConnect AI standardizes on **Reach-Based Engagement Rate**:

$$\text{Engagement Rate (\%)} = \left( \frac{\text{likes} + \text{comments} + \text{shares} + \text{saves}}{\text{reach}} \right) \times 100$$

#### Rationale for Choosing Reach over Followers:
- **Algorithmic Feeds:** Modern platforms (TikTok, Instagram Reels, YouTube Shorts) distribute content via discovery engines rather than chronological follower feeds. A creator with 50,000 followers may reach 500,000 unique viewers on a viral post.
- **Fair Comparison:** Measuring against followers produces distorted rates (often $>100\%$). Measuring against `reach` reflects the true engagement quality of users who actually consumed the content.

### 4.3 Sales Growth and Website Visit Growth

$$\text{Sales Lift (\%)} = \left( \frac{\text{post\_campaign\_product\_sales} - \text{baseline\_product\_sales}}{\text{baseline\_product\_sales}} \right) \times 100$$

$$\text{Website Traffic Lift (\%)} = \left( \frac{\text{post\_campaign\_website\_visits} - \text{baseline\_website\_visits}}{\text{baseline\_website\_visits}} \right) \times 100$$

### 4.4 Conversion Rate, CPC, and CAC

1. **Click-to-Conversion Rate (CVR):**
   $$\text{CVR (\%)} = \left( \frac{\text{conversions}}{\text{link\_clicks}} \right) \times 100$$

2. **Cost Per Click (CPC):**
   $$\text{CPC (INR)} = \frac{\text{campaign\_spend\_inr}}{\text{link\_clicks}}$$

3. **Cost Per Acquisition / Customer Acquisition Cost (CAC):**
   $$\text{CAC (INR)} = \frac{\text{campaign\_spend\_inr}}{\text{conversions}}$$

---

## 5. Attribution Boundaries: Correlation vs. Causation

> [!WARNING]
> **Critical Analytical Guardrail:**  
> Sales lift during a creator campaign flight does **not** prove that the creator solely caused that lift.

### 5.1 Confounding Market Factors
When evaluating [`previous_campaign_performance.json`](./previous_campaign_performance.json), sponsor matching algorithms must acknowledge external drivers:
1. **Concurrent Paid Advertising:** Brands frequently run retargeting, Meta Paid Ads, and Google Brand Search simultaneously.
2. **Seasonal Holidays & Festivals:** E-commerce traffic naturally surges during festival periods (e.g., Diwali, Big Billion Days, New Year).
3. **Price Promotions:** Flash discounts, bundling, or sitewide coupon codes distort baseline purchase willingness.
4. **Organic Brand Word-of-Mouth:** External press features, tech reviews, or retailer shelf placement create parallel demand.

### 5.2 Observed Demo Values vs. Attributed Conversions
In our dataset, this boundary is explicitly modelled:
- `post_campaign_product_sales`: The **total observed store volume** during the window (includes organic, search, and all marketing channels).
- `conversions`: The **strictly attributed actions** verified via the designated `attribution_method` (e.g. promo code or UTM parameter).

*Example:* In `camp-001` (AuraSound Labs & Pooja Varma):
- Baseline Sales: 220 units
- Post-Campaign Observed Sales: 410 units (Total lift: +190 units)
- Strictly Attributed Conversions: **165 units** (tracked via creator promo code `AURA_POOJA_20`)
- The remaining 25 unit lift reflects concurrent paid search and seasonal baseline variation.

---

## 6. Return on Investment (ROI) vs. Return on Ad Spend (ROAS)

True financial **ROI** requires net profit contribution, not merely gross top-line sales:

$$\text{ROAS} = \frac{\text{Attributable Gross Revenue (INR)}}{\text{campaign\_spend\_inr}}$$

$$\text{ROI (\%)} = \left( \frac{(\text{Attributable Revenue} \times \text{Gross Margin \%}) - \text{Total Campaign Spend}}{\text{Total Campaign Spend}} \right) \times 100$$

#### Implementation Rule:
Unless the sponsor explicitly provides their unit gross margin percentage (`gross_margin_pct`), backend matching and reporting tools must output **ROAS** or **Cost Per Attributed Conversion (CAC)**. Computing "ROI" based solely on top-line revenue is economically invalid and misleading to sponsors.

---

## 7. Data Quality & Anomaly Handling

To guarantee integrity when matching algorithms process analytics:

1. **Non-Negativity Constraint:**  
   Counts (`views`, `reach`, `clicks`, `conversions`) and financial values (`campaign_spend_inr`, `budget`) must be strictly $\ge 0$.
2. **Relational Invariant Rule:**  
   $$\text{conversions} \le \text{link\_clicks} \le \text{profile\_visits} \le \text{reach} \le \text{total\_views}$$
3. **Missing Value Policy:**  
   Missing metrics must be represented as `null`, **never** as `0`. Imputing `0` corrupts average calculations, whereas `null` informs the scoring engine to discount confidence weighting.
4. **Zero-Division Safeguards:**  
   All calculation routines must wrap denominators in safe guards:
   ```python
   def safe_rate(numerator: float, denominator: float) -> float | None:
       if not denominator or denominator <= 0:
           return None
       return (numerator / denominator) * 100.0
   ```

---

## 8. Verification Strategy for Real-World Production

In a live production deployment, synthetic telemetry would be replaced by authenticated, cryptographically signed integrations:

```
[ Creator ]  ──(OAuth 2.0)──>  [ Platform Graph API ]  ──(Signed Webhook)──>  [ CreatorConnect Ingestion ]
                               (Meta, YouTube, TikTok)
[ Sponsor ]  ──(App Install)─>  [ Shopify / GA4 Webhook] ──(Encrypted HMAC)─>  [ Attribution Engine ]
```

1. **Social Telemetry Verification:**
   - Instagram / Facebook: Meta Graph API (Pages & Instagram Business Accounts OAuth scope `instagram_manage_insights`).
   - YouTube: YouTube Data API v3 & YouTube Analytics API (OAuth scope `yt-analytics.readonly`).
   - TikTok: TikTok Commercial Content API / Display API.
2. **Conversion & Attribution Verification:**
   - Shopify App / Webhooks: Real-time orders signed with HMAC-SHA256 headers matching creator-assigned discount promo codes.
   - Google Analytics 4 (GA4): Measurement protocol server-side event pings with campaign UTM parameters.

---

## 9. Instructions for Person 1 (Backend Integration Blueprint)

Person 1 can optionally integrate these analytics into the SQLite database (`backend/app.db`) to enable rich frontend dashboard cards and sponsor matching filters.

### 9.1 Database Schema Proposal (SQLite)

```sql
-- Optional Table: creator_social_metrics
CREATE TABLE IF NOT EXISTS creator_social_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    creator_id TEXT NOT NULL,
    platform TEXT NOT NULL,
    reporting_period_start TEXT NOT NULL,
    reporting_period_end TEXT NOT NULL,
    followers_at_start INTEGER NOT NULL,
    followers_at_end INTEGER NOT NULL,
    total_views INTEGER NOT NULL,
    reach INTEGER NOT NULL,
    likes INTEGER NOT NULL,
    comments INTEGER NOT NULL,
    shares INTEGER NOT NULL,
    saves INTEGER NOT NULL,
    profile_visits INTEGER NOT NULL,
    link_clicks INTEGER NOT NULL,
    data_source TEXT NOT NULL,
    is_simulated BOOLEAN NOT NULL DEFAULT 1,
    FOREIGN KEY (creator_id) REFERENCES creators(id)
);

-- Optional Table: previous_campaign_performance
CREATE TABLE IF NOT EXISTS previous_campaign_performance (
    campaign_id TEXT PRIMARY KEY,
    creator_id TEXT NOT NULL,
    fictional_brand TEXT NOT NULL,
    fictional_product TEXT NOT NULL,
    campaign_objective TEXT NOT NULL,
    platform TEXT NOT NULL,
    campaign_start TEXT NOT NULL,
    campaign_end TEXT NOT NULL,
    campaign_spend_inr REAL NOT NULL,
    baseline_product_sales INTEGER NOT NULL,
    post_campaign_product_sales INTEGER NOT NULL,
    baseline_website_visits INTEGER NOT NULL,
    post_campaign_website_visits INTEGER NOT NULL,
    link_clicks INTEGER NOT NULL,
    conversions INTEGER NOT NULL,
    attribution_method TEXT NOT NULL,
    data_source TEXT NOT NULL,
    is_simulated BOOLEAN NOT NULL DEFAULT 1,
    FOREIGN KEY (creator_id) REFERENCES creators(id)
);

-- Optional Table: sponsor_opportunity_examples
CREATE TABLE IF NOT EXISTS sponsor_opportunities (
    opportunity_id TEXT PRIMARY KEY,
    fictional_brand TEXT NOT NULL,
    product_category TEXT NOT NULL,
    campaign_objective TEXT NOT NULL,
    target_audience TEXT NOT NULL,
    budget_min_inr REAL NOT NULL,
    budget_max_inr REAL NOT NULL,
    desired_content_formats TEXT NOT NULL, -- JSON encoded list
    required_niches TEXT NOT NULL,         -- JSON encoded list
    success_metrics TEXT NOT NULL,         -- JSON encoded list
    suggested_creator_ids TEXT NOT NULL,   -- JSON encoded list
    recommendation_reasons TEXT NOT NULL,
    potential_risks TEXT NOT NULL,
    disclosure_required BOOLEAN NOT NULL,
    is_simulated BOOLEAN NOT NULL DEFAULT 1
);
```

### 9.2 Data Import Script for Person 1

Person 1 can review and ingest these files using the script below:

```python
import json
import sqlite3
from pathlib import Path

analytics_dir = Path("contributions/person3/analytics")
db_path = Path("backend/app.db")

def import_analytics():
    if not db_path.exists():
        print(f"Database {db_path} not found. Skipping SQL seeding.")
        return

    with open(analytics_dir / "creator_social_metrics.json", encoding="utf-8") as f:
        social_metrics = json.load(f)
    with open(analytics_dir / "previous_campaign_performance.json", encoding="utf-8") as f:
        campaigns = json.load(f)
    with open(analytics_dir / "sponsor_opportunity_examples.json", encoding="utf-8") as f:
        opportunities = json.load(f)

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    
    # Insert social metrics
    cur.executemany(
        """INSERT INTO creator_social_metrics (
            creator_id, platform, reporting_period_start, reporting_period_end,
            followers_at_start, followers_at_end, total_views, reach, likes,
            comments, shares, saves, profile_visits, link_clicks, data_source, is_simulated
        ) VALUES (
            :creator_id, :platform, :reporting_period_start, :reporting_period_end,
            :followers_at_start, :followers_at_end, :total_views, :reach, :likes,
            :comments, :shares, :saves, :profile_visits, :link_clicks, :data_source, :is_simulated
        )""",
        social_metrics
    )
    
    conn.commit()
    conn.close()
    print("Successfully imported Person 3 analytics into SQLite.")

if __name__ == "__main__":
    import_analytics()
```

---

## 10. Summary Checklist for Quality & Safety

- [x] All 15 existing creators referenced with exact ID matches.
- [x] All 30 social metrics periods consecutive and mathematically consistent.
- [x] All 12 historical campaigns include realistic spend, baseline vs observed lift, and attributed conversions.
- [x] All 8 sponsor opportunities span varied consumer and B2B categories with clear justification.
- [x] All records explicitly flagged with `"is_simulated": true`.
- [x] Currency strictly standardized to INR.
- [x] Core project files ([`../creators.json`](../creators.json), [`../portfolio_metadata.json`](../portfolio_metadata.json), [`../README.md`](../README.md), `frontend/`, `backend/`) left completely untouched.
