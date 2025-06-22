import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import moment from "moment";
import Modal from "../../components/Modal"; // ✅ Adjust path if necessary


import DashboardLayout from "../../components/layouts/DashboardLayout";
import RoleInfoHeader from "../../components/RoleInfoHeader";
import QuestionCard from "../../components/QuestionCards";


const InterviewPrep = () => {
  const { sessionId } = useParams();

  const [sessionData, setSessionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoader, setIsUpdateLoader] = useState(false);

  const [isConceptModalOpen, setConceptModalOpen] = useState(false);
const [conceptExplanation, setConceptExplanation] = useState("");

  // Fetch session data by session id
const fetchSessionDetailsById = async () => {
  try {
    setIsLoading(true);
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/sessions/${sessionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Fetched session:", res.data);

    // 🟢 THIS LINE IS CRITICAL
    if (res.data && res.data.session) {
         console.log("✅ Setting sessionData:", res.data.session);
      setSessionData(res.data.session);
    } else {
      console.warn("Session structure unexpected:", res.data);
    }

  } catch (err) {
    console.error("Failed to fetch session:", err);
  } finally {
    setIsLoading(false);
  }
};




  // Generate concept explanation
const generateConceptExplanation = async (question) => {
  try {
    setIsUpdateLoader(true);
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/ai/generate-explanation`,
      { concept: question },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const explanation = res.data.explanation || res.data.response || "No explanation available.";
    setConceptExplanation(explanation);
    setConceptModalOpen(true);
  } catch (err) {
    console.error("❌ Concept generation error:", err);
  } finally {
    setIsUpdateLoader(false);
  }
};




  // Toggle pin/unpin question
  const toggleQuestionPinStatus = async (questionId) => {
    try {
      await axios.put(`/api/questions/${questionId}/pin`);
      fetchSessionDetailsById();
    } catch (err) {
      console.error("Pin toggle error:", err);
    }
  };

  // Upload more questions (if supported)
  const uploadMoreQuestions = async () => {
    // Future enhancement
  };

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetailsById();
    }
  }, [sessionId]);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        {sessionData && (
          <RoleInfoHeader
            role={sessionData.role || ""}
            topicsToFocus={sessionData.topicsToFocus || ""}
            experience={sessionData.experience || "-"}
            questions={sessionData.questions?.length || "-"}
            description={sessionData.description || ""}
            lastUpdated={
              sessionData.updatedAt
                ? moment(sessionData.updatedAt).format("Do MMM YYYY")
                : ""
            }
          />
        )}

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Interview Q & A</h2>

          <AnimatePresence>
            {sessionData?.questions?.map((data, index) => (
              <motion.div
                key={data._id || index}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.4,
                  type: "spring",
                  stiffness: 100,
                  delay: index * 0.1,
                  damping: 15,
                }}
                layoutId={`question-${data._id || index}`}
              >
                <QuestionCard
                  question={data?.question}
                  answer={data?.answer}
                  isPinned={data?.isPinned}
                  onLearnMore={() => generateConceptExplanation(data.question)}
                  onTogglePin={() => toggleQuestionPinStatus(data._id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <Modal isOpen={isConceptModalOpen} onClose={() => setConceptModalOpen(false)}>
  <h3 className="text-lg font-semibold mb-4">Concept Explanation</h3>
  <div className="text-sm leading-relaxed whitespace-pre-wrap">
    {conceptExplanation}
  </div>
</Modal>

    </DashboardLayout>
  );
};

export default InterviewPrep;
