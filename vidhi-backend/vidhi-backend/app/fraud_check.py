import re


def check_authenticity(notice_text: str) -> dict:
    """First-pass screening for common scam warning signs.
    Not a guarantee that a notice is genuine."""
    text_lower = notice_text.lower()
    flags = []

    urgency_phrases = ["pay immediately", "within 24 hours", "arrest warrant",
                       "your account will be frozen", "act now", "final warning"]
    if any(phrase in text_lower for phrase in urgency_phrases):
        flags.append("Uses high-pressure urgency language, common in scam notices.")

    if re.search(r"\b(upi|paytm|google pay|gpay)\b", text_lower) and \
       re.search(r"\b(fine|penalty|fee|court)\b", text_lower):
        flags.append("Asks for a fine or penalty through a personal UPI or wallet app. "
                     "Courts and government bodies do not collect fines this way.")

    # A case number is only expected on court documents, not on advocate demand notices.
    is_court_doc = bool(re.search(r"(in the court|court of|summons|hon.ble)", text_lower))
    has_case_number = bool(re.search(
        r"(case\s*no|ref(erence)?\.?\s*no|c\.?\s*c\.?\s*no|s\.?\s*t\.?\s*c\.?\s*no|\bno\.?\s*\d+\s*/\s*\d{4})",
        text_lower))
    if is_court_doc and not has_case_number:
        flags.append("This looks like a court notice but shows no case number. "
                     "Check the case on the eCourts website before acting.")

    has_sender = bool(re.search(r"(advocate|counsel|court|commission|bank|police station)", text_lower))
    if not has_sender:
        flags.append("No clear sender (advocate, court, bank, police station) identified.")

    if not flags:
        verdict = "no_red_flags"
    elif len(flags) == 1:
        verdict = "minor_concerns"
    else:
        verdict = "suspicious"

    return {
        "verdict": verdict,
        "flags": flags,
        "disclaimer": "Automated first-pass check based on common patterns, not a guarantee. "
                      "When in doubt, verify with the issuing authority directly.",
    }