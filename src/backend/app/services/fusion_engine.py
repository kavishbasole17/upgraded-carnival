from typing import Dict, Any

def fuse(rule_score: int, llm_score: int) -> Dict[str, Any]:
    final = (0.6 * rule_score) + (0.4 * llm_score)
    final_int = int(final)

    if final_int >= 80:
        p = 'EXTREME'
    elif final_int >= 60:
        p = 'STRONG'
    elif final_int >= 40:
        p = 'MEDIUM'
    else:
        p = 'LOW'

    return {
        "final_score": final_int,
        "priority": p
    }
