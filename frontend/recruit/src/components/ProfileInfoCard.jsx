// src/components/ProfileInfoCard.jsx
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearUser();
    navigate("/"); // Navigate back to landing after logout
  };
  console.log("👤 User Info:", user);
  if (!user) return null;

  return (
     
    
    <div className="flex items-center space-x-4">
      
      <img
  src={`http://localhost:8000/${user.profileImageUrl}`}
  alt="profile"
  className="w-10 h-10 rounded-full object-cover"
/>

      <span className="font-medium">{user.name}</span>
      <button
        onClick={handleLogout}
        className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default ProfileInfoCard;
