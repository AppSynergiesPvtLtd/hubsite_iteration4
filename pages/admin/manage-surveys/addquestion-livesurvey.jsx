import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../layout";
import AdminRoutes from "../../adminRoutes";
import { useDispatch } from "react-redux";
import { setTitle } from "@/store/adminbtnSlice";
import { useRouter } from "next/router";
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

const LiveSurveyQuestions = ({
  apiEndpoint = '/live-survey/',
  onSuccessRedirect,
}) => {
  const router = useRouter()
  const { t } = useTranslation('admin')
  const initialFormData = {
    title: '',
    description: '',
    hubCoins: 0,
    title: "",
    description: "",
    hubCoins: "",
    isActive: true,
    link: '',
    profileSurveyId: '',
  }

  const dispatch = useDispatch()
  dispatch(setTitle(t('manageSurveys.addQuestionLiveSurvey.pageTitle')))

  const [formData, setFormData] = useState(initialFormData)
  const [profileSurveys, setProfileSurveys] = useState([]) // Ensure it's initialized as an array
  const [notification, setNotification] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(initialFormData);
  const [profileSurveys, setProfileSurveys] = useState([]);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfileSurveys = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/profile-survey/?isActive=true`,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': API_KEY,
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )

        if (response.data && Array.isArray(response.data.data)) {
          setProfileSurveys(response.data.data)
        } else {
          setProfileSurveys([]) // Fallback to an empty array if the response isn't as expected
          console.error('Unexpected response format:', response.data)
          setProfileSurveys([]);
          console.error("Unexpected response format:", response.data);
          setNotification({
            type: 'error',
            message: t(
              'manageSurveys.addQuestionLiveSurvey.invalidProfileSurveyResponse'
            ),
          })
        }
      } catch (error) {
        console.error('Error fetching profile surveys:', error)
        setNotification({
          type: 'error',
          message: t(
            'manageSurveys.addQuestionLiveSurvey.loadProfileSurveyError'
          ),
        })
      }
    }

    fetchProfileSurveys()
  }, [t])

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    let newValue = type === 'checkbox' ? checked : value

    // If the field is hubCoins, ensure the value is between 0 and 100
    if (name === 'hubCoins') {
      let numValue = parseInt(newValue, 10)
    if (name === "hubCoins") {
      // Remove leading zeros and ensure it's a valid number
      let numValue = value.replace(/^0+/, '') || "0";
      numValue = parseInt(numValue, 10);
      
      if (isNaN(numValue)) {
        numValue = 0
      }
      if (numValue > 100) {
        numValue = 100
        numValue = "";
      } else if (numValue > 100) {
        numValue = 100;
      } else if (numValue < 0) {
        numValue = 0
      }
      newValue = numValue
      newValue = numValue.toString();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }))

    setNotification({ type: '', message: '' })
  }

  const handleSaveLiveSurvey = async () => {
    setLoading(true)
    setNotification({ type: '', message: '' })

    const payload = {
      title: formData.title,
      description: formData.description,
      hubCoins: parseInt(formData.hubCoins || 0, 10),
      isActive: formData.isActive,
      link: formData.link,
      ...(formData.profileSurveyId !== null &&
        formData.profileSurveyId !== '' && {
          profileSurveyId: formData.profileSurveyId,
        }),
    }

    try {
      console.log('payload', payload)
      console.log('hitt')
      const response = await axios.post(
        `${API_BASE_URL}/live-survey/`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      console.log("payload", payload);
      console.log("hitt");
      const response = await axios.post(`${API_BASE_URL}/live-survey/`, payload, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log('API Response:', response.data)

      setNotification({
        type: 'success',
        message: t('manageSurveys.addQuestionLiveSurvey.successMessage'),
      })

      // Reset the form
      setFormData(initialFormData)
      router.push('/admin/manage-surveys/live-survey')
      // Redirect on success
      setFormData(initialFormData);
      router.push("/admin/manage-surveys/live-survey");
      if (onSuccessRedirect) {
        setTimeout(() => {
          window.location.href = onSuccessRedirect
        }, 2000) // Redirect after 2 seconds
          window.location.href = onSuccessRedirect;
        }, 2000);
      }
    } catch (error) {
      console.error('Error saving live survey:', error)
      setNotification({
        type: 'error',
        message:
          error.response?.data?.message ||
          t('manageSurveys.addQuestionLiveSurvey.errorMessage'),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex justify-center'>
      <div className='w-full p-6 border rounded-md shadow-md bg-white'>
        {/* Notification Section */}
    <div className="flex justify-center">
      <div className="w-full p-6 border rounded-md shadow-md bg-white">
        {notification.message && (
          <div
            className={`mb-4 p-4 rounded-md text-white ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {notification.message}
          </div>
        )}

        {/* Title */}
        <div className='mb-6'>
          <label className='block text-lg font-medium text-gray-800'>
            {t('manageSurveys.addQuestionLiveSurvey.titleLabel')}
          </label>
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-800">Title*</label>
          <input
            name='title'
            value={formData.title}
            onChange={handleFormChange}
            className='w-full mt-2 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            placeholder={t(
              'manageSurveys.addQuestionLiveSurvey.titlePlaceholder'
            )}
          />
        </div>

        {/* Description */}
        <div className='mb-6'>
          <label className='block text-lg font-medium text-gray-800'>
            {t('manageSurveys.addQuestionLiveSurvey.descriptionLabel')}
          </label>
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-800">Description</label>
          <textarea
            name='description'
            rows='2'
            value={formData.description}
            onChange={handleFormChange}
            className='w-full mt-2 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            placeholder={t(
              'manageSurveys.addQuestionLiveSurvey.descriptionPlaceholder'
            )}
          ></textarea>
        </div>

        {/* HubCoins */}
        <div className='mb-6 block sm:flex items-center gap-4 overflow-hidden'>
          <label className='block text-lg font-medium text-gray-700'>
            {t('manageSurveys.addQuestionLiveSurvey.hubcoinsLabel')}
          </label>
        <div className="mb-6 block sm:flex items-center gap-4 overflow-hidden">
          <label className="block text-lg font-medium text-gray-700">HubCoins*</label>
          <input
            type='number'
            name='hubCoins'
            value={formData.hubCoins}
            onChange={handleFormChange}
            min='0'
            max='100'
            className='w-fit p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder={t(
              'manageSurveys.addQuestionLiveSurvey.hubcoinsPlaceholder'
            )}
          />
        </div>

        {/* Link */}
        <div className='mb-6'>
          <label className='block text-lg font-medium text-gray-800'>
            {t('manageSurveys.addQuestionLiveSurvey.linkLabel')}
          </label>
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-800">Link*</label>
          <input
            name='link'
            value={formData.link}
            onChange={handleFormChange}
            className='w-full mt-2 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            placeholder={t(
              'manageSurveys.addQuestionLiveSurvey.linkPlaceholder'
            )}
          />
        </div>

        {/* Profile Survey ID */}
        <div className='mb-6'>
          <label className='block text-lg font-medium text-gray-800'>
            {t('manageSurveys.addQuestionLiveSurvey.profileSurveyIdLabel')}
          </label>
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-800">Profile Survey ID</label>
          <select
            name='profileSurveyId'
            value={formData.profileSurveyId}
            onChange={handleFormChange}
            className='w-full mt-2 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value=''>
              {t('manageSurveys.addQuestionLiveSurvey.selectProfileSurvey')}
            </option>
            {profileSurveys.map((survey) => (
              <option key={survey.id} value={survey.id}>
                {survey.title}
              </option>
            ))}
          </select>
        </div>

        {/* Save Button */}
        <div className='w-full flex justify-center'>
        <div className="w-full flex justify-center">
          <button
            onClick={handleSaveLiveSurvey}
            className={`w-[10rem] py-3 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-700 hover:bg-blue-600'
            } text-white text-lg font-semibold rounded-md shadow-sm transition`}
            disabled={loading}
          >
            {loading
              ? t('manageSurveys.addQuestionLiveSurvey.savingButton')
              : t('manageSurveys.addQuestionLiveSurvey.saveButton')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminRoutes(LiveSurveyQuestions)

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'admin'])),
    },
  }
}
export default AdminRoutes(LiveSurveyQuestions);