// src/components/layouts/DashboardLayout.jsx
import React from "react";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-4">{children}</main>
    </div>
  );
};

export default DashboardLayout;
