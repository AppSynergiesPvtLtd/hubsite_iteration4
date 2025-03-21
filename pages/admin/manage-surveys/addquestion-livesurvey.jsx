import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../layout";
import AdminRoutes from "../../adminRoutes";
import { useDispatch } from "react-redux";
import { setTitle } from "@/store/adminbtnSlice";
import { useRouter } from "next/router";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const LiveSurveyQuestions = ({ apiEndpoint = "/live-survey/", onSuccessRedirect }) => {
  const router = useRouter();
  const initialFormData = {
    title: "",
    description: "",
    hubCoins: "",
    isActive: true,
    link: "",
    profileSurveyId: "",
  };
  
  const dispatch = useDispatch();
  dispatch(setTitle("Add LiveSurvey Question"));

  const [formData, setFormData] = useState(initialFormData);
  const [profileSurveys, setProfileSurveys] = useState([]);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfileSurveys = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/profile-survey/?isActive=true`, {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data && Array.isArray(response.data.data)) {
          setProfileSurveys(response.data.data);
        } else {
          setProfileSurveys([]);
          console.error("Unexpected response format:", response.data);
          setNotification({
            type: "error",
            message: "Failed to load active profile surveys. Invalid response format.",
          });
        }
      } catch (error) {
        console.error("Error fetching profile surveys:", error);
        setNotification({
          type: "error",
          message: "Failed to load active profile surveys. Please try again.",
        });
      }
    };

    fetchProfileSurveys();
  }, []);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;

    if (name === "hubCoins") {
      // Remove leading zeros and ensure it's a valid number
      let numValue = value.replace(/^0+/, '') || "0";
      numValue = parseInt(numValue, 10);
      
      if (isNaN(numValue)) {
        numValue = "";
      } else if (numValue > 100) {
        numValue = 100;
      } else if (numValue < 0) {
        numValue = 0;
      }
      newValue = numValue.toString();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    setNotification({ type: "", message: "" });
  };

  const handleSaveLiveSurvey = async () => {
    setLoading(true);
    setNotification({ type: "", message: "" });

    const payload = {
      title: formData.title,
      description: formData.description,
      hubCoins: parseInt(formData.hubCoins || 0, 10),
      isActive: formData.isActive,
      link: formData.link,
      ...(formData.profileSurveyId !== null && formData.profileSurveyId !== "" && { profileSurveyId: formData.profileSurveyId }),
    };

    try {
      console.log("payload", payload);
      console.log("hitt");
      const response = await axios.post(`${API_BASE_URL}/live-survey/`, payload, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("API Response:", response.data);

      setNotification({
        type: "success",
        message: "Live survey created successfully!",
      });

      setFormData(initialFormData);
      router.push("/admin/manage-surveys/live-survey");
      if (onSuccessRedirect) {
        setTimeout(() => {
          window.location.href = onSuccessRedirect;
        }, 2000);
      }
    } catch (error) {
      console.error("Error saving live survey:", error);
      setNotification({
        type: "error",
        message:
          error.response?.data?.message || "Failed to save the live survey. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full p-6 border rounded-md shadow-md bg-white">
        {notification.message && (
          <div
            className={`mb-4 p-4 rounded-md text-white ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {notification.message}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-800">Title*</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleFormChange}
            className="w-full mt-2 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter the survey title..."
          />
        </div>

        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-800">Description</label>
          <textarea
            name="description"
            rows="2"
            value={formData.description}
            onChange={handleFormChange}
            className="w-full mt-2 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter the survey description..."
          ></textarea>
        </div>

        <div className="mb-6 block sm:flex items-center gap-4 overflow-hidden">
          <label className="block text-lg font-medium text-gray-700">HubCoins*</label>
          <input
            type="number"
            name="hubCoins"
            value={formData.hubCoins}
            onChange={handleFormChange}
            min="0"
            max="100"
            className="w-fit p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter hubcoins"
          />
        </div>

        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-800">Link*</label>
          <input
            name="link"
            value={formData.link}
            onChange={handleFormChange}
            className="w-full mt-2 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter the survey link..."
          />
        </div>

        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-800">Profile Survey ID</label>
          <select
            name="profileSurveyId"
            value={formData.profileSurveyId}
            onChange={handleFormChange}
            className="w-full mt-2 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a profile survey</option>
            {profileSurveys.map((survey) => (
              <option key={survey.id} value={survey.id}>
                {survey.title}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full flex justify-center">
          <button
            onClick={handleSaveLiveSurvey}
            className={`w-[10rem] py-3 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-600"
            } text-white text-lg font-semibold rounded-md shadow-sm transition`}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminRoutes(LiveSurveyQuestions);