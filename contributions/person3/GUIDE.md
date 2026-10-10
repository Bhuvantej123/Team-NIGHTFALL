# contributions/person3/GUIDE.md
# Creator Dataset Guide
**Owner: Person 3**

## Purpose
This folder contains fictional creator profiles and portfolio assets for the CreatorConnect AI demo.

## Rules
- You may ONLY edit files in `contributions/person3/`.
- Do NOT edit any files in `frontend/` or `backend/`.
- Do NOT modify shared contracts, configuration, or application source code.
- To request a contract change, message P1 with a clear description — P1 will implement it.

## Your Deliverables
1. `creators_raw.json` — 12–20 fictional creator profiles (see schema below)
2. `portfolio_assets/` — images or media (free/licensed assets, or AI-generated)
3. `data_validation_notes.md` — list any missing fields, duplicates, or inconsistencies

## CreatorProfile Schema (required fields)

Each creator entry in `creators_raw.json` must include:

```json
{
  "id": "unique-uuid-string",
  "display_name": "Creator Name",
  "handle": "@unique_handle",
  "bio": "Short bio (2-3 sentences)",
  "skills": ["video editing", "copywriting"],
  "ai_tools": ["Midjourney", "ElevenLabs"],
  "niches": ["tech", "lifestyle"],
  "platforms": [
    {
      "name": "instagram",
      "handle": "@handle",
      "url": "https://instagram.com/handle",
      "follower_count": 45000
    }
  ],
  "portfolio_items": [
    {
      "id": "item-uuid",
      "title": "Product Unboxing Review",
      "description": "Tech unboxing with AI voiceover",
      "platform": "youtube",
      "content_url": null,
      "thumbnail_url": null,
      "tags": ["unboxing", "tech-review", "AI-voiceover"]
    }
  ],
  "style_tags": ["educational", "minimalist"],
  "starting_price": 800,
  "currency": "USD",
  "availability": true,
  "portfolio_evidence": "Strong portfolio in tech reviews with AI tools.",
  "created_at": "2026-01-15T00:00:00Z"
}
```

## Important Notes
- All data is **fictional demo data**. Label it as such.
- follower_count values are **not verified statistics** — they are illustrative only.
- Include varied niches, skills, AI tools, styles, price points and availability.
- Include at least 3–4 unavailable creators and 2–3 over-priced creators to make matching interesting.
- P1 will review your JSON and normalise it into `backend/seed/creators.json`.
