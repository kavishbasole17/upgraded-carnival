import re
from typing import Dict, Any

KEYWORDS = {
    "emergency": 30,
    "hospital": 35,
    "medicine": 25,
    "urgent": 20,
    "water": 15
}

VULNERABLE = {
    "elderly": 25,
    "child": 35,
    "infant": 70,
    "pregnant": 75,
    "disabled": 40,
    "injured": 35
}

def rule_score(text: str) -> Dict[str, Any]:
    text = text.lower()
    score = 0
    reasons = []

    for k, v in KEYWORDS.items():
        if k in text:
            score += v
            reasons.append(k)

    for k, v in VULNERABLE.items():
        if k in text:
            score += v
            reasons.append(k)

    nums = re.findall(r'\d+', text)
    if nums:
        people = int(nums[0])
        if people >= 50:
            score += 30
        elif people >= 10:
            score += 20

    return {
      "score": min(score, 100),
      "reasons": reasons
    }
