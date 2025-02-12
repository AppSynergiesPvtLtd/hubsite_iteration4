import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import StepTemplate from "./StepTemplate";
import { useSelector } from "react-redux";
import Spinner from "@/components/Spinner";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const Questions = ({ onComplete }) => {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user.user);
  const { id: u_id } = user;

  useEffect(() => {
    const fetchQuestionsAndResponses = async () => {
      try {
        setLoading(true);

        // Fetch questions
        const questionsResponse = await axios.get(
          `${API_BASE_URL}/questions/onboarding`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": API_KEY,
              Authorization: `Bearer ${localStorage.getItem("user_token")}`,
            },
          }
        );

        if (questionsResponse.data && questionsResponse.data.data) {
          const fetchedQuestions = questionsResponse.data.data.map((q) => ({
            id: q.id,
            title: q.question,
            description: q.description,
            // Convert API types to local types; note that "TEXT" becomes "textarea"
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
            // Use the API's isRequired flag if available; otherwise, assume required
            isRequired: q.isRequired !== undefined ? q.isRequired : true,
          }));

          setQuestions(fetchedQuestions);

          // Fetch saved responses for all questions
          const savedResponses = [];
          for (const question of fetchedQuestions) {
            try {
              const response = await axios.get(
                `${API_BASE_URL}/response/${u_id}/question/${question.id}`,
                {
                  headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                    Authorization: `Bearer ${localStorage.getItem("user_token")}`,
                  },
                }
              );

              if (response.data) {
                savedResponses.push({
                  id: question.id,
                  type: question.type,
                  data: {
                    selectedOptions:
                      response.data.selectedOptions?.map((opt) => opt.optionId) || [],
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
        }
      } catch (error) {
        console.error("Error fetching questions or responses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionsAndResponses();
  }, [u_id]);

  // Function to save the current response
  const saveResponse = async (responsePayload) => {
    try {
      await axios.post(`${API_BASE_URL}/response/`, responsePayload, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
      });
    } catch (error) {
      console.error("Error saving response:", error);
    }
  };

  // Update responses state when the child component changes data
  const handleDataChange = (data) => {
    setResponses((prev) =>
      prev.map((response) =>
        response.id === questions[currentStep - 1]?.id
          ? { ...response, data }
          : response
      )
    );
  };

  // Validate the current step before moving on
  const validateStep = () => {
    const currentQuestion = questions[currentStep - 1];
    const currentResponse = responses.find(
      (response) => response.id === currentQuestion?.id
    );

    let isValid = true;
    let stepErrors = {};

    if (currentQuestion?.isRequired) {
      if (currentQuestion.type === "textarea") {
        // For text responses, check that textAnswer is nonempty
        if (
          !currentResponse?.data?.textAnswer ||
          currentResponse.data.textAnswer.trim() === ""
        ) {
          stepErrors.textAnswer = "Please provide an answer.";
          isValid = false;
        }
      } else {
        // For selection questions, ensure at least one option is selected
        if (
          !currentResponse?.data?.selectedOptions ||
          currentResponse.data.selectedOptions.length === 0
        ) {
          stepErrors.selectedOptions = "Please select an option.";
          isValid = false;
        }
      }
    }

    setErrors((prev) => ({ ...prev, [currentStep]: stepErrors }));
    return isValid;
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
        if (onComplete) onComplete();
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
    return <Spinner />;
  }

  if (isSubmitted) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[80vh] text-center gap-6">
        <div className="w-[150px] h-[150px] relative">
          <Image
            src="/SurveryComplete.png"
            alt="Survey Complete"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <h2 className="text-[#0057A1] text-[28px] md:text-[36px] font-bold">
          Completed Survey!
        </h2>
        <p className="text-gray-600 text-lg">
          Successfully Received 10 HUBCOINS.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-[#0057A1] text-white px-12 poppins-bold py-3 hover:bg-blue-600 transition rounded-2xl"
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

      <h2 className="text-[#0057A1] text-[25px] md:text-[28px] poppins-bold mb-3">
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

      {errors[currentStep] && (
        <div className="text-red-500">
          {errors[currentStep].textAnswer || errors[currentStep].selectedOptions}
        </div>
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

export default Questions;

