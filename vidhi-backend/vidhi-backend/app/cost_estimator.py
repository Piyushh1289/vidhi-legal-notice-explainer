# Rough cost ranges sourced from published lawyer-fee guides and NCDRC/DCDRC
# fee schedules. These vary significantly by city and case value - always
# presented as a wide range with that caveat, never as a precise quote.

COST_ESTIMATES = {
    "ni_act_138": {
        "range": "Rs. 15,000 - Rs. 75,000",
        "context": "for initial stages in a city court (notice response, filing, "
                    "early hearings). Higher for appeals or high-value cheques.",
    },
    "ni_act_notice_requirement": {
        "range": "Rs. 15,000 - Rs. 75,000",
        "context": "for initial stages in a city court (notice response, filing, "
                    "early hearings). Higher for appeals or high-value cheques.",
    },
    "consumer_protection_2019_35": {
        "range": "Rs. 200 - Rs. 2,000 (filing fee only)",
        "context": "you can file and represent yourself at the Consumer Commission "
                    "without a lawyer - this is the government filing fee, not a "
                    "legal fee. A lawyer is optional and usually costs less than "
                    "criminal cases if you choose to hire one.",
    },
    "consumer_protection_notice": {
        "range": "Rs. 200 - Rs. 2,000 (filing fee only)",
        "context": "you can file and represent yourself at the Consumer Commission "
                    "without a lawyer - this is the government filing fee, not a "
                    "legal fee.",
    },
}

DEFAULT_NOTE = "Reliable cost data is not available for this specific case type. " \
               "Get a quote from 2-3 local advocates before committing."


def estimate_cost(relevant_statutes: list) -> dict:
    """Returns a rough cost range for the most relevant matched statute,
    or an honest fallback if we don't have data for that case type."""
    for statute in relevant_statutes:
        if statute["id"] in COST_ESTIMATES:
            data = COST_ESTIMATES[statute["id"]]
            return {
                "range": data["range"],
                "note": data["context"],
                "disclaimer": "Rough estimate only - varies significantly by city, "
                               "lawyer experience, and case complexity.",
            }
    return {
        "range": None,
        "note": DEFAULT_NOTE,
        "disclaimer": None,
    }
