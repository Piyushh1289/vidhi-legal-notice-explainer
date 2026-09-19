import re


def check_authenticity(notice_text: str) -> dict:
    """A simple rule-based first pass at flagging suspicious notices.

    This is NOT a definitive fraud detector - it surfaces red flags a
    human should look at. Keep the language honest about that.
    """
    text_lower = notice_text.lower()
    flags = []

    # Common scam pressure tactics
    urgency_phrases = ["pay immediately", "within 24 hours", "arrest warrant",
                        "your account will be frozen", "act now", "final warning"]
    if any(phrase in text_lower for phrase in urgency_phrases):
        flags.append("Uses high-pressure urgency language, common in scam notices.")

    # Requests for payment via unusual channels
    if re.search(r"\b(upi|paytm|google pay|gpay)\b", text_lower) and \
       re.search(r"\b(fine|penalty|fee|court)\b", text_lower):
        flags.append("Asks for a fine/penalty payment via personal UPI/wallet apps - "
                      "genuine courts and government bodies do not collect fines this way.")

    # Missing structural elements a genuine notice usually has
    has_reference_number = bool(re.search(r"(ref(erence)?\.?\s*no\.?|case no\.?|c\.c\.\s*no\.?)", text_lower))
    if not has_reference_number:
        flags.append("No case/reference number found - genuine legal notices usually cite one.")

    has_sender_details = bool(re.search(r"(advocate|counsel|court|commission|bank|police station)", text_lower))
    if not has_sender_details:
        flags.append("No clear sender authority (advocate, court, bank, police station) identified.")

    if not flags:
        verdict = "no_red_flags"
    elif len(flags) <= 1:
        verdict = "minor_concerns"
    else:
        verdict = "suspicious"

    return {
        "verdict": verdict,
        "flags": flags,
        "disclaimer": "This is an automated first-pass check based on common patterns, "
                       "not a guarantee. When in doubt, verify with the issuing authority directly."
    }
