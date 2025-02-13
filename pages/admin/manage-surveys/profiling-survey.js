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
  showRefresh,
} from "@/store/adminbtnSlice";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const ProfileSurvey = () => {
  const router = useRouter();
  const [profilingData, setProfilingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [notification, setNotification] = useState({ type: "", message: "" });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTitle("Profile Survey"));
    dispatch(
      showAdd({ label: "Add", redirectTo: "/admin/manage-surveys/add-profilesurvey" })
    );
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
    const fetchProfileSurveys = async () => {
      setLoading(true);
      setErrorMessage("");
      try {
        const response = await axios.get(
          `${API_BASE_URL}/profile-survey/?isActive=false`,
          {
            headers: {
              "x-api-key": API_KEY,
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = response.data?.data || [];
        console.log("data", data);

        // Include isActive property along with other fields
        const formattedData = data.map((survey) => ({
          id: survey.id,
          question: survey.title,
          description: survey.description,
          isActive: survey.isActive,
        }));

        setProfilingData(formattedData);
      } catch (error) {
        console.error("Error fetching profile surveys:", error);
        setErrorMessage("Failed to load profile surveys. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileSurveys();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/profile-survey/${id}`, {
        headers: {
          "x-api-key": API_KEY,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Remove deleted survey from state
      setProfilingData(profilingData.filter((q) => q.id !== id));

      setNotification({ type: "success", message: "Survey deleted successfully." });
    } catch (error) {
      console.error("Error deleting profile survey:", error);
      setNotification({
        type: "error",
        message: "Failed to delete the survey. Please try again.",
      });
    }
  };

  const handleEditRedirect = (id) => {
    console.log(`Redirecting to edit profile survey ${id}`);
    window.location.href = `/admin/manage-surveys/add-profilesurvey?id=${id}`;
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
        surveyData={profilingData}
        onDelete={handleDelete}
        editRedirect={handleEditRedirect}
      />
    </div>
  );
};

export default AdminRoutes(ProfileSurvey);
