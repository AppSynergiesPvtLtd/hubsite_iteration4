import React, { useState, useEffect } from "react";
import Layout from "../../layout";
import AddQuestionTemplate from "@/components/AuthComps/ManageSurveys/QuestionTemplate";
import axios from "axios";
import { useRouter } from "next/router";
import AdminRoutes from "@/pages/adminRoutes";
import { useDispatch } from "react-redux";
import { clearTitle, hideAdd, hideExcel, hideRefresh, setTitle } from "@/store/adminbtnSlice";

const API_BASE_URL= process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const EditOnBoardingQuestion = () => {
  const router = useRouter();
  const { slug } = router.query; // Slug for identifying the question to edit
  const [initialQuestionData, setInitialQuestionData] = useState(null); // Store original data for comparison
  const [questionData, setQuestionData] = useState({
    questionTitle: "",
    questionDescription: "",
    type: "SINGLE_SELECTION", // Ensure field name matches
    isRequired: true,
    options: [],
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTitle("Onboarding Question"));
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

  // Fetch question details on component mount
  useEffect(() => {
    if (!slug) return;

    const fetchQuestionDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/questions/${slug}`, {
          headers: {
            "x-api-key": API_KEY,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = response.data;

        const formattedData = {
          questionTitle: data.question,
          questionDescription: data.description,
          type: data.type, // Use `type` consistently
          isRequired: data.isRequired,
          options: ["SINGLE_SELECTION", "MULTIPLE_SELECTION"].includes(data.type) ? data.option || [] : [], // Only include options if type allows
        };

        setInitialQuestionData(formattedData);
        setQuestionData(formattedData);
      } catch (error) {
        console.error("Error fetching question details:", error);
        setErrorMessage("Failed to load question details.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionDetails();
  }, [slug]);

  const handleSaveChanges = async () => {
    if (JSON.stringify(questionData) === JSON.stringify(initialQuestionData)) {
      setSuccessMessage("No changes detected.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const questionPayload = {
      question: questionData.questionTitle,
      description: questionData.questionDescription,
      type: questionData.type,
      isRequired: questionData.isRequired,
      isActive: true,
    };

    try {
      await axios.put(`${API_BASE_URL}/questions/${slug}`, questionPayload, {
        headers: {
          "x-api-key": API_KEY,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (["SINGLE_SELECTION", "MULTIPLE_SELECTION"].includes(questionData.type) && questionData.options.length > 0) {
        await axios.put(`${API_BASE_URL}/questions/options/${slug}`, questionData.options, {
          headers: {
            "x-api-key": API_KEY,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }

      setInitialQuestionData(questionData);
      setSuccessMessage("Question updated successfully!");
    } catch (error) {
      console.error("Error saving question:", error);
      setErrorMessage("Failed to update question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout >
       
      </Layout>
    );
  }

  return (
    // <Layout title={"Add onBoarding"}>
    <>
      {loading?( <div className="flex justify-center items-center h-screen">
          <p className="text-lg font-medium text-gray-600">Loading...</p>
        </div>):(
          <>
        <AddQuestionTemplate
        questionData={questionData}
        setQuestionData={setQuestionData}
        loading={loading}
        errorMessage={errorMessage}
        onSave={handleSaveChanges}
      />
      {successMessage && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md text-center">
          {successMessage}
        </div>
      )}</>)}
        
        </> 
  );
};

export default AdminRoutes(EditOnBoardingQuestion);
