import Layout from "@/pages/admin/layout";
import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const SurveyTemplate = ({ surveyData, onDelete, editRedirect }) => {
    const [surveyQuestions, setSurveyQuestions] = useState(surveyData || []); // Fallback to empty array
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    
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
            onDelete(selectedQuestion); // Call parent delete handler
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
                        <h4 className="text-lg font-semibold"> {item.question}</h4>
                        <p className="text-md text-gray-600">{item.description}</p>
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg lg:w-[35%] lg:h-[15rem] justify-center flex flex-col items-center">
                        <h2 className="poppins-bold text-[1.3rem]">
                            {/* {surveyQuestions.find((q) => q.id === selectedQuestion)?.id}.{" "} */}
                            {surveyQuestions.find((q) => q.id === selectedQuestion)?.question}
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
