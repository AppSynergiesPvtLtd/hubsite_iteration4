"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image"; // Assuming you might use it elsewhere or in StepTemplate
import { useSelector } from "react-redux";
import { useTranslation } from 'next-i18next'; // Import useTranslation

import StepTemplate from "@/components/Onboarding/Questions/StepTemplate"; // Assuming StepTemplate is also adapted or doesn't need translation directly here
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const QuestionsSurvey = () => {
  // --- Hooks ---
  const router = useRouter();
  const { t } = useTranslation('survey'); // Initialize useTranslation with the 'survey' namespace
  const { slug: surveyId } = router.query; // Get survey ID from dynamic route
  const user = useSelector((state) => state.user.user);
  const { id: u_id } = user || {}; // Add default empty object for safety on initial render

  // --- State ---
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- Effects ---
  useEffect(() => {
    const fetchSurveyQuestionsAndResponses = async () => {
      if (!u_id || !surveyId) {
          console.log("User ID or Survey ID not available yet.");
          return; // Don't fetch if user or survey ID isn't ready
      }
      try {
        setLoading(true);
        // Fetch survey questions and completions
        const surveyResponse = await axios.get(
          `${API_BASE_URL}/profile-survey/${surveyId}`,
          {
            params: {
              includeQuestions: true,
              includeCompletions: true,
            },
            headers: {
              "Content-Type": "application/json",
              "x-api-key": API_KEY,
              Authorization: `Bearer ${localStorage.getItem("user_token")}`,
            },
          }
        );

        const fetchedQuestions = surveyResponse.data.questions.map((q) => ({
          id: q.id,
          title: q.question, // Keep original title for reference if needed
          description: q.description, // Keep original description
          type:
            q.type === "TEXT"
              ? "textarea"
              : q.type === "SINGLE_SELECTION"
              ? "single"
              : "multi",
          fields:
            q.type === "TEXT"
              ? [{ name: "response", placeholder: t('slug.placeholderResponse') }] // Use translated placeholder
              : [],
          options:
            q.option?.map((opt) => ({
              id: opt.id,
              label: opt.label, // Assuming option labels might come pre-translated or handled differently
            })) || [],
          isRequired: q.isRequired,
        }));

        setQuestions(fetchedQuestions);

        // Fetch saved responses for each question
        const savedResponsesPromises = fetchedQuestions.map(question =>
          axios.get(
            `${API_BASE_URL}/response/${u_id}/question/${question.id}`,
            {
              headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY,
                Authorization: `Bearer ${localStorage.getItem("user_token")}`,
              },
            }
          ).then(response => ({ // Process successful response
            id: question.id,
            type: question.type,
            data: {
              selectedOptions: response.data?.selectedOptions?.map(opt => opt.optionId) || [],
              textAnswer: response.data?.textAnswer || "",
            },
          })).catch(error => { // Handle errors for individual response fetches
            console.error(t('slug.errorFetchSavedResponse', { questionId: question.id }), error);
            // Return a default structure even if fetch fails
            return {
              id: question.id,
              type: question.type,
              data: { selectedOptions: [], textAnswer: "" },
            };
          })
        );

        const resolvedResponses = await Promise.all(savedResponsesPromises);
        setResponses(resolvedResponses);

      } catch (error) {
        console.error(t('slug.errorFetchSurvey'), error);
        // Handle error fetching the main survey data (e.g., show an error message)
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyQuestionsAndResponses();
    // Add t to dependency array if translations could change dynamically, though usually not needed here
  }, [surveyId, u_id, t]); // Added t to dependencies as per eslint-plugin-react-hooks recommendation


  // --- Helper Functions ---
  const saveResponse = async (response) => {
    try {
      await axios.post(`${API_BASE_URL}/response/`, response, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
      });
      // console.log("Response saved successfully"); // Optional success log
    } catch (error) {
      console.error(t('slug.errorSaveResponse'), error);
      // Potentially show user feedback about save failure
    }
  };

  const handleDataChange = (data) => {
    setResponses((prev) =>
      prev.map((response) =>
        response.id === questions[currentStep - 1]?.id
          ? { ...response, data }
          : response
      )
    );
    // Clear error for the current step when data changes
    if (errors[currentStep]) {
        setErrors(prev => ({ ...prev, [currentStep]: undefined }));
    }
  };

  const validateStep = () => {
    const currentQuestion = questions[currentStep - 1];
    const currentResponse = responses.find(
      (response) => response.id === currentQuestion?.id
    );

    let stepErrors = {};
    if (
      currentQuestion?.isRequired &&
      (!currentResponse?.data ||
        (currentQuestion.type !== "textarea" &&
          (!currentResponse.data.selectedOptions ||
            currentResponse.data.selectedOptions.length === 0)) ||
        (currentQuestion.type === "textarea" &&
          (!currentResponse.data.textAnswer ||
            currentResponse.data.textAnswer.trim() === "")))
    ) {
      // Use the translated error message
      stepErrors = { selectedOption: t('slug.errorValidation') };
    }

    setErrors((prev) => ({ ...prev, [currentStep]: stepErrors }));
    return Object.keys(stepErrors).length === 0;
  };

  // --- Event Handlers ---
  const handleNext = async () => {
    if (validateStep()) {
      const currentQuestion = questions[currentStep - 1];
      const currentResponse = responses.find(
        (response) => response.id === currentQuestion?.id
      );

      // Save the current question's response
      if (currentResponse) {
        const payload = {
          questionId: currentResponse.id,
          selectedOptionIds: currentResponse.data?.selectedOptions || [],
          textAnswer: currentResponse.data?.textAnswer || "",
        };
        await saveResponse(payload); // Wait for save to complete
      }

      // If this is the last question, attempt to complete the survey
      if (currentStep === questions.length) {
        try {
          setLoading(true); // Show loading indicator during submission
          await axios.post(
            `${API_BASE_URL}/response/complete-survey`,
            { profileSurveyId: surveyId }, // Ensure surveyId is passed correctly
            {
              headers: {
                "Content-Type": "application/json", // Ensure content type is set
                "x-api-key": API_KEY,
                Authorization: `Bearer ${localStorage.getItem("user_token")}`,
              },
            }
          );
          setIsSubmitted(true); // Update the UI to show the completion screen
        } catch (error) {
          console.error(t('slug.errorCompleteSurvey'), error);
          // Optionally show an error message to the user
        } finally {
          setLoading(false);
        }
      } else {
        // Move to the next question
        setCurrentStep((prev) => prev + 1);
        setErrors( prev => ({...prev, [currentStep + 1]: undefined})); // Clear errors for the next step
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // --- Render Logic ---
  if (loading && !isSubmitted) { // Show loading only if not already submitted
    // Basic loading indicator - replace with a proper spinner component if available
    return <div className="flex justify-center items-center h-screen">{t('slug.loading')}</div>;
  }

  if (isSubmitted) {
    // Render completion screen
    return (
      <div className="flex flex-col items-center justify-center text-center p-10">
         {/* You might want an icon here */}
         <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
         </svg>
        <h1 className="text-3xl font-bold text-[#0057A1] mb-4">{t('slug.surveyCompletedTitle')}</h1>
        <p className="text-lg text-gray-600 mb-8">{t('slug.surveyCompletedDescription')}</p>
        <button
          onClick={() => router.push("/dashboard")} // Navigate to dashboard
          className="bg-[#0057A1] text-white px-12 py-3 hover:bg-blue-700 transition rounded-lg shadow-md" // Adjusted styling
        >
          {t('slug.goToDashboard')}
        </button>
      </div>
    );
  }

  // Render survey steps
  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto"> {/* Added padding and max-width */}
      {/* Progress Indicator */}
      <div className="flex items-center gap-2 mb-6">
        <span className="bg-[#0057A1] text-white px-3 py-1 rounded-md font-medium text-sm">
          {currentStep}/{questions.length}
        </span>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className="bg-[#0057A1] h-2.5 rounded-full transition-width duration-500 ease-in-out" // Added transition
            style={{ width: `${(currentStep / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Title */}
      <h2 className="text-[#0057A1] text-xl md:text-2xl font-bold mb-4">
        {/* Use translation for the question title, passing currentStep */}
        {t('slug.questionTitle', { currentStep })}
      </h2>

      {/* Render the current question using StepTemplate */}
      {questions[currentStep - 1] && (
        <StepTemplate
          key={questions[currentStep - 1].id} // Add key for React list rendering efficiency
          stepData={questions[currentStep - 1]}
          initialData={
            responses.find(
              (response) => response.id === questions[currentStep - 1]?.id
            )?.data
          }
          onDataChange={handleDataChange}
          // Pass t function if StepTemplate also needs translations
          // t={t}
        />
      )}

      {/* Validation Error Message */}
      {errors[currentStep]?.selectedOption && (
        <p className="text-red-600 mt-2 text-sm">{errors[currentStep]?.selectedOption}</p>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8 mb-4">
        <button
          onClick={handlePrevious}
          className={`px-6 py-2 rounded-md transition text-sm font-medium ${
            currentStep === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300" // Adjusted previous button style
          }`}
          disabled={currentStep === 1}
        >
          {t('slug.previousButton')}
        </button>
        <button
          onClick={handleNext}
          className="bg-[#0057A1] text-white px-6 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium shadow" // Added shadow
          disabled={loading} // Disable button while loading next step/submitting
        >
          {/* Show different text for the last step */}
          {loading ? t('slug.loading') : (currentStep === questions.length ? t('slug.submitButton') : t('slug.nextButton'))}
        </button>
      </div>
    </div>
  );
};

export default QuestionsSurvey; // Default export remains the same

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'survey'])),
    },
  }
}
