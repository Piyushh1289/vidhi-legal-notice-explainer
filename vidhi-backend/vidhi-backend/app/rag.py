import json
import os
import numpy as np

from app.gemini_client import embed_text, embed_query

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "statutes.json")
CACHE_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "statute_embeddings.json")

_statutes = None
_embeddings = None


def _load_statutes():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def _build_or_load_embeddings():
    """Embeds every statute chunk once and caches the result to disk, so we
    don't re-call the Gemini embedding API every time the server restarts."""
    statutes = _load_statutes()

    if os.path.exists(CACHE_PATH):
        with open(CACHE_PATH, "r", encoding="utf-8") as f:
            cached = json.load(f)
        # only reuse the cache if it covers the same number of statutes
        if len(cached) == len(statutes):
            return statutes, cached

    print("Building statute embeddings (first run, this calls the Gemini API)...")
    embeddings = []
    for item in statutes:
        vector = embed_text(f"{item['title']}. {item['text']}")
        embeddings.append(vector)

    with open(CACHE_PATH, "w", encoding="utf-8") as f:
        json.dump(embeddings, f)

    return statutes, embeddings


def _get_index():
    global _statutes, _embeddings
    if _statutes is None or _embeddings is None:
        _statutes, _embeddings = _build_or_load_embeddings()
    return _statutes, _embeddings


def _cosine_similarity(a: list[float], b: list[float]) -> float:
    a = np.array(a)
    b = np.array(b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))


def retrieve_relevant_statutes(notice_text: str, top_k: int = 3):
    """Given the extracted notice text, return the top_k most relevant
    statute chunks to ground the explanation in."""
    statutes, embeddings = _get_index()
    query_vector = embed_query(notice_text)

    scored = [
        (_cosine_similarity(query_vector, emb), statute)
        for emb, statute in zip(embeddings, statutes)
    ]
    scored.sort(key=lambda x: x[0], reverse=True)

    return [statute for score, statute in scored[:top_k]]
