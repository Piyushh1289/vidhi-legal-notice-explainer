SERIOUS_CASE_KEYWORDS = [
    "imprisonment", "criminal", "arrest", "magistrate", "prosecution",
    "punishable", "offence", "penalty",
]


def check_legal_aid_needed(relevant_statutes: list, explanation: str) -> dict | None:
    """Checks whether the case looks serious enough to point the user to
    NALSA's free legal aid helpline. Rule-based, not exhaustive.
    """
    combined_text = explanation.lower() + " " + " ".join(
        s.get("text", "") for s in relevant_statutes
    ).lower()

    if any(keyword in combined_text for keyword in SERIOUS_CASE_KEYWORDS):
        return {
            "helpline": "15100",
            "helpline_note": "Toll-free, 24x7. Press 1 for a lawyer, Press 2 for legal advice.",
            "website": "https://nalsa.gov.in",
            "note": "This case involves a potential criminal or serious legal consequence. "
                    "Free legal aid is available through NALSA (National Legal Services Authority) "
                    "if you cannot afford a lawyer.",
        }
    return None
