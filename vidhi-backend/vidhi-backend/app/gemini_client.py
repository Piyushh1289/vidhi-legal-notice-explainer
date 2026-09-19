import os
from google import genai

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY not found. Make sure it's set in your .env file."
    )

client = genai.Client(api_key=GEMINI_API_KEY)

GENERATION_MODEL = "gemini-3.6-flash"
EMBEDDING_MODEL = "gemini-embedding-001"


def embed_text(text: str) -> list[float]:
    """Turn a piece of text into a vector using Gemini's embedding model."""
    result = client.models.embed_content(
        model=EMBEDDING_MODEL,
        contents=text,
    )
    return result.embeddings[0].values


def embed_query(text: str) -> list[float]:
    """Embed a search query (notice text)."""
    result = client.models.embed_content(
        model=EMBEDDING_MODEL,
        contents=text,
    )
    return result.embeddings[0].values


def generate_explanation(prompt: str) -> str:
    """Send a prompt to Gemini and return the generated text."""
    response = client.models.generate_content(
        model=GENERATION_MODEL,
        contents=prompt,
    )
    return response.text