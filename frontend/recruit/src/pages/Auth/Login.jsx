import { useState, useContext } from "react";

import { useNavigate } from "react-router-dom";
import Input from "../../components/inputs/input";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContext"; // Corrected path

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { updateUser } = useContext(UserContext); // Access updateUser from context

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token } = response.data;

      // Save token to localStorage
      localStorage.setItem("token", token);

      // ✅ Fetch user profile using the token
      const profileResponse = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
      updateUser(profileResponse.data.user); // Update user in context

      // ✅ Navigate to dashboard
      navigate("/dashboard");

    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h3 className="text-2xl font-bold text-center mb-2">Welcome Back</h3>
      <p className="text-sm text-gray-600 text-center mb-6">
        Please enter your details to login.
      </p>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
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
          Login
        </button>
      </form>

      <p className="text-sm mt-4 text-center">
        Don’t have an account?{" "}
        <button
          onClick={() => setCurrentPage("signup")}
          className="text-orange-500 font-medium hover:underline"
        >
          Sign up
        </button>
      </p>
    </div>
  );
};

export default Login;