from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pdfplumber
import io

from analyzer import analyze_gap
from roadmap import get_roadmap

app = FastAPI(title="CareerLens AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Demo Personas ────────────────────────────────────────────────────────────
DEMO_PERSONAS = {
    "fresher": {
        "resume_text": """
        Education: B.Tech Computer Science 2024
        Skills: Python, HTML, CSS, JavaScript, Git, Problem Solving, Communication
        Projects: Portfolio website using HTML CSS JS, Python calculator script
        """,
        "jd_text": """
        Junior Full Stack Developer
        Required: React, Node.js, SQL, Docker, REST API, JavaScript, Git, PostgreSQL, TypeScript
        Nice to have: AWS, Redis, CI/CD, MongoDB
        """
    },
    "midlevel": {
        "resume_text": """
        5 years experience as Backend Developer
        Skills: Python, Django, PostgreSQL, Git, REST API, Linux, Redis, Celery
        Worked on: Microservices, API design, Database optimization
        """,
        "jd_text": """
        Senior Backend Engineer
        Required: Docker, Kubernetes, AWS, Python, PostgreSQL, Redis, CI/CD, Microservices
        Nice to have: Terraform, Prometheus, Grafana, Elasticsearch
        """
    },
    "switcher": {
        "resume_text": """
        5 years as Business Analyst
        Skills: Excel, PowerPoint, SQL basics, Communication, Project Management, Scrum, Jira
        Experience: Stakeholder management, requirements gathering, reporting
        """,
        "jd_text": """
        Data Analyst
        Required: Python, Pandas, SQL, Tableau, Machine Learning, Statistics, Data Analysis
        Nice to have: Power BI, NumPy, Matplotlib, Scikit-learn, Spark
        """
    }
}


# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "service": "CareerLens AI"}


@app.post("/analyze/upload")
async def analyze_upload(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    """Analyze resume from PDF upload."""
    if not resume.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files supported.")

    contents = await resume.read()
    try:
        with pdfplumber.open(io.BytesIO(contents)) as pdf:
            resume_text = " ".join(
                page.extract_text() or "" for page in pdf.pages
            )
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not parse PDF: {str(e)}")

    if not resume_text.strip():
        raise HTTPException(status_code=422, detail="Could not extract text from PDF. Try pasting your resume instead.")

    analysis = analyze_gap(resume_text, job_description)
    roadmaps = get_roadmap(analysis["missing_skills"][:6])  # top 6 gaps

    return {"analysis": analysis, "roadmaps": roadmaps}


@app.post("/analyze/text")
async def analyze_text(data: dict):
    """Analyze resume from pasted text."""
    resume_text = data.get("resume_text", "")
    jd_text = data.get("job_description", "")

    if not resume_text.strip() or not jd_text.strip():
        raise HTTPException(status_code=400, detail="Both resume text and job description are required.")

    analysis = analyze_gap(resume_text, jd_text)
    roadmaps = get_roadmap(analysis["missing_skills"][:6])

    return {"analysis": analysis, "roadmaps": roadmaps}


@app.get("/demo/{persona}")
def demo_persona(persona: str):
    """Return preloaded demo analysis for a persona."""
    if persona not in DEMO_PERSONAS:
        raise HTTPException(status_code=404, detail="Persona not found. Use: fresher, midlevel, switcher")

    p = DEMO_PERSONAS[persona]
    analysis = analyze_gap(p["resume_text"], p["jd_text"])
    roadmaps = get_roadmap(analysis["missing_skills"][:6])

    return {"analysis": analysis, "roadmaps": roadmaps}