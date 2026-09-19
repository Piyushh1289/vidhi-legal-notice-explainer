from dotenv import load_dotenv
load_dotenv()  # must run before importing anything that reads env vars

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.ocr import extract_text_from_image
from app.rag import retrieve_relevant_statutes
from app.gemini_client import generate_explanation
from app.fraud_check import check_authenticity
from app.legal_aid import check_legal_aid_needed
from app.cost_estimator import estimate_cost
from app.translate import translate_to_hindi

app = FastAPI(title="Vidhi API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class TextInput(BaseModel):
    text: str


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


@app.post("/api/fraud-check")
def fraud_check(payload: TextInput):
    result = check_authenticity(payload.text)
    return result


@app.post("/api/fraud-check/upload")
async def fraud_check_upload(file: UploadFile = File(...)):
    file_bytes = await file.read()
    notice_text = extract_text_from_image(file_bytes)
    result = check_authenticity(notice_text)
    result["extracted_text"] = notice_text
    return result


def _build_prompt(notice_text: str, statute_context: str) -> str:
    return f"""You are explaining an Indian legal notice to someone with no legal background, in simple plain language.

NOTICE TEXT (extracted via OCR, may contain minor errors):
{notice_text}

RELEVANT INDIAN LAW CONTEXT (use this to ground your explanation - do not invent legal facts beyond what's given here):
{statute_context}

Respond in this exact structure:
1. WHAT THIS IS: One or two plain-language sentences on what kind of notice this is and why it was sent.
2. WHAT IT MEANS FOR YOU: 3-4 bullet points explaining the practical implications, in simple words, no legal jargon.
3. WHAT TO DO: The concrete next step(s) and any deadline mentioned in the notice or implied by the relevant law.
4. CONFIDENCE: State whether the notice's meaning is clear from the given law context, or whether a lawyer's review is recommended because it's ambiguous or high-stakes.

Keep the whole response under 200 words. Do not give legal advice beyond explaining what the notice and the cited law generally mean."""


def _full_analysis(notice_text: str, include_hindi: bool = True):
    relevant_statutes = retrieve_relevant_statutes(notice_text)

    statute_context = "\n\n".join(
        f"[{s['act']} - {s['section']}: {s['title']}]\n{s['text']}"
        for s in relevant_statutes
    )

    prompt = _build_prompt(notice_text, statute_context)
    explanation = generate_explanation(prompt)

    legal_aid = check_legal_aid_needed(relevant_statutes, explanation)
    cost_estimate = estimate_cost(relevant_statutes)

    explanation_hindi = None
    if include_hindi:
        try:
            explanation_hindi = translate_to_hindi(explanation)
        except Exception:
            explanation_hindi = None

    return {
        "relevant_statutes": relevant_statutes,
        "explanation": explanation,
        "explanation_hindi": explanation_hindi,
        "legal_aid": legal_aid,
        "cost_estimate": cost_estimate,
    }


@app.post("/api/explain")
async def explain_notice(file: UploadFile = File(...)):
    file_bytes = await file.read()
    notice_text = extract_text_from_image(file_bytes)

    if not notice_text:
        return {"error": "Could not extract any text from the uploaded file."}

    result = _full_analysis(notice_text)
    result["extracted_text"] = notice_text
    return result


@app.post("/api/explain/text")
def explain_notice_text(payload: TextInput):
    result = _full_analysis(payload.text)
    return result
