#    model="gemini-3-flash-preview",
import os
import json
from dotenv import load_dotenv
from google import genai
from google.genai.errors import ServerError, ClientError
import time

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
  


client = genai.Client(api_key=api_key)


    
def generate_resume_summary(data):
    """
    This function receives resume data from frontend
    and sends prompt to Gemini AI
    """


    prompt =  f"""
Create a complete ATS-friendly resume.

STRICT RULES (VERY IMPORTANT):
- Use ONLY the user provided data
- DO NOT add new skills
- DO NOT add new projects
- DO NOT assume anything
- DO NOT modify input values
- ONLY improve wording and formatting
- If data is missing, leave it empty

Bullet Points:
- Return bullet points as ARRAY of strings
- Do NOT return bullet points as paragraph

Return ONLY valid JSON.
Improve descriptions ONLY for given projects.
Do not add/remove anything.

Format:

{{
  "name": "Full Name",
  "position": "Job Title",
  "email": "Email",
  "phoneNo": "Phone Number",

  "summary": "Professional summary",

  "skills": ["skill1", "skill2"],

  "experience": [
    {{
      "role": "Job title",
      "description": ["point1", "point2", "point3"]
    }}
  ],

  "projects": [
    {{
      "name": "Project Name",
      "tech": "React, Node",
      "description": ["point1", "point2", "point3"],
      "github": "url",
      "live": "url"
    }}
  ],

  "links": {{
    "github": "url",
    "linkedin": "url",
    "portfolio": "url"
  }}
}}

User Info:
Name: {data.get("name")}
Position: {data.get("position")}
Email: {data.get("email")}
Phone: {data.get("phoneNo")}
Education: {data.get("education")}
Skills: {data.get("skills")}
Experience: {data.get("experience")}
Projects: {data.get("projects")}
GitHub: {data.get("github")}
LinkedIn: {data.get("linkedin")}
Portfolio: {data.get("portfolio")}
"""
    try:
        response = client.models.generate_content(
            model="gemini-1.5-flash",  # ✅ change model
            contents=prompt
        )

        text = response.text
        cleaned = text.replace("```json", "").replace("```", "").strip()

        try:
            return json.loads(cleaned)
        except Exception as e:
            print("JSON parse error:", e)
            return []

    except ClientError:
        return {"error": "Daily AI limit reached. Try later."}

    except ServerError:
        return {"error": "AI service is busy. Try again."}

    except Exception as e:
        print("Error:", e)
        return {"error": "Something went wrong"}




    # ================= MOCK INTERVIEW FEATURE ================= #

def generate_interview_questions(role, experience, skills):

    prompt = f"""
    Generate 5 interview questions.

    Role: {role}
    Experience Level: {experience}
    Skills: {skills}

    Rules:
    - Questions should be relevant to role
    - Start easy → medium → hard
    - Return ONLY JSON array

    Example:
    ["Q1", "Q2", "Q3"]
    """

    try:
        response = client.models.generate_content(
            model="gemini-flash-lite-latest",  # ✅ stable model
            contents=prompt
        )

        text = response.text
        cleaned = text.replace("```json", "").replace("```", "").strip()

        try:
            return json.loads(cleaned)
        except:
            return [cleaned]

    # 🔴 QUOTA ERROR (429)
    except ClientError:
        return {
            "error": "Daily AI limit reached. Please try again later."
        }

    # 🔴 SERVER BUSY (503)
    except ServerError:
        return {
            "error": "AI service is busy. Please try again."
        }

    # 🔴 ANY OTHER ERROR
    except Exception as e:
        print("Unexpected Error:", e)
        return {
            "error": "Something went wrong."
        }



def analyze_interview_answer(question, answer):
    """
    Evaluates user answer
    """

    prompt = f"""
    Evaluate this answer.

    Question: {question}
    Answer: {answer}

    Give output in JSON:

    {{
      "score": number (0-10),
      "comment": "short feedback",
      "improvement": "how to improve"
    }}
    """

    try:
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt
        )

        text = response.text
        cleaned = text.replace("```json", "").replace("```", "").strip()

        try:
            return json.loads(cleaned)
        except:
            return {
                "score": 5,
                "comment": cleaned,
                "improvement": "Try to improve clarity"
            }

    except ClientError:
        return {"error": "Daily AI limit reached. Try later."}

    except ServerError:
        return {"error": "AI service is busy. Try again."}

    except Exception as e:
        print("Error:", e)
        return {"error": "Something went wrong"}