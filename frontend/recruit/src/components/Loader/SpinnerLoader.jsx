import React from "react";

const SpinnerLoader = ({ size = "md", color = "black" }) => {
  const sizeClass = size === "sm" ? "h-4 w-4" : "h-6 w-6";
  const colorClass = color === "white" ? "border-white" : "border-black";

  return (
    <div
      className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClass} ${colorClass}`}
    />
  );
};

export default SpinnerLoader;
