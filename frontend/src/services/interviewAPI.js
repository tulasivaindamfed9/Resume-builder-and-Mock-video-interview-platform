import axios from "axios";
// import backend url from env variable
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ✅ using env
});

export const generateQuestions = async (config) => {
  const res = await API.post("/ai/mock-questions", config);
  return res.data;
};

export const analyzeAnswer = async (question, answer) => {
  const res = await API.post("/ai/analyze-answer", {
    question,
    answer,
  });
  return res.data;
};