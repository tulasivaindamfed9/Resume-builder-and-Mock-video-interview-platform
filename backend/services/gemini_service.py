import google.generativeai as genai
import os
from dotenv import load_dotenv  

load_dotenv()  
# Loads environment variables from .env file.

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))  #Setting gemini API key for all requests.

# Selecting Gemini model through GenerativeModel
model = genai.GenerativeModel("gemini-1.5-flash")  #Initializing the Gemini model. You can choose different models based on your needs.

# this function receives receives frontend data, builds AI prompt, calls Gemini, returns generated summary
def generate_resume_summary(data):
    prompt = f"""
    Create a professional resume summary.

    Name: {data.get('name')}
    Skills: {data.get('skills')}
    Experience: {data.get('experience')}
    Education: {data.get('education')}

    Give a concise and impactful summary.
    """

    response = model.generate_content(prompt)
    return response.text