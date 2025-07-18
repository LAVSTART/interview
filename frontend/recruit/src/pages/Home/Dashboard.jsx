import React, { useEffect, useState } from "react";
import SummaryCard from "../../components/SummaryCard";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import CreateSessionForm from "./CreateSessionForm";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosinstance";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";


const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchSessions = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      setSessions(res.data.sessions || []);
    } catch (err) {
      console.error("Error fetching sessions:", err);
      toast.error("Failed to load sessions");
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleSessionCreated = (newSession) => {
    setSessions((prev) => [newSession, ...prev]);
  };

  const handleDeleteSession = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.SESSION.DELETE(id));
      setSessions((prev) => prev.filter((s) => s._id !== id));
      toast.success("Session deleted successfully!");
    } catch (err) {
      console.error("Failed to delete session:", err);
      toast.error("Something went wrong while deleting.");
    }
  };

  return (
    <DashboardLayout>
      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 mb-16">
        {/* Dummy Card */}
        <SummaryCard
          role="Backend Developer"
          topicsToFocus={["Node.js", "MongoDB", "Express.js"]}
          experience="3 Years"
          questions={11}
          description="Preparing for backend developer interview"
          lastUpdated={"7th May 2025"}
          onSelect={() => console.log("Dummy card clicked")}
        />

        {/* Render Fetched Cards */}
        <AnimatePresence>
        {sessions.map((session) => (
            <motion.div
      key={session._id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
          <SummaryCard
            key={session._id}
            role={session.role}
            topicsToFocus={
          Array.isArray(session.topicsToFocus)
            ? session.topicsToFocus.join(", ")
            : session.topicsToFocus
        }
            experience={session.experience}
            questions={session.questions?.length || 0}
            description={session.description}
            lastUpdated={new Date(session.updatedAt).toLocaleDateString()}
            onSelect={() =>
              (window.location.href = `/interview-prep/${session._id}`)
            }
            onDelete={() => handleDeleteSession(session._id)} // 👈 NEW
          />
             </motion.div>
        ))}
        </AnimatePresence>
      </div>

      {/* Add New Button Bottom Left */}
      <div className="fixed bottom-4 left-4 z-10">
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 shadow-md"
        >
          Add New
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-3 text-gray-600 text-lg font-bold hover:text-red-500"
            >
              &times;
            </button>
            <CreateSessionForm
              onClose={() => setShowForm(false)}
              onSessionCreated={handleSessionCreated}
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
