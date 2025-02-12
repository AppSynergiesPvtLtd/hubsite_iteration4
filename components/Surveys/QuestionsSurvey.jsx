"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import StepTemplate from "../Onboarding/Questions/StepTemplate";
import { useSelector } from "react-redux";

const API_BASE_URL= process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const QuestionsSurvey = () => {
  const router = useRouter();
  const { id: surveyId } = router.query; // Survey ID from query parameters
  const user = useSelector((state) => state.user.user);
  const { id: u_id } = user;

  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurveyQuestions = async () => {
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
              Authorization: `Bearer ${localStorage.getItem("token")}`,
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
              ? [{ name: "response", placeholder: "Enter your response here" }]
              : [],
          options:
            q.option?.map((opt) => ({
              id: opt.id,
              label: opt.label,
            })) || [],
          isRequired: q.isRequired,
        }));

        setQuestions(fetchedQuestions);

        // Fetch saved responses
        const savedResponses = [];
        for (const question of fetchedQuestions) {
          try {
            const response = await axios.get(
              `${API_BASE_URL}/response/${u_id}/question/${question.id}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  "x-api-key": API_KEY,
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            if (response.data) {
              savedResponses.push({
                id: question.id,
                type: question.type,
                data: {
                  selectedOptions: response.data.selectedOptions?.map(
                    (opt) => opt.optionId
                  ) || [],
                  textAnswer: response.data.textAnswer || "",
                },
              });
            } else {
              savedResponses.push({
                id: question.id,
                type: question.type,
                data: { selectedOptions: [], textAnswer: "" },
              });
            }
          } catch (error) {
            console.error(
              `Error fetching saved response for question ${question.id}:`,
              error
            );
            savedResponses.push({
              id: question.id,
              type: question.type,
              data: { selectedOptions: [], textAnswer: "" },
            });
          }
        }

        setResponses(savedResponses);
      } catch (error) {
        console.error("Error fetching survey questions or responses:", error);
      } finally {
        setLoading(false);
      }
    };

    if (surveyId) {
      fetchSurveyQuestions();
    }
  }, [surveyId, u_id]);

  const saveResponse = async (response) => {
    try {
      await axios.post(`${API_BASE_URL}/response/`, response, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (error) {
      console.error("Error saving response:", error);
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
      stepErrors = { selectedOption: "Please provide an answer." };
    }

    setErrors((prev) => ({ ...prev, [currentStep]: stepErrors }));
    return Object.keys(stepErrors).length === 0;
  };

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
        setIsSubmitted(true);
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isSubmitted) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[80vh] text-center gap-6">
        <div className="w-[150px] h-[150px] relative">
          <Image
            src="/SurveryComplete.png"
            alt="Gift Icon"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <h2 className="text-[#0057A1] text-[28px] md:text-[36px] font-bold">
          Completed Survey!
        </h2>
        <p className="text-gray-600 text-lg">
          Successfully Received {surveyId && "Hubcoins"}.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-[#0057A1] text-white px-12 py-3 hover:bg-blue-600 transition rounded-2xl"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="w-[95%] md:w-[85%] mx-auto">
      <div className="w-full flex justify-center mb-8">
        <div className="w-[250px] h-[60px] md:w-[280px] md:h-[80px] relative">
          <Image
            src="/navbar_logo.png"
            alt="Hubsite Social Logo"
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 mb-6">
        <span className="bg-[#0057A1] text-white px-3 py-1 rounded-md font-medium">
          {currentStep}/{questions.length}
        </span>
        <div className="w-full md:w-[60%] bg-gray-300 rounded-full h-2.5">
          <div
            className="bg-[#0057A1] h-2.5 rounded-full"
            style={{ width: `${(currentStep / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <h2 className="text-[#0057A1] text-[25px] md:text-[28px] font-bold mb-3">
        Question {currentStep}
      </h2>

      {questions[currentStep - 1] && (
        <StepTemplate
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
        <p className="text-red-500">{errors[currentStep]?.selectedOption}</p>
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrevious}
          className={`px-6 py-2 rounded-md transition ${
            currentStep === 1
              ? "bg-gray-500 text-white cursor-not-allowed"
              : "bg-[#0057A1] text-white hover:bg-gray-700"
          }`}
          disabled={currentStep === 1}
        >
          ← Previous
        </button>
        <button
          onClick={handleNext}
          className="bg-[#0057A1] text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
        >
          {currentStep === questions.length ? "Submit" : "Next →"}
        </button>
      </div>
    </div>
  );
};

export default QuestionsSurvey;
