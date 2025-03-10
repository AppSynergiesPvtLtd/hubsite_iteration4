import React, { useState, useEffect } from "react";
import Layout from "../layout";
import { useRouter } from "next/router";
import AdminRoutes from "../../adminRoutes";
import axios from "axios";
import { Edit, Trash } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
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
  const [alert, setAlert] = useState({ type: "", message: "" });

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
        hubcoins: surveyData.hubCoins.toString(),
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
    // Clear error for the changed field (optional)
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSaveSurvey = async () => {
    // Validate required fields and hubcoins range 0-100
    const hubcoinsValue = parseInt(formData.hubcoins, 10);
    let newErrors = {};

    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (formData.hubcoins === "") {
      newErrors.hubcoins = "Hubcoins is required";
    } else if (isNaN(hubcoinsValue) || hubcoinsValue < 0 || hubcoinsValue > 100) {
      newErrors.hubcoins = "Hubcoins must be between 0 and 100";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (isEditing) {
        await axios.put(
          `${API_BASE_URL}/profile-survey/${id}`,
          {
            title: formData.title,
            description: formData.description,
            hubCoins: hubcoinsValue,
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
            hubCoins: hubcoinsValue,
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
        setAlert({ type: "success", message: "Survey saved successfully!" });
        router.push(`/admin/manage-surveys/profiling-survey`);
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
    <div className="flex justify-center p-1 sm:p-4">
      <div className="w-full  sm:p-6 bg-white md:border rounded-md shadow-md flex flex-col gap-5">
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
        <div className="">
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

        <div className="">
          <label className="block text-lg font-medium text-gray-700">
            Description*
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

        <div className="">
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

        <div className="flex flex-col">
          <label className="block text-lg font-medium text-gray-700">
            HUBCOINS (0 - 100)*
          </label>
          <input
            type="number"
            name="hubcoins"
            value={formData.hubcoins}
            onChange={handleFormChange}
            min="0"
            max="100"
            step="1"
            className={`w-full mt-2 p-3 border rounded-md ${
              errors.hubcoins ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter hubcoins"
          />
          {errors.hubcoins && (
            <p className="text-sm text-red-500 mt-1">{errors.hubcoins}</p>
          )}
        </div>

        <div className="flex flex-col w-full md:w-[90%] items-center">
        <button
          onClick={handleSaveSurvey}
          className={`w-[70%] sm:w-[60%] md:w-[40%] lg:w-[30%] xl:w-[20%] p-3 mb-6 ${
            hasChanges ? "bg-green-600 hover:bg-green-700" : "bg-gray-400"
          } text-white font-medium rounded-md`}
          disabled={!hasChanges}
        >
          {isEditing ? "Update Survey" : "Save Survey"}
        </button>

        <button
          onClick={handleAddQuestion}
          className={`w-[70%] sm:w-[60%] md:w-[40%] lg:w-[30%] xl:w-[20%] p-3 mb-6 ${
            !id || isFetchingError ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white font-medium rounded-md`}
          disabled={!id || isFetchingError}
        >
          Add Questions
        </button>
        </div>

        

        {/* Questions List */}
        <div>
          {questions.length > 0 ? (
            <ul className="space-y-4 ">
              {questions.map((question, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-4 bg-gray-100 md:border rounded-md"
                >
                  <div>
                  <h3 className=" text-gray-800 font-bold text-lg">
                      {index+1}. Survey Question {index+1}?
                    </h3>
                    <h3 className="text-gray-700 font-semibold">
                      Title :  {question.question}
                     
                    </h3>
                    <p className="text-gray-600"><span className="font-bold">Description:</span> {question.description}</p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      className="text-blue-600 font-medium"
                      onClick={() => handleEditQuestion(question.id)}
                    >
                      <Edit/>
                    </button>
                    <button
                      className="text-red-500 font-medium"
                      onClick={() => handleDeleteQuestion(index)}
                    >
                      <Trash/>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-600 md:w-[90%] items-center">
              No questions added yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRoutes(SurveyDetails);
