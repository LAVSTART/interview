import React, { useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";

const FileUploadProfile = ({ onFileChange }) => {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    onFileChange(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex items-center gap-4">
      {/* Profile Preview */}
      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="w-16 h-16 rounded-full object-cover border border-gray-300"
        />
      ) : (
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xs border">
          No Photo
        </div>
      )}

      {/* Hidden File Input and Icon */}
      <div className="relative">
        <button
          type="button"
          onClick={handleIconClick}
          className="text-orange-500 hover:text-orange-600 text-xl"
          title="Upload Profile Picture"
        >
          <FaCamera />
        </button>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default FileUploadProfile;
