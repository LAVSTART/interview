import React from "react";
import { createPortal } from "react-dom";

const Modal = ({ isOpen, onClose, children, hideHeader = false }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-xl shadow-lg max-w-md w-full mx-4">
        {/* Close Button */}
        {!hideHeader && (
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl font-bold"
            aria-label="Close Modal"
          >
            &times;
          </button>
        )}

        {/* Modal Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
