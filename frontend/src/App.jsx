import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ResumeForm from "./components/ResumeForm";
import Interview from "./components/mockInterview/InterviewPage";

function App() {

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">

      {/* Navbar */}
      <Navbar />

      {/* Dark Mode Toggle */}
      <div className="flex justify-end p-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* Routes */}
      <Routes>

        {/* Resume Page */}
        <Route path="/" element={<ResumeForm />} />

        {/* Interview Page */}
        <Route path="/interview" element={<Interview />} />

      </Routes>

    </div>
  );
}

export default App;