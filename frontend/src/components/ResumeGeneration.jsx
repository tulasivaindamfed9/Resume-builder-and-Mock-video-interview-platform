import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateSummary, clearResume } from "../redux/resumeSlice";
import { motion } from "framer-motion";
import html2pdf from "html2pdf.js";

/* 🔥 Reusable Editable Component */
const EditableField = ({ value, onChange, isEditing, type = "text", className }) => {
  if (!isEditing) return <p className={className}>{value}</p>;

  return type === "textarea" ? (
    <textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full p-2 rounded bg-gray-100 dark:bg-gray-700 ${className}`}
    />
  ) : (
    <input
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full p-2 rounded bg-gray-100 dark:bg-gray-700 ${className}`}
    />
  );
};

const ResumeForm = () => {
  const dispatch = useDispatch();

  const { loading, summary: resume, error } = useSelector((state) => state.resume);

  const [editableResume, setEditableResume] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (resume) setEditableResume(resume);
  }, [resume]);

  const inputStyle =
    "w-full p-2 rounded bg-gray-100 dark:bg-gray-600 outline-none focus:ring-2 focus:ring-blue-400";

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
    projects: [{ name: "", tech: "", github: "", live: "" }],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProjectChange = (index, e) => {
    const updated = [...formData.projects];
    updated[index][e.target.name] = e.target.value;
    setFormData({ ...formData, projects: updated });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [...formData.projects, { name: "", tech: "", github: "", live: "" }],
    });
  };

  const removeProject = (index) => {
    const updated = formData.projects.filter((_, i) => i !== index);
    setFormData({ ...formData, projects: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearResume());
    dispatch(generateSummary(formData));
  };

  const downloadResume = () => {
    const element = document.getElementById("resume");

    html2pdf().set({
      margin: 10,
      filename: "ATS_Resume.pdf",
      html2canvas: { scale: 2 },
    }).from(element).save();
  };

  const formatPoints = (desc) => {
    if (!desc) return [];
    if (Array.isArray(desc)) return desc;

    return desc
      .split(/[\n•-]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  };

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
                    className="text-red-500 text-sm">
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

        {/* Resume Preview */}
        {editableResume && (
          <>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="mt-6 bg-yellow-500 text-white px-3 py-1 rounded"
            >
              {isEditing ? "Save" : "Edit"}
            </button>

            <motion.div
              id="resume"
              className="mt-6 bg-white dark:bg-gray-900 p-6 rounded-xl shadow space-y-4"
            >
              <EditableField
                value={editableResume.name}
                isEditing={isEditing}
                onChange={(val) => setEditableResume({ ...editableResume, name: val })}
                className="text-3xl font-bold"
              />

              <EditableField
                value={editableResume.summary}
                isEditing={isEditing}
                type="textarea"
                onChange={(val) => setEditableResume({ ...editableResume, summary: val })}
              />

              <h2 className="font-semibold">Projects</h2>

              {editableResume.projects?.map((proj, i) => (
                <div key={i}>
                  <EditableField
                    value={proj.name}
                    isEditing={isEditing}
                    onChange={(val) => {
                      const updated = [...editableResume.projects];
                      updated[i].name = val;
                      setEditableResume({ ...editableResume, projects: updated });
                    }}
                    className="font-medium"
                  />

                  <ul className="list-disc ml-5 text-sm">
                    {formatPoints(proj.description).map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => dispatch(generateSummary(formData))}
                className="flex-1 bg-purple-500 text-white p-2 rounded"
              >
                Regenerate
              </button>

              <button
                onClick={downloadResume}
                className="flex-1 bg-green-500 text-white p-2 rounded"
              >
                Download PDF
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default ResumeForm;