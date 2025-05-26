"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import AdminRoutes from "@/pages/adminRoutes";
import { useDispatch } from "react-redux";
import { IoMdAdd } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import {
  clearTitle,
  hideAdd,
  hideExcel,
  hideRefresh,
  setTitle,
  showRefresh,
} from "@/store/adminbtnSlice";
import { useSearchParams } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const EditLiveSurveyQuestion = () => {
  const router = useRouter();
  
  const { slug: id } = router.query;
  console.log(id)
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isActive: true,
    hubCoins: 0,
    link: "",
    profileSurveyId: "",
    pushToLiveSurvey: false,
    profilingTargetingRules: [],
    onboardingTargetingRules: [],
  });
  const [profileSurveys, setProfileSurveys] = useState([]);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [showTargetingRulesModal, setShowTargetingRulesModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleteRuleData, setDeleteRuleData] = useState({ type: "", index: null });
  const [currentRule, setCurrentRule] = useState({
    id: null,
    questionId: "",
    operator: "Equals",
    values: [],
    type: "profiling",
    ruleIndex: null,
  });
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [availableOptions, setAvailableOptions] = useState([]);
  const [showValuesDropdown, setShowValuesDropdown] = useState(false);

  useEffect(() => {
    dispatch(setTitle("Edit Live Survey Question"));
    dispatch(showRefresh({ label: "Refresh", redirectTo: router.asPath }));

    return () => {
      dispatch(hideAdd());
      dispatch(hideRefresh());
      dispatch(hideExcel());
      dispatch(clearTitle());
    };
  }, [dispatch, router.asPath]);

  // Fetch survey details and targeting rules
  useEffect(() => {
    if (!router.isReady || !id) return;

    const fetchSurveyDetails = async () => {
      setIsFetching(true);
      try {
        const surveyId = Array.isArray(id) ? id[0] : id;

        const response = await axios.get(
          `${API_BASE_URL}/live-survey/${surveyId}`,
          {
            headers: {
              "x-api-key": API_KEY,
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const survey = response.data;

        // Fetch both profiling and onboarding targeting rules
        const [profilingTargetsResponse, onboardingTargetsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/live-survey/targets/${surveyId}`, {
            params: { fromOnboarding: false },
            headers: {
              "x-api-key": API_KEY,
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get(`${API_BASE_URL}/live-survey/targets/${surveyId}`, {
            params: { fromOnboarding: true },
            headers: {
              "x-api-key": API_KEY,
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

        const targets = [
          ...(profilingTargetsResponse.data || []),
          ...(onboardingTargetsResponse.data || []),
        ];

        const [profilingRes, onboardingRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/questions/get-all-questions`, {
            params: { onboarding: false },
            headers: {
              "x-api-key": API_KEY,
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get(`${API_BASE_URL}/questions/get-all-questions`, {
            params: { onboarding: true },
            headers: {
              "x-api-key": API_KEY,
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

        const allQuestions = [
          ...(profilingRes.data || []),
          ...(onboardingRes.data || []),
        ];

        const profilingRules = [];
        const onboardingRules = [];

        for (const target of targets) {
          const question = allQuestions.find((q) => q.id === target.questionId);
          if (!question) continue;

          const rule = {
            id: target.id,
            questionId: target.questionId,
            questionText: question.question,
            operator:
              target.operator === "any"
                ? "Contains_any"
                : target.operator === "all"
                ? "Contains_all"
                : "Equals",
            values: JSON.parse(target.value).map((optId) => {
              const option = question.option.find((o) => o.id === optId);
              return option ? option.value : optId;
            }),
            valueLabels: JSON.parse(target.value)
              .map((optId) => {
                const option = question.option.find((o) => o.id === optId);
                return option ? option.label : optId;
              })
              .join(", "),
          };

          if (question.forOnboarding) {
            onboardingRules.push(rule);
          } else {
            profilingRules.push(rule);
          }
        }

        setFormData((prev) => ({
          ...prev,
          title: survey.title || "",
          description: survey.description || "",
          isActive: survey.isActive ?? true,
          hubCoins: survey.hubCoins?.toString() || "0",
          link: survey.link || "",
          profileSurveyId: survey.profileSurveyId || "",
          pushToLiveSurvey: survey.pushToLiveSurvey ?? false,
          profilingTargetingRules: profilingRules,
          onboardingTargetingRules: onboardingRules,
        }));
      } catch (error) {
        console.error("Error fetching survey details:", error);
        setNotification({
          type: "error",
          message: "Failed to load survey data",
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchSurveyDetails();
  }, [id, router.isReady]);

  // Fetch profile surveys
  useEffect(() => {
    const fetchProfileSurveys = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/profile-survey/?isActive=true`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": API_KEY,
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setProfileSurveys(response.data.data || []);
      } catch (error) {
        console.error("Error fetching profile surveys:", error);
        setNotification({
          type: "error",
          message: "Failed to load profile surveys",
        });
      }
    };

    fetchProfileSurveys();
  }, []);

  // Fetch questions for targeting rules modal
  useEffect(() => {
    if (showTargetingRulesModal) {
      const fetchQuestionsForModal = async () => {
        try {
          const forOnboarding = currentRule.type === "onboarding";
          const questionsResponse = await axios.get(
            `${API_BASE_URL}/questions/get-all-questions`,
            {
              params: { onboarding: forOnboarding },
              headers: {
                "x-api-key": API_KEY,
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setAvailableQuestions(
            questionsResponse.data.filter(
              (q) =>
                q.type === "SINGLE_SELECTION" || q.type === "MULTIPLE_SELECTION"
            )
          );
        } catch (error) {
          console.error("Error fetching questions for modal:", error);
          setNotification({
            type: "error",
            message: "Failed to fetch questions.",
          });
        }
      };

      fetchQuestionsForModal();
    }
  }, [showTargetingRulesModal, currentRule.type]);

  // Update available options
  useEffect(() => {
    if (currentRule.questionId) {
      const selectedQuestion = availableQuestions.find(
        (q) => q.id === currentRule.questionId
      );
      setAvailableOptions(selectedQuestion?.option || []);
    } else {
      setAvailableOptions([]);
    }
  }, [currentRule.questionId, availableQuestions]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;

    if (name === "hubCoins") {
      let numValue = parseInt(newValue, 10);
      if (isNaN(numValue)) {
        numValue = 0;
      }
      if (numValue > 100) {
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

  // Targeting rules handlers
  const handleAddRuleClick = (type) => {
    setCurrentRule({
      id: null,
      questionId: "",
      operator: "Equals",
      values: [],
      type: type,
      ruleIndex: null,
    });
    setAvailableOptions([]);
    setShowTargetingRulesModal(true);
    setShowValuesDropdown(false);
  };

  const handleRuleFormChange = (e) => {
    const { name, value } = e.target;
    setCurrentRule((prev) => ({
      ...prev,
      [name]: value,
      values: name === "questionId" ? [] : prev.values,
    }));
    setShowValuesDropdown(false);
  };

  const handleValueChange = (optionValue) => {
    const selectedQuestion = availableQuestions.find(
      (q) => q.id === currentRule.questionId
    );
    const isMultiSelect =
      currentRule.operator !== "Equals" ||
      selectedQuestion?.type === "MULTIPLE_SELECTION";

    setCurrentRule((prev) => {
      let newValues = [...prev.values];
      if (newValues.includes(optionValue)) {
        newValues = newValues.filter((v) => v !== optionValue);
      } else {
        if (isMultiSelect) {
          newValues.push(optionValue);
        } else {
          newValues = [optionValue];
        }
      }
      return { ...prev, values: newValues };
    });

    if (!isMultiSelect) {
      setShowValuesDropdown(false);
    }
  };

  const handleRemoveValue = (optionValue) => {
    setCurrentRule((prev) => ({
      ...prev,
      values: prev.values.filter((v) => v !== optionValue),
    }));
  };

  const handleSaveRule = async () => {
    if (!currentRule.questionId || currentRule.values.length === 0) {
      setNotification({
        type: "error",
        message: "Please select a question and at least one value.",
      });
      return;
    }

    const selectedQuestion = availableQuestions.find(
      (q) => q.id === currentRule.questionId
    );
    const questionText = selectedQuestion
      ? selectedQuestion.question
      : "Unknown Question";
    const selectedOptions = availableOptions.filter((opt) =>
      currentRule.values.includes(opt.value)
    );
    const valueLabels = selectedOptions.map((opt) => opt.label).join(", ");
    const optionIds = selectedOptions.map((opt) => opt.id);

    const surveyId = Array.isArray(id) ? id[0] : id;
    const rulePayload = {
      liveSurveyId: surveyId,
      questionId: currentRule.questionId,
      operator: currentRule.operator === "Equals" ? "equals" : currentRule.operator.toLowerCase().replace("contains_", ""),
      value: JSON.stringify(optionIds),
      fromOnboarding: currentRule.type === "onboarding",
    };

    try {
      let newRuleId = currentRule.id;
      if (currentRule.id) {
        await axios.put(
          `${API_BASE_URL}/live-survey/update-trageting/${currentRule.id}`,
          rulePayload,
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": API_KEY,
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        const response = await axios.post(
          `${API_BASE_URL}/live-survey/add-trageting`,
          rulePayload,
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": API_KEY,
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        newRuleId = response.data.id;
      }

      const ruleToSave = {
        id: newRuleId,
        questionId: currentRule.questionId,
        questionText,
        operator: currentRule.operator,
        values: currentRule.values,
        valueLabels,
      };

      setFormData((prev) => {
        const rulesKey =
          currentRule.type === "profiling"
            ? "profilingTargetingRules"
            : "onboardingTargetingRules";
        const newRules = [...prev[rulesKey]];
        if (currentRule.ruleIndex !== null) {
          newRules[currentRule.ruleIndex] = ruleToSave;
        } else {
          newRules.push(ruleToSave);
        }
        return { ...prev, [rulesKey]: newRules };
      });

      setShowTargetingRulesModal(false);
      setNotification({ type: "success", message: "Targeting rule saved." });
    } catch (error) {
      console.error("Error saving targeting rule:", error);
      setNotification({
        type: "error",
        message: error.response?.data?.message || "Failed to save targeting rule.",
      });
    }
  };

  const handleDeleteRuleClick = (type, index) => {
    setDeleteRuleData({ type, index });
    setShowDeleteConfirmModal(true);
  };

  const handleDeleteRule = async () => {
    const { type, index } = deleteRuleData;
    const rulesKey =
      type === "profiling" ? "profilingTargetingRules" : "onboardingTargetingRules";
    const ruleId = formData[rulesKey][index].id;

    try {
      await axios.delete(
        `${API_BASE_URL}/live-survey/delete-trageting/${ruleId}`,
        {
          headers: {
            "x-api-key": API_KEY,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setFormData((prev) => {
        const newRules = [...prev[rulesKey]];
        newRules.splice(index, 1);
        return { ...prev, [rulesKey]: newRules };
      });
      setNotification({ type: "success", message: "Targeting rule deleted." });
    } catch (error) {
      console.error("Error deleting targeting rule:", error);
      setNotification({
        type: "error",
        message:
          error.response?.data?.message || "Failed to delete targeting rule.",
      });
    } finally {
      setShowDeleteConfirmModal(false);
      setDeleteRuleData({ type: "", index: null });
    }
  };

  const handleEditRule = (type, index) => {
    const rulesKey =
      type === "profiling" ? "profilingTargetingRules" : "onboardingTargetingRules";
    const ruleToEdit = formData[rulesKey][index];

    setCurrentRule({
      id: ruleToEdit.id,
      questionId: ruleToEdit.questionId,
      operator: ruleToEdit.operator,
      values: ruleToEdit.values,
      type: type,
      ruleIndex: index,
    });

    const selectedQuestion = availableQuestions.find(
      (q) => q.id === ruleToEdit.questionId
    );
    setAvailableOptions(selectedQuestion?.option || []);

    setShowTargetingRulesModal(true);
    setShowValuesDropdown(false);
  };

  const isMultiSelect =
    currentRule.operator !== "Equals" ||
    (currentRule.questionId &&
      availableQuestions.find((q) => q.id === currentRule.questionId)?.type ===
        "MULTIPLE_SELECTION");

  const handleSaveSurvey = async () => {
    setLoading(true);
    setNotification({ type: "", message: "" });

    const payload = {
      title: formData.title,
      description: formData.description,
      isActive: formData.isActive,
      hubCoins: parseInt(formData.hubCoins, 10),
      link: formData.link,
      profileSurveyId: formData.profileSurveyId || null,
      pushToLiveSurvey: formData.pushToLiveSurvey,
    };

    try {
      const response = await axios.put(
        `${API_BASE_URL}/live-survey/${id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("API Response:", response.data);

      setNotification({
        type: "success",
        message: "Live survey updated successfully",
      });

      setTimeout(() => {
        router.push("/admin/manage-surveys/live-survey");
      }, 2000);
    } catch (error) {
      console.error("Error saving survey:", error);
      setNotification({
        type: "error",
        message: error.response?.data?.message || "Failed to update live survey",
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

        {isFetching ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-800">
                Title
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                className="w-full mt-2 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter survey title"
              />
            </div>

            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-800">
                Description
              </label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleFormChange}
                className="w-full mt-2 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter survey description"
              ></textarea>
            </div>

            <div className="mb-6 sm:flex items-center gap-4">
              <label className="block text-lg font-medium text-gray-700">
                Hub Coins
              </label>
              <input
                type="number"
                name="hubCoins"
                value={formData.hubCoins}
                onChange={handleFormChange}
                min="0"
                max="100"
                className="w-fit p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter hub coins (0-100)"
              />
            </div>

            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-800">
                Survey Link
              </label>
              <input
                name="link"
                value={formData.link}
                onChange={handleFormChange}
                className="w-full mt-2 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter survey link"
              />
            </div>

            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-800">
                Profile Survey
              </label>
              <select
                name="profileSurveyId"
                value={formData.profileSurveyId}
                onChange={handleFormChange}
                className="w-full mt-2 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a profile survey</option>
                {profileSurveys.map((survey) => (
                  <option key={survey.id} value={survey.id}>
                    {survey.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-800">
                Status
              </label>
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

            <div className="mb-6 flex gap-3 items-center">
              <label className="block text-sm font-medium text-gray-800">
                Push to Live Survey
              </label>
              <div className="mt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="pushToLiveSurvey"
                    checked={formData.pushToLiveSurvey}
                    onChange={handleFormChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-300 transition-colors duration-200"></div>
                  <div className="absolute w-4 h-4 bg-white rounded-full top-1 left-1 peer-checked:translate-x-5 transition-transform duration-200"></div>
                </label>
              </div>
            </div>

            <div className="mb-8 border p-4 rounded-md bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Add Profiling Targeting Values
                </h3>
                <button
                  onClick={() => handleAddRuleClick("profiling")}
                  className="px-8 font-bold py-2 bg-[#0057A1] text-white rounded-md hover:bg-blue-600 text-sm"
                >
                  <IoMdAdd />
                </button>
              </div>

              {formData.profilingTargetingRules.length > 0 ? (
                <div className="space-y-3">
                  {formData.profilingTargetingRules.map((rule, index) => (
                    <div
                      key={index}
                      className="border p-3 rounded-md bg-white shadow-sm flex justify-between items-start"
                    >
                      <div className="flex-grow pr-4">
                        <p className="font-medium text-gray-800">
                          Question: {rule.questionText}
                        </p>
                        <p className="text-sm text-gray-600">
                          Operator: {rule.operator}
                        </p>
                        <p className="text-sm text-gray-600">
                          Value: {rule.valueLabels}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditRule("profiling", index)}
                          className="text-blue-600 hover:text-blue-800"
                          aria-label="Edit Rule"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteRuleClick("profiling", index)}
                          className="text-red-600 hover:text-red-800"
                          aria-label="Delete Rule"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">
                  No profiling targeting rules added yet.
                </p>
              )}
            </div>

            <div className="mb-8 border p-4 rounded-md bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Add Onboarding Targeting Values
                </h3>
                <button
                  onClick={() => handleAddRuleClick("onboarding")}
                  className="px-8 py-2 bg-[#0057A1] text-white rounded-md hover:bg-blue-600 text-sm font-medium"
                >
                  <IoMdAdd />
                </button>
              </div>

              {formData.onboardingTargetingRules.length > 0 ? (
                <div className="space-y-3">
                  {formData.onboardingTargetingRules.map((rule, index) => (
                    <div
                      key={index}
                      className="border p-3 rounded-md bg-white shadow-sm flex justify-between items-start"
                    >
                      <div className="flex-grow pr-4">
                        <p className="font-medium text-gray-800">
                          Question: {rule.questionText}
                        </p>
                        <p className="text-sm text-gray-600">
                          Operator: {rule.operator}
                        </p>
                        <p className="text-sm text-gray-600">
                          Value: {rule.valueLabels}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditRule("onboarding", index)}
                          className="text-blue-600 hover:text-blue-800"
                          aria-label="Edit Rule"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteRuleClick("onboarding", index)}
                          className="text-red-600 hover:text-red-800"
                          aria-label="Delete Rule"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">
                  No onboarding targeting rules added yet.
                </p>
              )}
            </div>

            {showTargetingRulesModal && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-md shadow-xl w-11/12 md:max-w-md">
                  <h4 className="text-xl font-bold mb-4 text-gray-800">
                    {currentRule.ruleIndex !== null ? "Edit" : "Add"} Targeting Rule
                  </h4>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Question
                    </label>
                    <select
                      name="questionId"
                      value={currentRule.questionId}
                      onChange={handleRuleFormChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a question</option>
                      {availableQuestions.map((question) => (
                        <option key={question.id} value={question.id}>
                          {question.question}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Operator
                    </label>
                    <select
                      name="operator"
                      value={currentRule.operator}
                      onChange={handleRuleFormChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Equals">Equals</option>
                      <option value="Contains_any">Contains any</option>
                      <option value="Contains_all">Contains all</option>
                    </select>
                  </div>

                  {currentRule.questionId && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Value
                      </label>
                      {availableOptions.length > 0 ? (
                        <div className="mt-1">
                          {/* Display selected values as pills */}
                          {currentRule.values.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              {currentRule.values.map((value) => {
                                const option = availableOptions.find(
                                  (opt) => opt.value === value
                                );
                                return (
                                  <div
                                    key={value}
                                    className="flex items-center bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full"
                                  >
                                    <span>{option?.label || value}</span>
                                    <button
                                      onClick={() => handleRemoveValue(value)}
                                      className="ml-2 text-gray-600 hover:text-gray-800"
                                      aria-label="Remove value"
                                    >
                                      <IoClose size={16} />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Custom dropdown for selecting values */}
                          <div className="relative">
                            <button
                              onClick={() =>
                                setShowValuesDropdown(!showValuesDropdown)
                              }
                              className="w-full p-2 border border-gray-300 rounded-md text-left text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {currentRule.values.length > 0
                                ? "Add more values"
                                : "Select values"}
                            </button>
                            {showValuesDropdown && (
                              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                {availableOptions.map((option) => (
                                  <div
                                    key={option.value}
                                    onClick={() => handleValueChange(option.value)}
                                    className={`p-2 text-sm text-gray-700 cursor-pointer hover:bg-blue-50 ${
                                      currentRule.values.includes(option.value)
                                        ? "bg-blue-100"
                                        : ""
                                    }`}
                                  >
                                    {option.label}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="mt-1 text-sm text-gray-500">
                          No options available for this question.
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setShowTargetingRulesModal(false);
                        setShowValuesDropdown(false);
                      }}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveRule}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium"
                    >
                      {currentRule.ruleIndex !== null ? "Save Changes" : "Add Rule"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showDeleteConfirmModal && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-md shadow-xl w-11/12 md:max-w-md">
                  <h4 className="text-xl font-bold mb-4 text-gray-800">
                    Confirm Deletion
                  </h4>
                  <p className="text-sm text-gray-600 mb-6">
                    Are you sure you want to delete this targeting rule? This action cannot be undone.
                  </p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowDeleteConfirmModal(false)}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteRule}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="w-full flex justify-center">
              <button
                onClick={handleSaveSurvey}
                className={`w-[10rem] py-3 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-700 hover:bg-blue-600"
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