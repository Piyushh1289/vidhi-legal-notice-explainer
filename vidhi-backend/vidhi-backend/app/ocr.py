from PIL import Image
import pytesseract
import io

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def extract_text_from_image(file_bytes: bytes) -> str:
    """Runs OCR on an uploaded image and returns the extracted text.

    Requires the Tesseract OCR engine to be installed on the system
    (separate from the pytesseract Python package). See README for
    install instructions.
    """
    image = Image.open(io.BytesIO(file_bytes))
    text = pytesseract.image_to_string(image)
    return text.strip()
