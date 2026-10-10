# CreatorConnect AI

An AI-powered marketplace connecting brands with AI content creators.  
Built for a 24-hour hackathon by **Team NIGHTFALL**.

---

## Team Ownership

| Person | Role | Owns |
|---|---|---|
| **P1** — Team Lead | Backend + AI | `backend/`, root config, shared contracts |
| **P2** — Frontend | UI / UX | `frontend/` |
| **P3** — Creator Data | Content | `contributions/person3/` only |
| **P4** — QA + Demo | Testing + Presentation | `contributions/person4/` only |

> P3 and P4 must never edit files inside `backend/` or `frontend/`.

---

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS v3
- **Backend:** Python 3.11+ + Flask + SQLAlchemy + SQLite
- **AI:** Google Gemini via `google-genai` SDK (deterministic mock available)

---

## Quick Start (Windows PowerShell)

### 1 — Clone and configure

```powershell
git clone https://github.com/Bhuvantej123/Team-NIGHTFALL.git
cd Team-NIGHTFALL
Copy-Item .env.example .env
# Edit .env — set GEMINI_API_KEY and GEMINI_MODEL (see step 2)
```

### 2 — Discover your Gemini model name

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
cd ..
$env:PYTHONPATH = $PWD.Path
python backend/scripts/list_gemini_models.py
# Copy a model name to GEMINI_MODEL in .env
# Leave GEMINI_MODEL empty to run in mock mode — the app still works.
```

### 3 — Seed the database and start the backend

```powershell
# From project root, venv active
python backend/seed/seed.py
$env:FLASK_APP = "backend/app.py"
$env:FLASK_ENV  = "development"
flask run --port 5000
# Backend: http://localhost:5000/api/health
```

### 4 — Start the frontend (separate terminal)

```powershell
cd frontend
npm install
npm run dev
# Frontend: http://localhost:5173
```

---

## Running Tests

```powershell
# From project root, venv active
pytest backend/tests/ -v
```

---

## Project Structure

```
Team-NIGHTFALL/
├── backend/          # P1 — Flask API, services, Gemini integration
├── frontend/         # P2 — React + TypeScript + Vite + Tailwind
├── contributions/
│   ├── person3/      # P3 — Creator data, portfolio assets
│   └── person4/      # P4 — QA checklist, demo script, slides
└── docs/             # P1 — Architecture and API reference
```

---

## API

Base URL: `http://localhost:5000/api`

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Server + Gemini status |
| `GET` | `/creators` | List / search creators |
| `GET` | `/creators/:id` | Single creator profile |
| `POST` | `/campaigns` | Create campaign |
| `GET` | `/campaigns` | List campaigns |
| `GET` | `/campaigns/:id` | Campaign + workflow |
| `PATCH` | `/campaigns/:id` | Update brief fields |
| `POST` | `/campaigns/:id/generate-brief` | Generate brief via Gemini |
| `POST` | `/campaigns/:id/match` | Run matching engine |
| `GET` | `/campaigns/:id/matches` | Retrieve saved match results |
| `POST` | `/campaigns/:id/shortlist` | Add creator to shortlist |
| `DELETE` | `/campaigns/:id/shortlist/:creator_id` | Remove from shortlist |
| `PATCH` | `/campaigns/:id/status` | Update workflow status |
