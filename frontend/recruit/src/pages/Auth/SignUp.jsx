import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/inputs/input";
import FileUploadProfile from "../../components/inputs/FileUploadProfile";
import { UserContext } from "../../context/UserContext";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import uploadImage from "../../utils/uploadimage";


const SignUp = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { updateUser } = useContext(UserContext);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      let uploadedImageUrl = "";

      if (profilePic) {
        uploadedImageUrl = await uploadImage(profilePic);
      }

      const payload = {
        name: fullName,
        email,
        password,
        profilePic: uploadedImageUrl,
      };

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, payload);
      const { success, user, token } = response.data;

      if (token && user) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h3 className="text-2xl font-bold text-center mb-2">Create Account</h3>
      <p className="text-sm text-gray-600 text-center mb-6">
        Please enter your details to sign up.
      </p>

      <form onSubmit={handleSignUp} className="space-y-4">
        <FileUploadProfile onFileChange={(file) => setProfilePic(file)} />

        <div>
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full mt-1 px-4 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Lav Tripathi"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 px-4 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Password</label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 text-white py-2 rounded-md font-medium hover:opacity-90 transition"
        >
          Sign Up
        </button>
      </form>

      <p className="text-sm mt-4 text-center">
        Already have an account?{" "}
        <button
          onClick={() => setCurrentPage("login")}
          className="text-orange-500 font-medium hover:underline"
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default SignUp;
