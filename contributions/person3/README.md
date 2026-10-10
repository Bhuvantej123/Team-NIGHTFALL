# CreatorConnect AI — Person 3 Deliverables: Creator Dataset & Portfolio Metadata

**Contributor:** Person 3  
**Deliverables Location:** `contributions/person3/`  
**Target Integration Owner:** Person 1 (Backend & Database Architecture)  

---

## 1. Purpose of the Dataset

This dataset provides 15 rich, fictional AI content creator profiles (`creators.json`) and 43 corresponding portfolio project metadata entries (`portfolio_metadata.json`) for the **CreatorConnect AI** platform.

### Objectives:
- **Demonstration & Testing:** Enable realistic multi-parameter matching scenarios (skills, niches, styles, platforms, budgets, availability) for the hackathon demo.
- **Edge Case Simulation:** Equip Person 1 (matching engine) and Person 4 (QA / demo scripts) with clear test cases, including:
  - Unavailable creators (`availability: false`) to test availability filtering and UI warning badges.
  - Premium over-budget creators (e.g. ₹180,000 and ₹220,000) to test budget constraint checks and UI "Over budget" badges.
  - Affordable entry-level creators (e.g. ₹12,000 and ₹15,000) to test low-budget campaign matching.
- **Strict Data Fictionality:** In accordance with team and project safety guidelines, all creators, names, bios, handles, project titles, and descriptions are completely fictional. No real-world client brands, follower counts, audience analytics, endorsements, or performance metrics are invented.

---

## 2. Dataset Files Overview

| File | Description | Record Count |
|---|---|---|
| [`creators.json`](./creators.json) | 15 comprehensive fictional AI creator profiles | 15 creators |
| [`portfolio_metadata.json`](./portfolio_metadata.json) | Detailed metadata for individual creative works | 43 portfolio items |
| [`README.md`](./README.md) | Schema specification, data dictionary, and integration guide | This document |

---

## 3. Schema & Field Meanings

### 3.1 `creators.json` Schema

Each creator object contains:

| Field | Type | Description | Example |
|---|---|---|---|
| `id` | `string` | Unique identifier for the creator | `"creator-001"` |
| `display_name` | `string` | Public display name of the creator | `"Aarav Sharma"` |
| `handle` | `string` | Unique username / social handle | `"@aarav_cinematic"` |
| `headline` | `string` | Professional positioning summary | `"Cinematic AI Filmmaker & Generative Director"` |
| `bio` | `string` | Fictional 2–3 sentence background summary | `"Visual storyteller crafting cinematic sci-fi trailers..."` |
| `skills` | `string[]` | Specific creative & technical competencies | `["Generative Video Direction", "Color Grading"]` |
| `ai_tools` | `string[]` | Generative AI software & models utilized | `["Runway Gen-3", "Midjourney v6", "Kling AI"]` |
| `niches` | `string[]` | Industry domains and subject matter specializations | `["Cinematic AI videos", "Sci-Fi & Speculative Fiction"]` |
| `platforms` | `object[]` | Social media platform profiles (`name`, `handle`, `url`) | `[{"name": "youtube", "handle": "@aarav_cinematic", "url": "..."}]` |
| `portfolio_items` | `string[]` | Array of foreign keys referencing `portfolio_metadata.json` `id`s | `["portfolio-001", "portfolio-002", "portfolio-003"]` |
| `style_tags` | `string[]` | Aesthetic descriptors used by matching algorithms | `["cinematic", "moody", "photorealistic"]` |
| `starting_price` | `number` | Minimum starting rate per campaign (non-negative number) | `45000` |
| `currency` | `string` | Currency code for rates (standardized to `"INR"`) | `"INR"` |
| `availability` | `boolean` | Current booking status (`true` = available, `false` = unavailable) | `true` |
| `portfolio_evidence` | `string` | Short qualitative summary of portfolio strengths | `"Extensive experience delivering high-fidelity..."` |
| `created_at` | `string` | ISO 8601 creation timestamp | `"2026-02-10T10:00:00Z"` |

### 3.2 `portfolio_metadata.json` Schema

Each portfolio entry contains:

| Field | Type | Description | Example |
|---|---|---|---|
| `id` | `string` | Unique portfolio item identifier | `"portfolio-001"` |
| `creator_id` | `string` | Foreign key referencing the creator's `id` | `"creator-001"` |
| `title` | `string` | Fictional project or campaign title | `"Chrono Drift: Sci-Fi Teaser Trailer"` |
| `description` | `string` | Creative summary describing the visual work | `"A 45-second cinematic teaser featuring time-dilated..."` |
| `content_type` | `string` | Media format/type (e.g. `cinematic_video`, `short_form_reel`, `product_commercial`) | `"cinematic_video"` |
| `tags` | `string[]` | Topic tags and thematic keywords | `["sci-fi", "space", "teaser-trailer"]` |
| `style_tags` | `string[]` | Aesthetic styling tags matching the piece | `["cinematic", "photorealistic", "widescreen"]` |
| `image_reference` | `string` | Relative path to mockup or rendered asset image | `"portfolio_assets/creator_001_chrono_drift.webp"` |

---

## 4. Availability Values & Test Scenarios

The dataset uses boolean availability values:
- `true` (10 creators): Creator is actively accepting briefs and available for booking.
- `false` (5 creators): Creator is currently booked, on hiatus, or under exclusivity contracts.

### Distribution of Creators:
- **Available (`true`):** `creator-001`, `creator-003`, `creator-004`, `creator-006`, `creator-007`, `creator-009`, `creator-010`, `creator-012`, `creator-013`, `creator-015`
- **Unavailable (`false`):** `creator-002`, `creator-005`, `creator-008`, `creator-011`, `creator-014`

This gives the team a 66.7% / 33.3% split to test matching score penalties and Amber badge UI rendering for unavailable creators.

---

## 5. Specialties & Pricing Distribution

The 15 creators cover all 8 required project specialties:

1. **AI Product Advertisements:**
   - `creator-002`: Pooja Varma (₹30,000, unavailable) — 3D e-commerce ads & packshots
   - `creator-009`: Aditya Singhania (₹180,000, available) — Premium hardware reveal CGI commercials *(Over-budget test case)*
2. **Cinematic AI Videos:**
   - `creator-001`: Aarav Sharma (₹45,000, available) — Sci-fi trailers & cinematic video
   - `creator-011`: Tenzin Norbu (₹60,000, unavailable) — Speculative nature & deep-sea documentaries
3. **Fashion & Beauty:**
   - `creator-003`: Meera Sen (₹25,000, available) — Digital couture & editorial lookbooks
   - `creator-010`: Zara D'Souza (₹220,000, available) — Haute couture luxury perfume campaigns *(Over-budget test case)*
4. **Food Content:**
   - `creator-004`: Rohan Kulkarni (₹18,000, available) — Slow-motion food physics & gastronomy
   - `creator-013`: Karthik Menon (₹28,000, available) — High-speed beverage splash dynamics
5. **Gaming:**
   - `creator-005`: Vikram 'Vex' Nair (₹50,000, unavailable) — Cyberpunk game trailers & esports motion
6. **Animation:**
   - `creator-006`: Ananya Roy (₹35,000, available) — Stylized 2D/3D anime character animation
   - `creator-014`: Devika Rao (₹40,000, unavailable) — Motion comics & ink-wash graphic novels
7. **Social Media Reels:**
   - `creator-007`: Kabir Malhotra (₹12,000, available) — High-retention viral vertical reels
   - `creator-012`: Isha Patel (₹15,000, available) — Travel & hospitality lifestyle reels
8. **Educational Content:**
   - `creator-008`: Dr. Shalini Gupta (₹22,000, unavailable) — Astrophysics & historical reconstructions
   - `creator-015`: Tanvi Joshi (₹32,000, available) — Biomedical & healthcare 3D visual explainers

---

## 6. Relationship Between Creators and Portfolio Entries

There is a bidirectional relational structure:
- **Parent to Children:** Each creator in `creators.json` lists its child IDs in `portfolio_items` (2 to 4 items per creator, total 43 items).
- **Child to Parent:** Each item in `portfolio_metadata.json` specifies `creator_id`, referencing back to its parent creator.
- **Referential Integrity:** 100% of creator `portfolio_items` exist in `portfolio_metadata.json`, and 100% of portfolio `creator_id`s exist in `creators.json`.

---

## 7. Instructions for Person 1 (Backend & Database Integration)

> [!IMPORTANT]
> **Check Backend Contracts Before Merging**  
> Before loading this dataset into the database (`backend/seed/creators.json` and SQLite `CreatorModel`), Person 1 must verify the proposed schema against the team's final canonical backend contracts (`backend/contracts/creator.py`).

### Normalization Options for Person 1

The backend `CreatorModel` (`backend/models/creator_model.py`) expects `portfolio_items` to contain an embedded JSON list of `PortfolioItem` objects.

Person 1 can combine `creators.json` and `portfolio_metadata.json` into the target `backend/seed/creators.json` with the following Python snippet:

```python
import json
from pathlib import Path

# Paths
p3_dir = Path("contributions/person3")
seed_out = Path("backend/seed/creators.json")

# Load Person 3 datasets
with open(p3_dir / "creators.json", encoding="utf-8") as f:
    creators = json.load(f)

with open(p3_dir / "portfolio_metadata.json", encoding="utf-8") as f:
    portfolio = json.load(f)

# Index portfolio items by ID
portfolio_by_id = {item["id"]: item for item in portfolio}

# Normalize creators: embed full PortfolioItem objects
normalized_creators = []
for c in creators:
    c_copy = dict(c)
    # Map portfolio ID strings to full objects expected by CreatorProfile
    c_copy["portfolio_items"] = [
        {
            "id": pid,
            "title": portfolio_by_id[pid]["title"],
            "description": portfolio_by_id[pid]["description"],
            "platform": c_copy["platforms"][0]["name"] if c_copy["platforms"] else "youtube",
            "content_url": None,
            "thumbnail_url": portfolio_by_id[pid].get("image_reference"),
            "tags": portfolio_by_id[pid]["tags"],
        }
        for pid in c["portfolio_items"]
        if pid in portfolio_by_id
    ]
    normalized_creators.append(c_copy)

# Save to backend seed
seed_out.parent.mkdir(parents=True, exist_ok=True)
with open(seed_out, "w", encoding="utf-8") as f:
    json.dump(normalized_creators, f, indent=2)

print(f"Successfully normalized {len(normalized_creators)} creators into {seed_out}")
```

Once saved, Person 1 can run:
```bash
python backend/seed/seed.py
```
to populate the SQLite database.
