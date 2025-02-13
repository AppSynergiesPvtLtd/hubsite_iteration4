import SurveyTemplate from "@/components/AuthComps/ManageSurveys/Surveydetails";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../layout";
import { useRouter } from "next/router";
import AdminRoutes from "../../adminRoutes";
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

const LiveSurvey = () => {
  const router = useRouter();
  const [liveSurveyData, setLiveSurveyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [notification, setNotification] = useState({ type: "", message: "" });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTitle("Live Survey"));
    dispatch(showAdd({ label: "Add", redirectTo: "/admin/manage-surveys/addquestion-livesurvey" }));
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
    const fetchLiveSurveys = async () => {
      setLoading(true);
      setErrorMessage("");
      try {
        const response = await axios.get(
          `${API_BASE_URL}/live-survey/?page=1&isActive=true`,
          {
            headers: {
              "x-api-key": API_KEY,
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = response.data?.data || [];
        console.log("Data", data);
        const formattedData = data.map((survey) => ({
          id: survey.id,
          question: survey.title,
          description: survey.description,
          isActive: survey.isActive, // include active/inactive flag
        }));

        setLiveSurveyData(formattedData);
      } catch (error) {
        console.error("Error fetching live surveys:", error);
        setErrorMessage("Failed to load live surveys. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLiveSurveys();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/live-survey/${id}`, {
        headers: {
          "x-api-key": API_KEY,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Remove deleted survey from state
      setLiveSurveyData(liveSurveyData.filter((q) => q.id !== id));

      setNotification({ type: "success", message: "Survey deleted successfully." });
    } catch (error) {
      console.error("Error deleting live survey:", error);
      setNotification({
        type: "error",
        message: "Failed to delete the survey. Please try again.",
      });
    }
  };

  const handleEditRedirect = (id) => {
    console.log(`Redirecting to edit live survey ${id}`);
    window.location.href = `/admin/manage-surveys/live-survey-questions/${id}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-gray-600">Loading...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-red-600">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Notification Section */}
      {notification.message && (
        <div
          className={`mb-4 p-4 rounded-md text-white ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notification.message}
        </div>
      )}

      <SurveyTemplate
        surveyData={liveSurveyData}
        onDelete={handleDelete}
        editRedirect={handleEditRedirect}
      />
    </div>
  );
};

export default AdminRoutes(LiveSurvey);
