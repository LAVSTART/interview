import React from "react";

const RoleInfoHeader = ({
  role,
  experience,
  topicsToFocus,
  questions,
  description,
  lastUpdated,
}) => {
  if (!role && !experience && !topicsToFocus && !questions && !lastUpdated) {
    return null; // Don't render if nothing is passed
  }

  return (
<div className="bg-gradient-to-r from-white via-blue-50 to-purple-100 shadow-md rounded-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Left Side: Role and topics */}
        <div>
          <h1 className="text-2xl font-bold">{role}</h1>
          {topicsToFocus && (
            <p className="text-gray-500 mt-1">{topicsToFocus}</p>
          )}
          {description && (
            <p className="text-sm text-gray-600 mt-2">{description}</p>
          )}
        </div>

        {/* Right Side: Stats */}
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          <span className="bg-black text-white px-4 py-1 rounded-full text-sm">
            Experience: {experience || "-"}
          </span>
          <span className="bg-black text-white px-4 py-1 rounded-full text-sm">
            {questions} Q&A
          </span>
          <span className="bg-black text-white px-4 py-1 rounded-full text-sm">
            Last Updated: {lastUpdated || "-"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RoleInfoHeader;
