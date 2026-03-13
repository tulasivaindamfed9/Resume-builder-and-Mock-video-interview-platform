from fastapi import FastAPI
from pydantic import BaseModel
from services.gemini_service import generate_resume_summary


app = FastAPI()

# basemodel used to validate incoming request data for resume summary generation. It ensures that the required fields are present and of the correct type.
class ResumeRequest(BaseModel):
    name: str
    skills: str
    experience: str
    education: str

@app.get("/")
def home():
    return {"message": "Backend Running Successfully 🚀"}

@app.post("/ai/resume-summary")
def resume_summary(req: ResumeRequest):
    summary = generate_resume_summary(req.dict())
    return {"summary": summary}