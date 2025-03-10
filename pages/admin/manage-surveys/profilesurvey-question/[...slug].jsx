import React, { useState, useEffect } from "react";
import Layout from "../../layout";
import AddQuestionTemplate from "@/components/AuthComps/ManageSurveys/QuestionTemplate";
import axios from "axios";
import { useRouter } from "next/router";
import AdminRoutes from "@/pages/adminRoutes";
import { useDispatch } from "react-redux";
import {
  clearTitle,
  hideAdd,
  hideExcel,
  hideRefresh,
  setTitle,
  showAdd,
  showRefresh,
} from "@/store/adminbtnSlice";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// Default question structure for new questions.
const defaultQuestionData = {
  questionTitle: "",
  questionDescription: "",
  isRequired: true,
  forOnboarding: false,
  type: "SINGLE_SELECTION",
  options: [],
};

const EditSurveyQuestion = () => {
  const router = useRouter();
  const { slug: surveyId, questionId } = router.query;

  // Manage both current question data and its initial state (for change detection).
  const [questionData, setQuestionData] = useState(defaultQuestionData);
  const [initialQuestionData, setInitialQuestionData] = useState(defaultQuestionData);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTitle("Add Profile Survey Question"));
    // Clean up on unmount.
    return () => {
      dispatch(hideAdd());
      dispatch(hideRefresh());
      dispatch(hideExcel());
      dispatch(clearTitle());
    };
  }, [dispatch, router.asPath]);

  // Helper function to fetch question data from the API.
  const fetchQuestionData = async () => {
    if (!questionId) return;
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/questions/${questionId}`, {
        headers: {
          "x-api-key": API_KEY,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = response.data;
      const formattedData = {
        questionTitle: data.question,
        questionDescription: data.description,
        isRequired: data.isRequired,
        forOnboarding: data.forOnboarding,
        type: data.type,
        options: data.option.map((opt) => ({
          value: opt.value,
          label: opt.label,
          order: opt.order,
        })),
      };
      setQuestionData(formattedData);
      // Save a deep copy for resetting later.
      setInitialQuestionData(JSON.parse(JSON.stringify(formattedData)));
    } catch (error) {
      console.error("Error fetching question details:", error);
      setErrorMessage("Failed to load question details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      if (questionId) {
        await fetchQuestionData();
      } else {
        // New question: use default data.
        setQuestionData(defaultQuestionData);
        setInitialQuestionData(defaultQuestionData);
        setLoading(false);
      }
    };

    initialize();
  }, [questionId]);

  // Calculate whether the form has unsaved changes.
  const hasChanges = JSON.stringify(questionData) !== JSON.stringify(initialQuestionData);

  // Update a specific field in questionData.
  const handleFieldChange = (field, value) => {
    setQuestionData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Update options specifically.
  const handleOptionsChange = (newOptions) => {
    setQuestionData((prev) => ({
      ...prev,
      options: newOptions,
    }));
  };

  // Reset the form: if editing, re-fetch the data from API; if new, revert to default.
  const handleReset = async () => {
    if (questionId) {
      await fetchQuestionData();
    } else {
      setQuestionData(defaultQuestionData);
    }
  };

  // Handle Save or Update.
  const handleSaveOrUpdate = async () => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // In update mode, if no changes have been made, alert the user.
    if (questionId && !hasChanges) {
      setErrorMessage("No changes made to update.");
      setLoading(false);
      return;
    }

    if (!surveyId[0]) {
      setErrorMessage("Survey ID is missing. Cannot save the question.");
      setLoading(false);
      return;
    }

    // Validation: For selection-based questions, require at least two options.
    if (
      (questionData.type === "SINGLE_SELECTION" || questionData.type === "MULTIPLE_SELECTION") &&
      (!questionData.options || questionData.options.length < 2)
    ) {
      setErrorMessage("At least two options are required for selection-based questions.");
      setLoading(false);
      return;
    }

    // Prepare payload for the question details (excluding options).
    const questionPayload = {
      question: questionData.questionTitle,
      description: questionData.questionDescription,
      isRequired: questionData.isRequired,
      forOnboarding: questionData.forOnboarding,
      type: questionData.type,
      profileSurveyId: surveyId[0],
    };

    try {
      if (questionId) {
        // UPDATE EXISTING QUESTION (without options).
        await axios.put(`${API_BASE_URL}/questions/${questionId}`, questionPayload, {
          headers: {
            "x-api-key": API_KEY,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // For non-text questions, update options using the separate endpoint.
        if (questionData.type !== "TEXT") {
          const optionsPayload = questionData.options.map((option, index) => ({
            value: option.value,
            label: option.label,
            order: index,
          }));
          await axios.put(`${API_BASE_URL}/questions/options/${questionId}`, optionsPayload, {
            headers: {
              "x-api-key": API_KEY,
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
        }

        setSuccessMessage("Question updated successfully!");
        // Refresh the data from the API.
        await fetchQuestionData();
      } else {
        const newQuestionPayload = {
          ...questionPayload,
          options:
            questionData.type !== "TEXT"
              ? questionData.options.map((option, index) => ({
                  value: option.value,
                  label: option.label,
                  order: index,
                }))
              : [],
        };

        const response = await axios.post(`${API_BASE_URL}/questions/`, newQuestionPayload, {
          headers: {
            "x-api-key": API_KEY,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const newQuestionId = response.data.id;
        router.replace({
          pathname: `/admin/manage-surveys/add-profilesurvey`,
          query: { id: surveyId },
        });

        setSuccessMessage("Question saved successfully!");
        // After creation, fetch the new data.
        await fetchQuestionData();
      }
    } catch (error) {
      console.error("Error saving/updating question:", error);
      setErrorMessage("Failed to save question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <AddQuestionTemplate
        questionData={questionData}
        setQuestionData={setQuestionData}
        onFieldChange={handleFieldChange}
        onOptionsChange={handleOptionsChange}
        onReset={handleReset}
        onSave={handleSaveOrUpdate}
        buttonLabel={questionId ? "Update Question" : "Save Question"}
        hasChanges={hasChanges}
      />
      {errorMessage && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md text-center">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md text-center">
          {successMessage}
        </div>
      )}
    </>
  );
};

export default AdminRoutes(EditSurveyQuestion);
