import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import StepTemplate from "@/components/Onboarding/Questions/StepTemplate";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const QuestionsSurvey = () => {
  // --- Hooks ---
  const router = useRouter();
  const { t } = useTranslation('survey');
  const { slug: surveyId } = router.query;
  const user = useSelector((state) => state.user.user);
  const { id: u_id } = user || {};

  // --- State ---
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log('New change v2');
  


  // --- Effects ---
  useEffect(() => {
    const fetchSurveyQuestionsAndResponses = async () => {
      if (!u_id || !surveyId) {
        console.log("User ID or Survey ID not available yet.");
        return;
      }
      try {
        setLoading(true);
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
          title: q.question,
          description: q.description,
          type:
            q.type === "TEXT"
              ? "textarea"
              : q.type === "SINGLE_SELECTION"
              ? "single"
              : "multi",
          fields:
            q.type === "TEXT"
              ? [{ name: "response", placeholder: t('slug.placeholderResponse') }]
              : [],
          options:
            q.option?.map((opt) => ({
              id: opt.id,
              label: opt.label,
            })) || [],
          isRequired: q.isRequired,
        }));

        setQuestions(fetchedQuestions);

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
          ).then(response => ({
            id: question.id,
            type: question.type,
            data: {
              selectedOptions: response.data?.selectedOptions?.map(opt => opt.optionId) || [],
              textAnswer: response.data?.textAnswer || "",
            },
          })).catch(error => {
            console.error(t('slug.errorFetchSavedResponse', { questionId: question.id }), error);
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
      } finally {
        setLoading(false);
      }
    };

    if (u_id && surveyId) {
      fetchSurveyQuestionsAndResponses();
    }
  }, [surveyId, u_id, t]);


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
    } catch (error) {
      console.error(t('slug.errorSaveResponse'), error);
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

      if (currentResponse) {
        const payload = {
          questionId: currentResponse.id,
          selectedOptionIds: currentResponse.data?.selectedOptions || [],
          textAnswer: currentResponse.data?.textAnswer || "",
        };
        await saveResponse(payload);
      }

      if (currentStep === questions.length) {
        try {
          setLoading(true);
          await axios.post(
            `${API_BASE_URL}/response/complete-survey`,
            { profileSurveyId: surveyId },
            {
              headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY,
                Authorization: `Bearer ${localStorage.getItem("user_token")}`,
              },
            }
          );
          setIsSubmitted(true);
        } catch (error) {
          console.error(t('slug.errorCompleteSurvey'), error);
        } finally {
          setLoading(false);
        }
      } else {
        setCurrentStep((prev) => prev + 1);
        setErrors( prev => ({...prev, [currentStep + 1]: undefined}));
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // --- Render Logic ---
  if (loading && !isSubmitted) {
    return <div className="flex justify-center items-center h-screen">{t('slug.loading')}</div>;
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="text-3xl font-bold text-[#0057A1] mb-4">{t('slug.surveyCompletedTitle')}</h1>
        <p className="text-lg text-gray-600 mb-8">{t('slug.surveyCompletedDescription')}</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-[#0057A1] text-white px-12 py-3 hover:bg-blue-700 transition rounded-lg shadow-md"
        >
          {t('slug.goToDashboard')}
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <span className="bg-[#0057A1] text-white px-3 py-1 rounded-md font-medium text-sm">
          {currentStep}/{questions.length}
        </span>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className="bg-[#0057A1] h-2.5 rounded-full transition-width duration-500 ease-in-out"
            style={{ width: `${(currentStep / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <h2 className="text-[#0057A1] text-xl md:text-2xl font-bold mb-4">
        {t('slug.questionTitle', { currentStep })}
      </h2>

      {questions[currentStep - 1] && (
        <StepTemplate
          key={questions[currentStep - 1].id}
          stepData={questions[currentStep - 1]}
          initialData={
            responses.find(
              (response) => response.id === questions[currentStep - 1]?.id
            )?.data
          }
          onDataChange={handleDataChange}
        />
      )}

      {errors[currentStep]?.selectedOption && (
        <p className="text-red-600 mt-2 text-sm">{errors[currentStep]?.selectedOption}</p>
      )}

      <div className="flex justify-between mt-8 mb-4">
        <button
          onClick={handlePrevious}
          className={`px-6 py-2 rounded-md transition text-sm font-medium ${
            currentStep === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          disabled={currentStep === 1}
        >
          {t('slug.previousButton')}
        </button>
        <button
          onClick={handleNext}
          className="bg-[#0057A1] text-white px-6 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium shadow"
          disabled={loading}
        >
          {loading ? t('slug.loading') : (currentStep === questions.length ? t('slug.submitButton') : t('slug.nextButton'))}
        </button>
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  // This function tells Next.js which dynamic paths to pre-render
  return {
    // Since the survey IDs are fetched at runtime based on the authenticated user,
    // we'll use fallback: 'blocking' to render pages on-demand if they aren't pre-rendered
    paths: [],
    fallback: 'blocking', // or 'true' if you want to show a loading state
  };
}

export async function getStaticProps({ locale, params }) {
  // Extract the first element of the slug array
  // When using [...slug], params.slug will be an array
  const slug = params.slug[0];

  return {
    props: {
      surveyId: slug,
      ...(await serverSideTranslations(locale, ['common', 'survey'])),
    },
  };
}

export default QuestionsSurvey;