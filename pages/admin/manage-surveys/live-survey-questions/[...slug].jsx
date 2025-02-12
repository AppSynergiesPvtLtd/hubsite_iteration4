import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Layout from "../../layout";
import AdminRoutes from "@/pages/adminRoutes";
import { useDispatch } from "react-redux";
import { clearTitle, hideAdd, hideExcel, hideRefresh, setTitle, showRefresh } from "@/store/adminbtnSlice";

const API_BASE_URL= process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const EditLiveSurveyQuestion = () => {
  const router = useRouter();
  const { slug: id } = router.query; // Get the `id` from the URL slug

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isActive: true,
    hubCoins: 0,
    link: "",
    profileSurveyId: "",
  });

  const [notification, setNotification] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // Separate loading state for data fetching

  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTitle("Add Live Survey Question"));
    // dispatch(showAdd({ label: "Add", redirectTo: "/admin/manage-surveys/addquestion-livesurvey" }));
    dispatch(showRefresh({ label: "Refresh", redirectTo: router.asPath }));
    // dispatch(showExcel({ label: "Generate Excel", redirectTo: "/admin/export-excel" }));

    // Clean up on unmount
    return () => {
      dispatch(hideAdd());
      dispatch(hideRefresh());
      dispatch(hideExcel());
      dispatch(clearTitle());
    };
  }, [dispatch, router.asPath]);

  // Fetch survey details based on `id`
  useEffect(() => {
    if (id) {
      const fetchSurveyDetails = async () => {
        setIsFetching(true); // Start fetching
        try {
          const response = await axios.get(`${API_BASE_URL}/live-survey/${id}`, {
            headers: {
              "x-api-key": API_KEY,
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          const survey = response.data;

          // Populate form fields with response data
          setFormData({
            title: survey.title || "",
            description: survey.description || "",
            isActive: survey.isActive || false,
            hubCoins: survey.hubCoins || 0,
            link: survey.link || "",
            profileSurveyId: survey.profileSurveyId || "",
          });
        } catch (error) {
          console.error("Error fetching survey details:", error);
          setNotification({
            type: "error",
            message: "Failed to load survey details. Please try again.",
          });
        } finally {
          setIsFetching(false); // Stop fetching
        }
      };

      fetchSurveyDetails();
    }
  }, [id]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setNotification({ type: "", message: "" });
  };

  const handleSaveSurvey = async () => {
    setLoading(true); // Start saving
    setNotification({ type: "", message: "" });

    const payload = {
      title: formData.title,
      description: formData.description,
      isActive: formData.isActive,
      hubCoins: parseInt(formData.hubCoins, 10),
      link: formData.link,
      profileSurveyId: formData.profileSurveyId,
    };

    try {
      const response = await axios.put(`${API_BASE_URL}/live-survey/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("API Response:", response.data);

      setNotification({
        type: "success",
        message: "Survey updated successfully!",
      });

      // Redirect on success
      setTimeout(() => {
        router.push("/admin/manage-surveys/live-survey"); // Adjust the redirect path as needed
      }, 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error("Error saving survey:", error);
      setNotification({
        type: "error",
        message:
          error.response?.data?.message || "Failed to save the survey. Please try again.",
      });
    } finally {
      setLoading(false); // Stop saving
    }
  };

  return (
    // <Layout title={"Add Live Survey"}>
      <div className="flex justify-center">
        <div className="w-full p-6 border rounded-md shadow-md bg-white">
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

          {/* Show spinner if data is loading */}
          {isFetching ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Title */}
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

              {/* Description */}
              <div className="mb-6">
                <label className="block text-lg font-medium text-gray-800">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleFormChange}
                  className="w-full mt-2 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter the survey description..."
                ></textarea>
              </div>

              {/* HubCoins */}
              <div className="mb-6 flex items-center gap-4">
                <label className="block text-lg font-medium text-gray-700">HubCoins*</label>
                <input
                  type="number"
                  name="hubCoins"
                  value={formData.hubCoins}
                  onChange={handleFormChange}
                  className="w-fit p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter hubcoins"
                />
              </div>

              {/* Link */}
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

              {/* Profile Survey ID */}
              <div className="mb-6">
                <label className="block text-lg font-medium text-gray-800">Profile Survey ID</label>
                <input
                  name="profileSurveyId"
                  value={formData.profileSurveyId}
                  onChange={handleFormChange}
                  className="w-full mt-2 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter profile survey ID"
                />
              </div>

              {/* IsActive */}
              <div className="mb-6">
                <label className="block text-lg font-medium text-gray-700">Status</label>
                <select
                  name="isActive"
                  value={formData.isActive ? "Active" : "Inactive"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isActive: e.target.value === "Active",
                    }))
                  }
                  className="w-fit mt-2 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Save Button */}
              <div className="w-full flex justify-center">
                <button
                  onClick={handleSaveSurvey}
                  className={`w-[10rem] py-3 ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-600"
                  } text-white text-lg font-semibold rounded-md shadow-sm transition`}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
  );
};

export default AdminRoutes(EditLiveSurveyQuestion);
