import React, { useState, useEffect } from "react";

const AddQuestionTemplate = ({
  questionData = { questionTitle: "", questionDescription: "", type: "SINGLE_SELECTION", options: [] }, // Default structure
  setQuestionData,
  loading,
  errorMessage,
  onSave,
}) => {
  const [optionInput, setOptionInput] = useState("");
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuestionData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddOption = () => {
    if (!optionInput.trim()) {
      console.error("Option cannot be empty.");
      return;
    }
    const newOption = {
      value: optionInput.toLowerCase().replace(/\s+/g, "_"),
      label: optionInput,
      order: questionData.options.length,
    };
    setQuestionData((prev) => ({
      ...prev,
      options: [...prev.options, newOption],
    }));
    setOptionInput("");
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...questionData.options];
    updatedOptions[index] = {
      ...updatedOptions[index],
      label: value,
      value: value.toLowerCase().replace(/\s+/g, "_"),
    };
    setQuestionData((prev) => ({ ...prev, options: updatedOptions }));
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = questionData.options.filter((_, i) => i !== index);
    setQuestionData((prev) => ({ ...prev, options: updatedOptions }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="w-full p-6 border rounded-md shadow-md bg-white">
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {errorMessage}
          </div>
        )}

        {/* Question Title */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-800">
            Question Title*
          </label>
          <textarea
            name="questionTitle"
            rows="2"
            value={questionData?.questionTitle || ""}
            onChange={handleInputChange}
            className="w-full mt-2 p-3 border rounded-md"
            placeholder="Enter your question title here..."
          ></textarea>
        </div>

        {/* Question Description */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-800">
            Description
          </label>
          <textarea
            name="questionDescription"
            rows="2"
            value={questionData?.questionDescription || ""}
            onChange={handleInputChange}
            className="w-full mt-2 p-3 border rounded-md"
            placeholder="Enter question description..."
          ></textarea>
        </div>

        {/* Type of Question */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-800">
            Type of Question*
          </label>
          <select
            name="type" // Use `type` instead of `questionType`
            value={questionData?.type || "SINGLE_SELECTION"}
            onChange={handleInputChange}
            className="p-3 border rounded-md w-full mt-2"
          >
            <option value="SINGLE_SELECTION">Single Selection</option>
            <option value="MULTIPLE_SELECTION">Multiple Selection</option>
            <option value="TEXT">Text</option>
          </select>
        </div>

        {/* Options */}
        {questionData?.type !== "TEXT" && (
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-800">
              Options
            </label>
            <div className="border p-4 rounded-md">
              {questionData?.options?.map((option, index) => (
                <div key={index} className="flex items-center gap-4 mb-2">
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-grow p-2 border rounded-md"
                  />
                  <button
                    onClick={() => handleRemoveOption(index)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-4">
                <input
                  type="text"
                  value={optionInput}
                  onChange={(e) => setOptionInput(e.target.value)}
                  className="flex-grow p-3 border rounded-md"
                  placeholder="Enter a new option..."
                />
                <button
                  onClick={handleAddOption}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Add Option
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="w-full flex justify-center">
          <button
            onClick={onSave}
            className="w-[10rem] py-3 bg-blue-700 text-white rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionTemplate;
