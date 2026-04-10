"""API личного разбора кейсов (Gemini). Запуск: uvicorn main:app --reload --port 8000"""
from __future__ import annotations

import os
from pathlib import Path

import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

ROOT = Path(__file__).resolve().parent
PROJECT_ROOT = ROOT.parent

_env_kw = {"override": True, "encoding": "utf-8-sig"}
load_dotenv(PROJECT_ROOT / ".env", **_env_kw)
load_dotenv(PROJECT_ROOT / ".env.local", **_env_kw)
load_dotenv(ROOT / ".env", **_env_kw)


def get_api_key() -> str | None:
    k = (os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY") or "").strip()
    if k.startswith("\ufeff"):
        k = k.lstrip("\ufeff").strip()
    return k or None


def get_model_name() -> str:
    return (os.getenv("GEMINI_MODEL") or "gemini-flash-latest").strip()


def build_prompt(user_case: str) -> str:
    return f"""Ты помощник по страхованию для подростков. Проанализируй кейс и ответь ТОЛЬКО на русском, без markdown и без заголовков #.

Строго в таком формате (эти три строки с такими же подписями обязательны):

Риск: <число>%
Понятно подростку: <2-4 простых предложения без сложных терминов>
Разбор случая: <3-6 предложений: что может случиться, какие расходы возможны, что уточнить у страховой>

Кейс пользователя:
{user_case}"""


SYSTEM_INSTRUCTION = (
    "Ты объясняешь страховые риски подросткам простым и доброжелательным языком. "
    "Не давай юридических гарантий."
)

app = FastAPI(title="Personal case LLM API")


@app.get("/")
def root():
    return {"service": "personal-case-api", "docs": "/docs"}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(HTTPException)
async def http_exception_handler(_request: Request, exc: HTTPException):
    detail = exc.detail
    msg = detail if isinstance(detail, str) else str(detail)
    return JSONResponse(status_code=exc.status_code, content={"error": msg})


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_request: Request, _exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"error": "Некорректное тело запроса (нужен JSON с полем caseText)."},
    )


class AnalyzeBody(BaseModel):
    caseText: str = Field(..., min_length=1, max_length=12000)


class AnalyzeOk(BaseModel):
    text: str
    source: str = "llm"


@app.get("/api/personal-case/health")
def health():
    return {"configured": bool(get_api_key())}


@app.post("/api/personal-case/analyze", response_model=AnalyzeOk)
def analyze(body: AnalyzeBody):
    case_text = body.caseText.strip()
    if not case_text:
        raise HTTPException(status_code=400, detail="Нужен непустой caseText.")

    api_key = get_api_key()
    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="На сервере не задан GOOGLE_API_KEY (или GEMINI_API_KEY). "
            "Добавь в backend/.env или корневой .env.local.",
        )

    prompt = build_prompt(case_text)
    model_name = get_model_name()

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(
            model_name,
            system_instruction=SYSTEM_INSTRUCTION,
        )
        generation_config = genai.GenerationConfig(
            temperature=0.4,
            max_output_tokens=1024,
        )
        response = model.generate_content(
            prompt,
            generation_config=generation_config,
        )
        text = (response.text or "").strip() if response.text else ""
        if not text:
            parts = []
            if response.candidates:
                for c in response.candidates:
                    if c.content and c.content.parts:
                        for p in c.content.parts:
                            if hasattr(p, "text") and p.text:
                                parts.append(p.text)
            text = "\n".join(parts).strip()

        if not text:
            raise HTTPException(status_code=502, detail="Модель вернула пустой ответ.")

        return AnalyzeOk(text=text, source="llm")
    except HTTPException:
        raise
    except Exception as e:
        msg = str(e)
        low = msg.lower()
        if "429" in msg or "quota" in low or "resource exhausted" in low:
            raise HTTPException(
                status_code=429,
                detail="Превышен лимит запросов к модели. Попробуй позже или смени модель в настройках сервера.",
            ) from e
        raise HTTPException(status_code=502, detail="Не удалось получить ответ модели.") from e
