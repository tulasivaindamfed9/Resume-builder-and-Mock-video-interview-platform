import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setConfig } from "../../redux/interviewSlice";
import { fetchQuestions } from "../../redux/interviewSlice";
import toast from "react-hot-toast";

const InterviewSetup = ({ onStart }) => {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    role: "",
    experience: "",
    skills: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleStart = async () => {
  if (!form.role || !form.experience || !form.skills) {
    toast.error("Please fill all fields");
    return;
  }

  dispatch(setConfig(form));

  try {
    const result = await dispatch(fetchQuestions(form));

    if (fetchQuestions.rejected.match(result)) {
      toast.error(result.payload || "AI is busy. Try again!");
      return;
    }

    toast.success("Interview Started 🚀");

    onStart(); // ✅ no need to pass form again

  } catch (error) {
    toast.error("Something went wrong");
  }
};

  return (
    <div className="p-6 max-w-xl mx-auto bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-xl mb-4 text-white">Setup Interview</h2>

      <input
        name="role"
        placeholder="Role (e.g. Frontend Developer)"
        className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
        onChange={handleChange}
      />

      <input
        name="experience"
        placeholder="Experience (e.g. Fresher / 2 years)"
        className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
        onChange={handleChange}
      />

      <input
        name="skills"
        placeholder="Skills (React, JS, CSS)"
        className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
        onChange={handleChange}
      />

      <button
        onClick={handleStart}
        className="w-full bg-blue-500 py-2 rounded-lg"
      >
        Start Interview
      </button>
    </div>
  );
};

export default InterviewSetup;