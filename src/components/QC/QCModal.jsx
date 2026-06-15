import React from "react";

const QCModal = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div style={{marginTop:"10vh"}} className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#032B4E]/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal container */}
      <div className="relative z-10 w-[92%] max-w-8xl max-h-[80vh] overflow-y-auto rounded-2xl bg-white shadow-2xl animate-scaleIn">
        {/* Header */}
        {/* <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
          <h2 className="text-xl font-semibold text-[#032B4E]">
            Quality Check Dashboard
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-sm text-gray-500 hover:bg-gray-100"
          >
            ✕
          </button>
        </div> */}

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default QCModal;
