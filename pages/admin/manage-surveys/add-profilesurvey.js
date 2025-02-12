import React, { useState, useEffect } from "react";
import Layout from "../layout";
import { useRouter } from "next/router";
import AdminRoutes from "../../adminRoutes";
import axios from "axios";

const API_BASE_URL= process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const SurveyDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Active",
    hubcoins: "",
  });

  const [questions, setQuestions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isFetchingError, setIsFetchingError] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" }); // Alert state

  useEffect(() => {
    if (id) {
      fetchSurveyDetails(id);
    }
  }, [id]);

  const fetchSurveyDetails = async (surveyId) => {
    try {
      setIsFetchingError(false);
      const response = await axios.get(
        `${API_BASE_URL}/profile-survey/${surveyId}?includeQuestions=true&includeCompletions=true`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const surveyData = response.data;
      setFormData({
        title: surveyData.title,
        description: surveyData.description,
        status: surveyData.isActive ? "Active" : "Inactive",
        hubcoins: surveyData.hubCoins,
      });
      setQuestions(surveyData.questions || []);
      setIsEditing(true);
    } catch (error) {
      console.error("Error fetching survey details:", error);
      setIsFetchingError(true);
      setAlert({ type: "error", message: "Failed to fetch survey details." });
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setHasChanges(true);
  };

  const handleSaveSurvey = async () => {
    if (!formData.title || !formData.description || !formData.hubcoins) {
      setErrors({
        title: !formData.title ? "Title is required" : null,
        description: !formData.description ? "Description is required" : null,
        hubcoins: !formData.hubcoins ? "Hubcoins is required" : null,
      });
      return;
    }

    try {
      if (isEditing) {
        await axios.put(
          `${API_BASE_URL}/profile-survey/${id}`,
          {
            title: formData.title,
            description: formData.description,
            hubCoins: parseInt(formData.hubcoins, 10),
            isActive: formData.status === "Active",
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": API_KEY,
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAlert({ type: "success", message: "Survey updated successfully!" });
      } else {
        const response = await axios.post(
          `${API_BASE_URL}/profile-survey/`,
          {
            title: formData.title,
            description: formData.description,
            hubCoins: parseInt(formData.hubcoins, 10),
            isActive: formData.status === "Active",
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": API_KEY,
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        router.push(`/admin/manage-surveys/add-profilesurvey?id=${response.data.id}`);
        setAlert({ type: "success", message: "Survey saved successfully!" });
      }
      setHasChanges(false);
    } catch (error) {
      console.error("Error saving survey:", error);
      setAlert({ type: "error", message: "Failed to save survey." });
    }
  };

  const handleAddQuestion = () => {
    if (!id) {
      setAlert({ type: "error", message: "Please save the survey first." });
      return;
    }

    router.push({
      pathname: `/admin/manage-surveys/profilesurvey-question/${id}`,
    });
  };

  const handleDeleteQuestion = async (index) => {
    const questionId = questions[index]?.id;

    if (!questionId) {
      setAlert({ type: "error", message: "Invalid question ID." });
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/questions/${questionId}`, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);

      setAlert({ type: "success", message: "Question deleted successfully!" });
    } catch (error) {
      console.error("Error deleting question:", error);
      setAlert({ type: "error", message: "Failed to delete the question." });
    }
  };

  const handleEditQuestion = (q_id) => {
    if (!id || !q_id) {
      setAlert({ type: "error", message: "Invalid survey or question ID." });
      return;
    }

    router.push({
      pathname: `/admin/manage-surveys/profilesurvey-question/${id}`,
      query: { questionId: q_id },
    });
  };

  return (
    <>
      <div className="flex justify-center p-4">
        <div className="w-full p-6 bg-white border rounded-md shadow-md">
          {/* Alert Section */}
          {alert.message && (
            <div
              className={`p-4 mb-6 rounded-md ${
                alert.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {alert.message}
            </div>
          )}

          {/* Survey Details */}
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700">
              Title*
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              className={`w-full mt-2 p-3 border rounded-md ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter survey title..."
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleFormChange}
              className={`w-full mt-2 p-3 border rounded-md ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter survey description..."
            ></textarea>
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleFormChange}
              className="w-full mt-2 p-3 border rounded-md"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="mb-6 flex items-center gap-4">
            <label className="block text-lg font-medium text-gray-700">
              HUBCOINS
            </label>
            <input
              type="number"
              name="hubcoins"
              value={formData.hubcoins}
              onChange={handleFormChange}
              className={`flex-grow p-3 border rounded-md ${
                errors.hubcoins ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter hubcoins"
            />
            {errors.hubcoins && (
              <p className="text-sm text-red-500 mt-1">{errors.hubcoins}</p>
            )}
          </div>

          <button
            onClick={handleSaveSurvey}
            className={`w-full p-3 mb-6 ${
              hasChanges ? "bg-green-600 hover:bg-green-700" : "bg-gray-400"
            } text-white font-medium rounded-md`}
            disabled={!hasChanges}
          >
            {isEditing ? "Update Survey" : "Save Survey"}
          </button>

          <button
            onClick={handleAddQuestion}
            className={`w-full p-3 mb-6 ${
              !id || isFetchingError
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white font-medium rounded-md`}
            disabled={!id || isFetchingError}
          >
            Add Questions
          </button>

          {/* Questions List */}
          <div>
            {questions.length > 0 ? (
              <ul className="space-y-4">
                {questions.map((question, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-4 bg-gray-100 border rounded-md"
                  >
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {question.title}
                      </h3>
                      <p className="text-gray-600">{question.description}</p>
                    </div>
                    <div className="flex gap-4">
                      <button
                        className="text-blue-600 font-medium"
                        onClick={() => handleEditQuestion(question.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 font-medium"
                        onClick={() => handleDeleteQuestion(index)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-600">
                No questions added yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminRoutes(SurveyDetails);
