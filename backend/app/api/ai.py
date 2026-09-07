from fastapi import APIRouter, Depends, HTTPException
from openai import OpenAI
from pydantic import BaseModel

from app.api.deps import get_current_user
from app.core.config import get_settings
from app.models.user import User

router = APIRouter(prefix="/ai", tags=["ai"])


class CoverLetterRequest(BaseModel):
    job: dict
    resume_text: str | None = None


@router.post("/cover-letter")
def generate_cover_letter(payload: CoverLetterRequest, _: User = Depends(get_current_user)):
    settings = get_settings()
    if not settings.OPENAI_API_KEY:
        raise HTTPException(status_code=503, detail="Cover-letter generation is not configured. Set OPENAI_API_KEY.")
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    prompt = (
        "Write a concise, professional cover letter using only the candidate details supplied. "
        "Do not invent employers, dates, achievements, or skills.\n\n"
        f"Job:\n{payload.job}\n\nCandidate resume:\n{payload.resume_text or 'No resume supplied.'}"
    )
    try:
        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail="The AI provider could not generate a cover letter.") from exc
    return {"coverLetter": response.choices[0].message.content}
