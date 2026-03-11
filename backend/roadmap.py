import json
import os

BASE_DIR = os.path.dirname(__file__)
with open(os.path.join(BASE_DIR, "roadmap_cache.json"), "r") as f:
    ROADMAP_CACHE = json.load(f)


def get_roadmap(missing_skills: list) -> list:
    """Return cached roadmaps for missing skills."""
    roadmaps = []
    for item in missing_skills:
        skill_name = item["skill"].lower()
        if skill_name in ROADMAP_CACHE:
            entry = ROADMAP_CACHE[skill_name].copy()
            entry["tier"] = item["tier"]
            roadmaps.append(entry)
        else:
            # Generic fallback
            roadmaps.append({
                "skill": item["skill"].title(),
                "tier": item["tier"],
                "estimated_hours": 15,
                "weeks": [
                    {
                        "week": 1,
                        "focus": f"Learn {item['skill'].title()} Fundamentals",
                        "resources": [
                            {
                                "title": f"Search '{item['skill']} tutorial' on YouTube",
                                "url": f"https://www.youtube.com/results?search_query={item['skill'].replace(' ', '+')}+tutorial",
                                "type": "video"
                            },
                            {
                                "title": f"{item['skill'].title()} on freeCodeCamp",
                                "url": f"https://www.freecodecamp.org/news/search/?query={item['skill'].replace(' ', '+')}",
                                "type": "docs"
                            }
                        ],
                        "mini_project": f"Build a small project using {item['skill'].title()}"
                    }
                ]
            })
    return roadmaps