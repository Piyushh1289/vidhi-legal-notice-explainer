# Vidhi Backend — Setup Guide (Windows)

## 1. Python install karo (agar nahi hai)
python.org se Python 3.11+ download karo. Install karte waqt neeche wala
checkbox **"Add python.exe to PATH"** zaroor tick karna.

Verify: naya terminal kholke `python --version` likho.

## 2. Tesseract OCR install karo (system-level, alag se)
`pytesseract` sirf ek Python wrapper hai — asli OCR engine "Tesseract"
system mein alag se install karna padta hai.

1. Yahan se installer download karo: https://github.com/UB-Mannheim/tesseract/wiki
2. Install karo, default location rakho: `C:\Program Files\Tesseract-OCR`
3. `app/ocr.py` mein path set karna padega — file kholke top mein yeh line add karo:
   ```python
   pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
   ```

## 3. Folder ko VS Code mein kholo
Is `vidhi-backend` folder ko VS Code mein alag se open karo (File > Open Folder),
ya `vidhi-app` ke paas hi rakho aur naya VS Code window mein kholo.

## 4. Virtual environment banao (recommended)
Terminal mein (is folder ke andar):
```
python -m venv venv
venv\Scripts\activate
```
Agar PowerShell error de (execution policy), yeh chalao pehle:
```
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

## 5. Dependencies install karo
```
pip install -r requirements.txt
```

## 6. API key daalo
`.env.example` file ko copy karke naam badal do `.env` — phir usme apni
Gemini API key daalo:
```
GEMINI_API_KEY=tumhari_asli_key_yahan
```

## 7. Server start karo
```
uvicorn app.main:app --reload --port 8000
```

Browser mein check karo: http://localhost:8000/api/health — `{"status":"ok"}`
dikhna chahiye.

## Testing (without frontend, quick check)
http://localhost:8000/docs pe jao — yeh FastAPI ka auto-generated interactive
docs page hai, jahan se seedha `/api/explain/text` endpoint ko test kar sakte
ho bina frontend banaye — bas notice ka text paste karke "Try it out" karo.

## Note on first run
Pehli baar `/api/explain` ya `/api/explain/text` call hone par, backend
`data/statutes.json` ko embed karega (Gemini API se) aur cache kar dega
`data/statute_embeddings.json` mein. Yeh sirf ek baar hoga, thoda time lega
(~5-10 seconds), uske baad fast rahega.
