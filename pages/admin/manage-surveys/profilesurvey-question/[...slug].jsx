import React, { useState, useEffect } from "react";
import Layout from "../../layout";
import AddQuestionTemplate from "@/components/AuthComps/ManageSurveys/QuestionTemplate";
import axios from "axios";
import { useRouter } from "next/router";
import AdminRoutes from "@/pages/adminRoutes";
import { useDispatch } from "react-redux";
import { clearTitle, hideAdd, hideExcel, hideRefresh, setTitle, showAdd, showRefresh } from "@/store/adminbtnSlice";

const API_BASE_URL= process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const EditSurveyQuestion = () => {
  const router = useRouter();
  const { slug: surveyId, questionId } = router.query;
  
  const [questionData, setQuestionData] = useState({
    questionTitle: "",
    questionDescription: "",
    isRequired: true,
    forOnboarding: false,
    type: "SINGLE_SELECTION", // Default question type
    options: [], // Default empty options
  });

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
 
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTitle("Add Profile Survey Question"));
    // dispatch(showAdd({ label: "Add", redirectTo: "/admin/manage-surveys/addquestion-livesurvey" }));
    // dispatch(showRefresh({ label: "Refresh", redirectTo: router.asPath }));
    // dispatch(showExcel({ label: "Generate Excel", redirectTo: "/admin/export-excel" }));

    // Clean up on unmount
    return () => {
      dispatch(hideAdd());
      dispatch(hideRefresh());
      dispatch(hideExcel());
      dispatch(clearTitle());
    };
  }, [dispatch, router.asPath]);

  useEffect(() => {
    const fetchQuestionDetails = async () => {
      if (!questionId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/questions/${questionId}`, {
          headers: {
            "x-api-key": API_KEY,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = response.data;

        // Map the response data to the `questionData` state
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
            id: opt.id, // Include ID if editing options
          })),
        };

        setQuestionData(formattedData);
      } catch (error) {
        console.error("Error fetching question details:", error);
        setErrorMessage("Failed to load question details.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionDetails();
  }, [questionId]);

  // Update a specific field in questionData
  const handleFieldChange = (field, value) => {
    
    setQuestionData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Update options specifically
  const handleOptionsChange = (newOptions) => {
    setQuestionData((prev) => ({
      ...prev,
      options: newOptions,
    }));
  };

  // Handle Save or Update
  const handleSaveOrUpdate = async () => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!surveyId[0]) {
      setErrorMessage("Survey ID is missing. Cannot save the question.");
      setLoading(false);
      return;
    }

    const questionPayload = {
      question: questionData.questionTitle,
      description: questionData.questionDescription,
      isRequired: questionData.isRequired,
      forOnboarding: false,
      type: questionData.type,
      profileSurveyId: surveyId[0],
      options: questionData.options,
    };

    try {
      if (questionId) {
        // Update existing question
        await axios.put(`${API_BASE_URL}/questions/${questionId}`, questionPayload, {
          headers: {
            "x-api-key": API_KEY,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setSuccessMessage("Question updated successfully!");
      } else {
        // Create a new question
        const response = await axios.post(
          `${API_BASE_URL}/questions/`,
          questionPayload,
          {
            headers: {
              "x-api-key": API_KEY,
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const newQuestionId = response.data.id;

        // Update the URL with the new questionId as query param
        router.replace({
          pathname: `/admin/manage-surveys/profilesurvey-question/${surveyId}`,
          query: { questionId: newQuestionId },
        });

        setSuccessMessage("Question saved successfully!");
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
    // <Layout title="Add Profile Survey Question">
    <>
      <AddQuestionTemplate
        questionData={questionData}
        setQuestionData={setQuestionData}
        onFieldChange={handleFieldChange} // New function for field updates
        onOptionsChange={handleOptionsChange} // New function for options updates
        onSave={handleSaveOrUpdate}
        buttonLabel={questionId ? "Update Question" : "Save Question"}
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
