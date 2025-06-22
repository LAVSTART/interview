// src/pages/Home/CreateSessionForm.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";

const CreateSessionForm = ({ onClose, onSessionCreated }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    topicsToFocus: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();

    const { role, experience, topicsToFocus, description } = formData;

    if (!role || !experience || !topicsToFocus) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setIsLoading(true);

      const topicsArray = topicsToFocus
        .split(",")
        .map((topic) => topic.trim())
        .filter((topic) => topic.length > 0);

      // Step 1: Generate questions from AI
      const aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
        role,
        experience,
        topicsToFocus: topicsArray,
        numberOfQuestions: 10,
      });

      const generatedQuestions = aiResponse.data;

      // Step 2: Create session with questions
      const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
        role,
        experience,
        description,
        topicsToFocus: topicsArray,
        questions: generatedQuestions,
      });

      if (response.data?.success && response.data?.session) {
        toast.success("Session created successfully!");

        // Reset form and close modal
        setFormData({ role: "", experience: "", topicsToFocus: "", description: "" });
        onClose?.();
      onSessionCreated?.(response.data.session);

        // Navigate to InterviewPrep page
        navigate(`/interview-prep/${response.data.session._id}`);
      } else {
        toast.error("Something went wrong.");
      }
    } catch (err) {
      console.error("Create session error:", err.response?.data || err.message);
      toast.error("Failed to create session.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4 w-full max-w-md" onSubmit={handleCreateSession}>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Session</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="e.g. Frontend Developer"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Experience *</label>
        <input
          type="text"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          placeholder="e.g. 2 years"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Topics to Focus (comma-separated) *
        </label>
        <input
          type="text"
          name="topicsToFocus"
          value={formData.topicsToFocus}
          onChange={handleChange}
          placeholder="e.g. React, JavaScript, CSS"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Optional notes about this session"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={3}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2 rounded-md flex items-center gap-2"
        >
          {isLoading ? <SpinnerLoader size="sm" color="white" /> : "Create"}
        </button>
      </div>
    </form>
  );
};

export default CreateSessionForm;
