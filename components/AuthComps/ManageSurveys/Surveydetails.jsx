import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const SurveyTemplate = ({ surveyData, onDelete, editRedirect, showStatus = true }) => {
  const [surveyQuestions, setSurveyQuestions] = useState(surveyData || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // Update local state when surveyData prop changes
  useEffect(() => {
    setSurveyQuestions(surveyData);
  }, [surveyData]);

  const openModal = (questionId) => {
    setIsModalOpen(true);
    setSelectedQuestion(questionId);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedQuestion(null);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(selectedQuestion);
    }
    setSurveyQuestions(surveyQuestions.filter((q) => q.id !== selectedQuestion));
    closeModal();
  };

  return (
    <div className="p-5 md:w-[99%]">
      {surveyQuestions.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center border-b border-gray-300 py-4"
        >
          <div>
            <div className="flex flex-col gap-2">
              <h4 className="text-lg font-semibold">{item.question}</h4>
              {showStatus && (
                <div className="flex gap-2">
                  <span>status: </span>
                  <div
                    className={`px-2 py-1 text-xs w-fit font-semibold rounded-full ${
                      item.isActive
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {item.isActive ? "Active" : "Inactive"}
                  </div>
                </div>
              )}
            </div>
            <p className="text-md text-gray-600 mt-3">{item.description}</p>
          </div>
          <div className="flex space-x-4 justify-center items-center">
            <button
              className="text-[#0057A1] text-xl hover:text-[#1f7bccee] transition-colors"
              aria-label="Edit"
              onClick={() => editRedirect(item.id)}
            >
              <FaEdit />
            </button>
            <button
              className="text-[#0057A1] text-xl hover:text-[#1f7bccee] transition-colors"
              aria-label="Delete"
              onClick={() => openModal(item.id)}
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ))}

      {/* Modal for deletion confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Semi-transparent backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={closeModal}
          />
          {/* Modal content */}
          <div className="relative bg-white p-6 rounded-lg shadow-lg lg:w-[35%] lg:h-[15rem] flex flex-col items-center justify-center">
            <h2 className="poppins-bold text-[1.3rem]">
              {
                surveyQuestions.find((q) => q.id === selectedQuestion)
                  ?.question
              }
            </h2>
            <p className="text-[1.3rem] text-gray-600 mb-4">
              Are you sure you want to delete this question?
            </p>
            <div className="flex justify-center w-full space-x-4 mt-5">
              <button
                onClick={closeModal}
                className="w-[30%] py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="w-[30%] py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyTemplate;
