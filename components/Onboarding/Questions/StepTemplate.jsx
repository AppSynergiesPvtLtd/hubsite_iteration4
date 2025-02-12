import React, { useState, useEffect } from "react";

const StepTemplate = ({ stepData, initialData, onDataChange }) => {
  const [formData, setFormData] = useState({});

  // Initialize formData with initialData
  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  // Notify parent of changes in formData
  const handleDataChange = (updatedData) => {
    setFormData(updatedData);
    onDataChange(updatedData); // Notify the parent component only when data explicitly changes
  };

  // Handle input or textarea changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleDataChange({ ...formData, [name]: value });
  };

  // Handle option selection
  const handleOptionSelect = (option) => {
    if (stepData.type === "multi") {
      // For multi-selection, toggle the selected option
      handleDataChange({
        ...formData,
        selectedOptions: formData.selectedOptions?.includes(option.id)
          ? formData.selectedOptions.filter((id) => id !== option.id) // Remove if already selected
          : [...(formData.selectedOptions || []), option.id], // Add if not selected
      });
    } else {
      // For single selection, only allow one selected option
      handleDataChange({ selectedOptions: [option.id] });
    }
  };

  return (
    <div className="flex flex-col gap-6 min-h-[50vh]">
      <h2 className="text-[#0057A1] text-[25px] font-bold">{stepData.title}</h2>
      {stepData.description && (
        <p className="text-gray-600 text-[18px]">{stepData.description}</p>
      )}

      {/* Text Input (Textarea) */}
      {stepData.type === "textarea" && (
        <textarea
          name="textAnswer"
          placeholder={stepData.fields[0]?.placeholder || "Enter text here"}
          value={formData.textAnswer || ""}
          onChange={handleInputChange}
          rows="4"
          className="border border-gray-300 rounded-md p-3 w-full"
        />
      )}

      {/* Options (Single/Multi-Selection) */}
      {(stepData.type === "multi" || stepData.type === "single") && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {stepData.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option)}
              className={`border rounded-md p-3 text-center font-medium transition ${
                formData.selectedOptions?.includes(option.id)
                  ? "bg-[#0057A1] text-white border-[#0057A1]" // Selected
                  : "bg-white text-black border-gray-300 hover:border-gray-500" // Default
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StepTemplate;
