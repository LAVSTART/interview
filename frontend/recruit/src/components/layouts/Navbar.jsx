import React from 'react';
import ProfileInfoCard from "../ProfileInfoCard";
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="h-16 bg-white border-b border-gray-200/50 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-5">
        <Link to="/dashboard">
          <h2 className="text-lg md:text-xl font-medium text-black leading-5">
            Interview Prep AI
          </h2>
        </Link>
        <ProfileInfoCard />
      </div>
    </div>
  );
};

export default Navbar;
