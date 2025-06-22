import React from "react";
import { FaTrashAlt } from "react-icons/fa";

const SummaryCard = ({
  role,
  topicsToFocus,
  experience,
  questions,
  description,
  lastUpdated,
  onSelect,
  onDelete,
}) => {
  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent card click
    if (window.confirm("Are you sure you want to delete this session?")) {
      onDelete();
    }
  };

  return (
    <div
      onClick={onSelect}
      className="relative cursor-pointer bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition border border-gray-200"
    >
      {/* Delete Button */}
      <button
        onClick={handleDeleteClick}
        className="absolute top-3 right-3 text-red-500 hover:text-red-700"
        title="Delete"
      >
        <FaTrashAlt size={16} />
      </button>

      <div className="mb-2">
        <h2 className="text-lg font-semibold text-gray-800 capitalize">{role}</h2>
        <p className="text-sm text-gray-600 italic">{topicsToFocus}</p>
      </div>

      <div className="mb-3 text-sm text-gray-700 line-clamp-3">
        {description || "No description provided."}
      </div>

      <div className="flex justify-between text-xs text-gray-500 mt-4">
        <span className="font-medium">Experience: {experience}</span>
        <span>{questions} Q&A</span>
        <span>{lastUpdated}</span>
      </div>
    </div>
  );
};

export default SummaryCard;
