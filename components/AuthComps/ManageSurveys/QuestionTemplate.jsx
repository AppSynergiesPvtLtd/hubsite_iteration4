import React, { useState } from "react";
import { useTranslation } from 'next-i18next'

const AddQuestionTemplate = ({
  questionData = {
    questionTitle: "",
    questionDescription: "",
    type: "SINGLE_SELECTION",
    options: [],
  },
  setQuestionData,
  loading,
  errorMessage,
  onSave,
  onReset,
  hasChanges, // Determines if unsaved changes exist
}) => {
  const [optionInput, setOptionInput] = useState("");
  const { t } = useTranslation('admin')

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuestionData((prev) => ({ ...prev, [name]: value }));
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

  return (
    <div className='flex justify-center'>
      <div className='w-full p-2 sm:p-6 border rounded-md shadow-md bg-white '>
        {errorMessage && (
          <div className='mb-4 p-4 bg-red-100 text-red-700 rounded-md'>
            {errorMessage}
          </div>
        )}

        {/* Question Title */}
        <div className='mb-6'>
          <label className='block text-lg font-medium text-gray-800'>
            {t('manageSurveys.editOnboardingQuestion.questionTitleLabel')}
          </label>
          <textarea
            name='questionTitle'
            rows='2'
            value={questionData?.questionTitle || ''}
            onChange={handleInputChange}
            className='w-full mt-2 p-3 border rounded-md'
            placeholder={t(
              'manageSurveys.editOnboardingQuestion.questionTitlePlaceholder'
            )}
          ></textarea>
        </div>

        {/* Question Description */}
        <div className='mb-6'>
          <label className='block text-lg font-medium text-gray-800'>
            {t('manageSurveys.editOnboardingQuestion.descriptionLabel')}
          </label>
          <textarea
            name='questionDescription'
            rows='2'
            value={questionData?.questionDescription || ''}
            onChange={handleInputChange}
            className='w-full mt-2 p-3 border rounded-md'
            placeholder={t(
              'manageSurveys.editOnboardingQuestion.descriptionPlaceholder'
            )}
          ></textarea>
        </div>

        {/* Type of Question */}
        <div className='mb-6'>
          <label className='block text-lg font-medium text-gray-800'>
            {t('manageSurveys.editOnboardingQuestion.questionTypeLabel')}
          </label>
          <select
            name='type'
            value={questionData?.type || 'SINGLE_SELECTION'}
            onChange={handleInputChange}
            className='p-3 border rounded-md w-full mt-2'
          >
            <option value='SINGLE_SELECTION'>
              {t('manageSurveys.editOnboardingQuestion.singleSelection')}
            </option>
            <option value='MULTIPLE_SELECTION'>
              {t('manageSurveys.editOnboardingQuestion.multipleSelection')}
            </option>
            <option value='TEXT'>
              {t('manageSurveys.editOnboardingQuestion.text')}
            </option>
          </select>
        </div>

        {/* Options (only for selection-based questions) */}
        {questionData?.type !== 'TEXT' && (
          <div className='mb-6'>
            <label className='block text-lg font-medium text-gray-800'>
              {t('manageSurveys.editOnboardingQuestion.optionsLabel')}
            </label>
            <div className='border sm:p-4 rounded-md '>
              {questionData?.options?.map((option, index) => (
                <div key={index} className='flex items-center gap-4 mb-2'>
                  <input
                    type='text'
                    value={option.label}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className='flex-grow p-2 border rounded-md'
                  />
                  <button
                    onClick={() => handleRemoveOption(index)}
                    className='text-red-500 text-sm'
                  >
                    {t('manageSurveys.editOnboardingQuestion.removeOption')}
                  </button>
                </div>
              ))}
              <div className='flex items-center gap-2 mt-4'>
                <input
                  type='text'
                  value={optionInput}
                  onChange={(e) => setOptionInput(e.target.value)}
                  className='flex-grow p-3 border rounded-md'
                  placeholder={t(
                    'manageSurveys.editOnboardingQuestion.newOptionPlaceholder'
                  )}
                />
                <button
                  onClick={handleAddOption}
                  className='text-[0.8rem] sm:px-4 py-2 bg-blue-600 text-white rounded-md'
                >
                  {t('manageSurveys.editOnboardingQuestion.addOption')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Save and Reset Buttons */}
        <div className='w-full flex justify-center gap-4'>
          <button
            onClick={onSave}
            className='w-[10rem] py-3 bg-blue-700 text-white rounded-md'
          >
            {questionData.id
              ? t('manageSurveys.editOnboardingQuestion.updateQuestion')
              : t('manageSurveys.editOnboardingQuestion.saveQuestion')}
          </button>
          <button
            onClick={onReset}
            disabled={!hasChanges}
            className={`w-[10rem] py-3 text-white rounded-md ${
              hasChanges
                ? 'bg-gray-500 hover:bg-gray-600'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {t('manageSurveys.editOnboardingQuestion.reset')}
          </button>
        </div>
      </div>
    </div>
  )
};

export default AddQuestionTemplate