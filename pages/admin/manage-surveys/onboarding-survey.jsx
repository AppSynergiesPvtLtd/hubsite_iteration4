import React, { useState, useEffect } from "react";
import axios from "axios";
import SurveyTemplate from "@/components/AuthComps/ManageSurveys/Surveydetails";
import { useRouter } from "next/router";
import Layout from "../layout";
import AdminRoutes from "@/pages/adminRoutes";
import { useDispatch } from "react-redux";
import { 
  clearTitle, 
  hideAdd, 
  hideExcel, 
  hideRefresh, 
  setTitle, 
  showAdd, 
  showRefresh 
} from "@/store/adminbtnSlice";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const OnBoardingSurvey = () => {
  const router = useRouter();
  const [onBoardingData, setOnBoardingData] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTitle("Onboarding Surveys"));
    dispatch(showAdd({ label: "Add", redirectTo: "/admin/manage-surveys/addquestion-onboarding" }));
    dispatch(showRefresh({ label: "Refresh", redirectTo: router.asPath }));

    // Clean up on unmount
    return () => {
      dispatch(hideAdd());
      dispatch(hideRefresh());
      dispatch(hideExcel());
      dispatch(clearTitle());
    };
  }, [dispatch, router.asPath]);

  useEffect(() => {
    const fetchOnboardingQuestions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/questions/onboarding`, {
          headers: {
            "x-api-key": API_KEY,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("resp",response)
        // Map the data and include isActive if provided (or default as needed)
        const fetchedData = response.data?.data?.map((item) => ({
          id: item.id,
          question: item.question,
          description: item.description,
          isActive: item.isActive, // optional: default to true if needed (e.g. item.isActive ?? true)
        })) || [];

        setOnBoardingData(fetchedData);
      } catch (error) {
        console.error("Error fetching onboarding questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOnboardingQuestions();
  }, []);

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/questions/${id}`, {
        headers: {
          "x-api-key": API_KEY,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(`Successfully deleted onboarding question with id: ${id}`);
      setOnBoardingData((prevData) => prevData.filter((q) => q.id !== id));
    } catch (error) {
      console.error(`Error deleting onboarding question with id ${id}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRedirect = (id) => {
    console.log(`Redirecting to edit onboarding question ${id}`);
    router.push(`/admin/manage-surveys/edit-onboarding-question/${id}`);
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-lg font-medium text-gray-600">Loading...</p>
        </div>
      ) : (
        <SurveyTemplate
          surveyData={onBoardingData}
          onDelete={handleDelete}
          editRedirect={handleEditRedirect}
          showStatus={false}  // Hides the Active/Inactive pills for onboarding surveys
        />
      )}
    </>
  );
};

export default AdminRoutes(OnBoardingSurvey);
