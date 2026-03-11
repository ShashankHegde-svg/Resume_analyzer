# ✦ CareerLens AI
### "Don't just find the gap. Bridge it."

A Resume Intelligence Platform that analyzes your resume against any job description, scores your match, identifies skill gaps, and generates a personalized 30-day learning roadmap — **completely free to run, no API key needed.**

---

## 🗂️ File & Folder Structure

```
careerlens/
│
├── backend/
│   ├── main.py              ← FastAPI app (4 routes)
│   ├── analyzer.py          ← Skill extractor + gap analyzer
│   ├── roadmap.py           ← Roadmap generator (offline cache)
│   ├── skills_db.json       ← 500+ skills across 9 categories
│   ├── roadmap_cache.json   ← Pre-built roadmaps for 8 key skills
│   └── requirements.txt     ← Python dependencies
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── App.jsx                        ← Root component
        ├── index.css                      ← Global space theme styles
        ├── main.jsx                       ← React entry
        └── components/
            ├── StarBackground.jsx         ← Animated canvas stars
            ├── UploadScreen.jsx           ← Upload + demo screen
            ├── Dashboard.jsx              ← Full results dashboard
            └── MatchScoreRing.jsx         ← Animated score ring
```

---

## ⚡ Quick Start

### 1. Backend Setup
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Download spaCy model (optional — not used in basic version)
# python -m spacy download en_core_web_sm

# Run the API
uvicorn main:app --reload
# → Running at http://localhost:8000
```

### 2. Frontend Setup
```bash
cd frontend

# Install packages
npm install

# Start dev server
npm run dev
# → Running at http://localhost:5173
```

### 3. Open in Browser
Go to **http://localhost:5173**

No API key required. The app works fully offline using the cached roadmap data.

---

## 🔑 Optional: Enable AI Roadmaps

To use Claude AI for dynamic roadmap generation:

1. Get a free API key at https://console.anthropic.com
2. Create a `.env` file in `/backend`:
```
ANTHROPIC_API_KEY=your_key_here
```
3. Update `roadmap.py` to call the Anthropic API

---

## 🎮 Features

| Feature | Description |
|---|---|
| 📄 PDF Upload | Drag & drop resume PDF |
| ✏️ Text Paste | Paste resume text as fallback |
| 🎯 Match Score | Animated % score with color coding |
| ❌ Skill Gap Detection | Critical / Good-to-Have / Optional tiers |
| ✅ Matched Skills | Skills you already have |
| ➕ Bonus Skills | Skills you have beyond what's required |
| 🗺️ Learning Roadmap | Week-by-week plan with free resources |
| 📊 Charts | Bar + Radar charts by skill category |
| 🧪 Demo Personas | 3 preloaded test cases |

---

## 🌍 API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/analyze/upload` | Analyze PDF resume |
| POST | `/analyze/text` | Analyze pasted resume text |
| GET | `/demo/{persona}` | Load demo: fresher / midlevel / switcher |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Pure CSS (space theme) |
| Charts | Recharts |
| Backend | FastAPI (Python) |
| PDF Parsing | pdfplumber |
| Skills Matching | Keyword matching + synonym dict |
| Roadmaps | Offline cache (JSON) |

---

## 🌍 SDG Alignment

- **SDG 4** — Quality Education: Free learning roadmaps with curated resources
- **SDG 8** — Decent Work & Economic Growth: Bridges the employment skill gap
- **SDG 9** — Industry, Innovation & Infrastructure: AI-powered career tooling

---

*Built for hackathons. Ready for production.*
