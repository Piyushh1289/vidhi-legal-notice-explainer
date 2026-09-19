from app.gemini_client import client, GENERATION_MODEL


def translate_to_hindi(explanation_text: str) -> str:
    """Translates the plain-language explanation into simple Hindi,
    keeping legal terms/section numbers intact."""
    prompt = f"""Translate the following legal notice explanation into simple, everyday Hindi (not overly formal/Sanskritized Hindi). Keep numbers, dates, amounts, and Act/Section names exactly as they are (do not translate "Section 138" etc). Keep the same structure with the numbered headings.

TEXT TO TRANSLATE:
{explanation_text}"""

    response = client.models.generate_content(
        model=GENERATION_MODEL,
        contents=prompt,
    )
    return response.text
