import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const generateSummaryAPI = async (data) => {
  try {
    const response = await API.post("/ai/resume-summary", data);
    return response;
  } catch (error) {
    throw error;
  }
};