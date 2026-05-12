

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateSummary, clearResume } from "../redux/resumeSlice";
import { motion } from "framer-motion";
import html2pdf from "html2pdf.js";  //html to pdf conversion library to download resume as PDF


const ResumeForm = () => {
  const dispatch = useDispatch();

  // now summary = full resume JSON
  const { loading, summary: resume, error } = useSelector((state) => state.resume);

 const [formData, setFormData] = useState({
  name: "",
  position: "",
  email: "",
  phoneNo: "",
  skills: "",
  linkedin: "",
  github: "",
  portfolio: "",


  experience: "",
  education: "",
  projects: [
    {
      name: "",
      tech: "",
      github: "",
      live: ""
    }
  ],
 
});

const handleProjectChange = (index, e) => {
  const updatedProjects = [...formData.projects];
  updatedProjects[index][e.target.name] = e.target.value;

  setFormData({
    ...formData,
    projects: updatedProjects
  });
};

// add and remove project fields
const addProject = () => {
  setFormData({
    ...formData,
    projects: [
      ...formData.projects,
      { name: "", tech: "", github: "", live: "" }
    ]
  });
};

const removeProject = (index) => {
  const updatedProjects = formData.projects.filter((_, i) => i !== index);

  setFormData({
    ...formData,
    projects: updatedProjects
  });
};

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
     dispatch(clearResume()); // 🔥 clears old data
    dispatch(generateSummary(formData));
  };

   // download pdf
  const downloadResume = () => {
    const element = document.getElementById("resume");

    html2pdf()
      .set({
        margin: 10,
        filename: "ATS_Resume.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      })
      .from(element)
      .save();
  };

  // if ai responce is still string, convert to array for proper display in resume
  const formatPoints = (desc) => {
  if (!desc) return [];

  // If already array ✅
  if (Array.isArray(desc)) return desc;

  // If string → convert to array
  return desc
    .split("•")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

const inputStyle = "w-full p-2 rounded bg-gray-100 dark:bg-gray-600 outline-none focus:ring-2 focus:ring-blue-400";

return (
    <div className="flex justify-center px-4 py-6">

      <div className="w-full max-w-4xl bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-lg">

        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
          AI Resume Builder
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info */}
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-3">Basic Info</h3>

            <div className="grid grid-cols-2 gap-3">
              <input name="name" placeholder="Name" onChange={handleChange} className={inputStyle} />
              <input name="position" placeholder="Position" onChange={handleChange} className={inputStyle} />
              <input name="email" placeholder="Email" onChange={handleChange} className={inputStyle} />
              <input name="phoneNo" placeholder="Phone" onChange={handleChange} className={inputStyle} />
            </div>
          </div>

          {/* Professional */}
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-3">Professional Details</h3>

            <div className="space-y-3">
              <input name="skills" placeholder="Skills (comma separated)" onChange={handleChange} className={inputStyle} />
              <input name="experience" placeholder="Experience" onChange={handleChange} className={inputStyle} />
              <input name="education" placeholder="Education" onChange={handleChange} className={inputStyle} />
            </div>
          </div>

          {/* Links */}
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-3">Links</h3>

            <div className="space-y-3">
              <input name="linkedin" placeholder="LinkedIn" onChange={handleChange} className={inputStyle} />
              <input name="github" placeholder="GitHub" onChange={handleChange} className={inputStyle} />
              <input name="portfolio" placeholder="Portfolio" onChange={handleChange} className={inputStyle} />
            </div>
          </div>

          {/* Projects */}
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-3">Projects</h3>

            {formData.projects.map((project, index) => (
              <div key={index} className="space-y-3 border-b pb-3 mb-3">
                <input name="name" placeholder="Project Name" value={project.name}
                  onChange={(e) => handleProjectChange(index, e)} className={inputStyle} />

                <input name="tech" placeholder="Tech Stack" value={project.tech}
                  onChange={(e) => handleProjectChange(index, e)} className={inputStyle} />

                <input name="github" placeholder="GitHub Link" value={project.github}
                  onChange={(e) => handleProjectChange(index, e)} className={inputStyle} />

                <input name="live" placeholder="Live Link" value={project.live}
                  onChange={(e) => handleProjectChange(index, e)} className={inputStyle} />

                {formData.projects.length > 1 && (
                  <button type="button" onClick={() => removeProject(index)}
                    className="mt-2 text-red-500 text-sm">
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button type="button" onClick={addProject}
              className="bg-blue-500 text-white px-3 py-1 rounded">
              + Add Project
            </button>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold">
            Generate Resume
          </button>

        </form>

        {/* Loading */}
        {/* {loading && <p className="mt-4 text-center">Generating...</p>} */}
        {loading && (
  <div className="flex justify-center mt-4">
    <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
)}

        {/* Error */}
        {error && <p className="mt-4 text-red-500">{error}</p>}
    

        {/* RESUME PREVIEW */}
        {resume && resume.name && (
          <motion.div
            id="resume"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 bg-white dark:bg-gray-900 p-6 rounded-xl shadow space-y-4"
          >
            <h1 className="text-3xl font-bold">{resume.name}</h1>
            <p className="text-gray-500">{resume.position}</p>

            <div className="text-sm text-gray-500 flex flex-wrap gap-3">
              <span>{resume.email}</span>
              <span>{resume.phoneNo}</span>
            </div>

            {/* Links */}
            <div className="flex gap-4 text-blue-500 text-sm">
              {resume.links?.github && <a href={resume.links.github} target="_blank">GitHub</a>}
              {resume.links?.linkedin && <a href={resume.links.linkedin} target="_blank">LinkedIn</a>}
              {resume.links?.portfolio && <a href={resume.links.portfolio} target="_blank">Portfolio</a>}
            </div>

            <p className="text-sm">{resume.summary}</p>

            {/* Skills */}
            <h2 className="text-lg font-semibold border-b pb-1">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {resume.skills?.map((skill, i) => (
                <span key={i} className="bg-blue-100 dark:bg-blue-900 text-blue-700 px-2 py-1 rounded text-xs">
                  {skill}
                </span>
              ))}
            </div>

            {/* Experience */}
            <h2 className="text-lg font-semibold border-b pb-1">Experience</h2>
            {resume.experience?.map((exp, i) => (
              <div key={i}>
                <p className="font-medium">{exp.role}</p>
               <ul className="list-disc ml-5 text-sm">
 {formatPoints(exp.description)?.map((point, i) => (
    <li key={i}>{point}</li>
  ))}
</ul>
              </div>
            ))}

            {/* Projects */}
            <h2 className="text-lg font-semibold border-b pb-1">Projects</h2>
            {resume.projects?.map((proj, i) => (
              <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="font-medium">{proj.name}</p>
                <p className="text-sm">{proj.tech}</p>
                <div className="text-sm text-blue-500">
                  <a href={proj.github} target="_blank">GitHub</a> |{" "}
                  <a href={proj.live} target="_blank">Live</a>
                </div>
                <ul className="list-disc ml-5 text-sm">
  {formatPoints(proj.description)?.map((point, i) => (
    <li key={i}>{point}</li>
  ))}
</ul>
              </div>
            ))}
          </motion.div>
        )}

        {/* Buttons */}
        {resume && resume.name && (
          <div className="flex gap-8 mt-4 justify-center ml-60 mr-60">
            <button
              onClick={() => dispatch(generateSummary(formData))}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white p-2 rounded"
            >
             {loading ? "Regenerating..." : "Regenerate"}
            </button>

            <button
              onClick={downloadResume}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
            >
              Download PDF
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ResumeForm;