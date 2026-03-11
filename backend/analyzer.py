import json
import re
import os

# Load skills database
BASE_DIR = os.path.dirname(__file__)
with open(os.path.join(BASE_DIR, "skills_db.json"), "r") as f:
    SKILLS_DB = json.load(f)

# Synonym normalization map
SYNONYMS = {
    "js": "javascript", "ts": "typescript", "py": "python",
    "node": "nodejs", "node.js": "nodejs", "next.js": "nextjs",
    "vue.js": "vue", "react.js": "react", "angular.js": "angular",
    "ml": "machine learning", "ai": "machine learning", "dl": "deep learning",
    "k8s": "kubernetes", "gke": "kubernetes", "ecs": "aws",
    "postgres": "postgresql", "mongo": "mongodb", "dynamo": "dynamodb",
    "tf": "tensorflow", "sk-learn": "scikit-learn", "sklearn": "scikit-learn",
    "ci/cd": "ci/cd", "devops": "devops", "rest api": "rest",
    "restful": "rest", "graphql api": "graphql",
    "html5": "html", "css3": "css", "sass/scss": "sass",
    "c++": "c++", "cpp": "c++", "c#": "c#", "csharp": "c#",
    "react native": "react native", "rn": "react native",
    "power bi": "power bi", "powerbi": "power bi",
    "tableau": "tableau", "excel": "excel",
    "git": "git", "github": "git", "gitlab": "git",
    "linux": "linux", "ubuntu": "linux", "unix": "linux",
    "aws lambda": "aws", "s3": "aws", "ec2": "aws",
    "azure devops": "azure", "gcp": "gcp", "google cloud": "gcp",
}

# Flat skill list for matching
ALL_SKILLS = {}
for category, skills in SKILLS_DB.items():
    for skill in skills:
        ALL_SKILLS[skill.lower()] = category


def normalize_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^\w\s\+\#\./]', ' ', text)
    return text


def normalize_skill(skill: str) -> str:
    skill = skill.lower().strip()
    return SYNONYMS.get(skill, skill)


def extract_skills(text: str) -> dict:
    """Extract skills from text and return with categories."""
    normalized = normalize_text(text)
    found = {}

    # Multi-word skills first (longer matches take priority)
    sorted_skills = sorted(ALL_SKILLS.keys(), key=len, reverse=True)

    for skill in sorted_skills:
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, normalized):
            norm = normalize_skill(skill)
            category = ALL_SKILLS.get(norm, ALL_SKILLS.get(skill, "Other"))
            found[norm] = category

    return found  # {skill_name: category}


def analyze_gap(resume_text: str, jd_text: str) -> dict:
    """Full gap analysis between resume and job description."""
    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(jd_text)

    resume_set = set(resume_skills.keys())
    jd_set = set(jd_skills.keys())

    matched = resume_set & jd_set
    missing = jd_set - resume_set
    extra = resume_set - jd_set

    match_score = round((len(matched) / len(jd_set) * 100) if jd_set else 0, 1)

    # Assign tiers to missing skills
    def assign_tier(skill):
        cat = jd_skills.get(skill, "")
        if cat in ["Programming Languages", "Data & AI/ML", "DevOps & Cloud"]:
            return "Critical"
        elif cat in ["Web Development", "Databases", "Mobile Development"]:
            return "Good-to-Have"
        else:
            return "Optional"

    missing_with_tiers = [
        {"skill": s, "tier": assign_tier(s), "category": jd_skills.get(s, "Other")}
        for s in missing
    ]
    # Sort: Critical first
    tier_order = {"Critical": 0, "Good-to-Have": 1, "Optional": 2}
    missing_with_tiers.sort(key=lambda x: tier_order[x["tier"]])

    # Category breakdown
    category_breakdown = {}
    for skill, cat in resume_skills.items():
        category_breakdown[cat] = category_breakdown.get(cat, 0) + 1

    return {
        "match_score": match_score,
        "matched_skills": sorted(list(matched)),
        "missing_skills": missing_with_tiers,
        "extra_skills": sorted(list(extra)),
        "resume_skill_count": len(resume_set),
        "jd_skill_count": len(jd_set),
        "category_breakdown": category_breakdown,
        "resume_skills_by_category": {
            cat: [s for s, c in resume_skills.items() if c == cat]
            for cat in set(resume_skills.values())
        }
    }