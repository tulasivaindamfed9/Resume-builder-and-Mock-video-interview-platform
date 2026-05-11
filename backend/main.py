from fastapi import FastAPI, HTTPException
# fastapi creates backend server and handles API requests
from fastapi.middleware.cors import CORSMiddleware
from ai_service import (generate_resume_summary,analyze_interview_answer,generate_interview_questions)

app = FastAPI()

# allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    # allow_origins=["*"],
     allow_origins=["https://your-frontend.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "AI Resume Builder Backend Running"}

@app.post("/ai/resume-summary")
def resume_summary(data: dict):
    summary = generate_resume_summary(data)
    return {"summary": summary}

@app.post("/ai/mock-questions")
async def mock_questions(data: dict):
    """
    Input:
    {
      role: "",
      experience: "",
      skills: ""
    }

    Output:
    ["Question1", "Question2", ...]
    """
    result= generate_interview_questions(
        data.get("role"),
        data.get("experience"),
        data.get("skills")
    )

    # ✅ FIXED indentation + safe check
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=503, detail=result["error"])
    
    return result

@app.post("/ai/analyze-answer")
async def analyze_answer(data: dict):
    """
    Input:
    {
      question: "",
      answer: ""
    }

    Output:
    {
      score: 8,
      comment: "...",
      improvement: "..."
    }
    """
    return analyze_interview_answer(
        data.get("question"),
        data.get("answer")
    )