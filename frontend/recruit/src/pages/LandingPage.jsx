import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect, useContext } from "react";
import ParticleBackground from "../components/ParticleBackground";
import Modal from "../components/Modal";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import { UserContext } from "../context/UserContext";
import ProfileInfoCard from "../components/ProfileInfoCard";

const words = ["AI", "Powered"];
const fullText = words.join(" ");

const LandingPage = () => {
  const navigate = useNavigate();
  const featureRef = useRef();

  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");
  const [typedText, setTypedText] = useState("");
  const [index, setIndex] = useState(0);

  const { user, loading } = useContext(UserContext);

  const handleScrollToFeatures = () => {
    featureRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText((prev) => prev + fullText.charAt(index));
        setIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [index]);

  return (
    <div>
      <ParticleBackground />

      <div className="w-full min-h-screen bg-[#FFFCEF] text-black relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 flex justify-between items-center pt-8">
          <div className="text-xl md:text-2xl font-extrabold">AIcruit</div>

          <div className="flex gap-4">
            {loading ? null : user ? (
              <ProfileInfoCard />
            ) : (
              <>
                <button
                  onClick={() => {
                    setCurrentPage("login");
                    setOpenAuthModal(true);
                  }}
                  className="bg-white border border-orange-400 text-orange-500 px-4 py-2 rounded-md font-semibold text-sm hover:bg-orange-50 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setCurrentPage("signup");
                    setOpenAuthModal(true);
                  }}
                  className="bg-gradient-to-r from-[#FF9324] to-[#e99a4b] text-white px-4 py-2 rounded-md font-semibold text-sm hover:opacity-90 transition"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <div className="container mx-auto px-4 text-center mt-20 md:mt-36">
          <div className="inline-block bg-yellow-200 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            AI Powered
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight max-w-3xl mx-auto mb-6">
            Ace Interviews with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
              {typedText}
            </span>{" "}
            Learning
          </h1>

          <p className="max-w-2xl mx-auto text-gray-700 text-base md:text-lg mb-8">
            Get role-specific questions, expand answers with AI help, and master interviews — your ultimate prep toolkit is here.
          </p>
          <button
            onClick={handleScrollToFeatures}
            className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition"
          >
            Get Started
          </button>
        </div>

        {/* Background blur */}
        <div className="w-[500px] h-[500px] bg-amber-200/20 blur-[65px] absolute top-0 left-1/2 -translate-x-1/2 -z-10" />
      </div>

      {/* Features Section */}
      <section ref={featureRef} className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-10">Why Prep with Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "AI Mock Interviews",
                desc: "Simulate real interviews with instant AI feedback on your answers.",
              },
              {
                title: "DSA & Coding Practice",
                desc: "Solve structured coding problems with hints and explanations.",
              },
              {
                title: "Behavioral Q&A",
                desc: "Answer soft-skill questions and improve delivery with feedback.",
              },
              {
                title: "Track Your Progress",
                desc: "Monitor your performance, review past answers, and grow consistently.",
              },
              {
                title: "Role-Based Questions",
                desc: "Target specific domains like frontend, backend, ML, and more.",
              },
              {
                title: "Gemini AI Assistance",
                desc: "Powered by Google Gemini — get smarter suggestions and improvements.",
              },
            ].map((f, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-xl p-6 text-left shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("login");
        }}
      >
        <div>
          {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
          {currentPage === "signup" && <SignUp setCurrentPage={setCurrentPage} />}
        </div>
      </Modal>
    </div>
  );
};

export default LandingPage;
