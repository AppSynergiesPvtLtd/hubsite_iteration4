import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Layout from "../../layout";
import AdminRoutes from "@/pages/adminRoutes";
import { useDispatch } from "react-redux";
import { clearTitle, hideAdd, hideExcel, hideRefresh, setTitle, showRefresh } from "@/store/adminbtnSlice";
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

const EditLiveSurveyQuestion = () => {
  const router = useRouter()
  const { slug: id } = router.query // Get the `id` from the URL slug
  const { t } = useTranslation('admin')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isActive: true,
    hubCoins: 0,
    link: '',
    profileSurveyId: '',
  })
  const [profileSurveys, setProfileSurveys] = useState([])
  const [notification, setNotification] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false) // Separate loading state for data fetching

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setTitle('Add Live Survey Question'))
    dispatch(showRefresh({ label: 'Refresh', redirectTo: router.asPath }))

    // Clean up on unmount
    return () => {
      dispatch(hideAdd())
      dispatch(hideRefresh())
      dispatch(hideExcel())
      dispatch(clearTitle())
    }
  }, [dispatch, router.asPath])

  // Fetch survey details based on `id`
  useEffect(() => {
    if (id) {
      const fetchSurveyDetails = async () => {
        setIsFetching(true) // Start fetching
        try {
          const response = await axios.get(
            `${API_BASE_URL}/live-survey/${id}`,
            {
              headers: {
                'x-api-key': API_KEY,
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          )

          const survey = response.data
          console.log("survey",survey)
          // Populate form fields with response data
          setFormData({
            title: survey.title || '',
            description: survey.description || '',
            isActive: survey.isActive || false,
            hubCoins: survey.hubCoins || 0,
            link: survey.link || '',
            profileSurveyId: survey.profileSurveyId || null,
          })
        } catch (error) {
          console.error('Error fetching survey details:', error)
          setNotification({
            type: 'error',
            message: t('manageSurveys.liveSurveyQuestions.loadError'),
          })
        } finally {
          setIsFetching(false) // Stop fetching
        }
      }

      fetchSurveyDetails()
    }
  }, [id, t])

  // Fetch all active profile surveys to populate the dropdown
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
        // Assuming the API response data structure has a `data` property that holds the array.
        setProfileSurveys(response.data.data || [])
      } catch (error) {
        console.error('Error fetching profile surveys:', error)
      }
    }

    fetchProfileSurveys()
  }, [])

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    let newValue = type === 'checkbox' ? checked : value

    // If the field is hubCoins, ensure the value is between 0 and 100
    if (name === 'hubCoins') {
      let numValue = parseInt(newValue, 10)
      if (isNaN(numValue)) {
        numValue = 0
      }
      if (numValue > 100) {
        numValue = 100
      } else if (numValue < 0) {
        numValue = 0
      }
      newValue = numValue
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }))
    setNotification({ type: '', message: '' })
  }

  const handleSaveSurvey = async () => {
    setLoading(true) // Start saving
    setNotification({ type: '', message: '' })

    const payload = {
      title: formData.title,
      description: formData.description,
      isActive: formData.isActive,
      hubCoins: parseInt(formData.hubCoins, 10),
      link: formData.link,
      profileSurveyId: formData.profileSurveyId,
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/live-survey/${id}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      console.log('API Response:', response.data)

      setNotification({
        type: 'success',
        message: t('manageSurveys.liveSurveyQuestions.updateSuccess'),
      })

      // Redirect on success
      setTimeout(() => {
        router.push('/admin/manage-surveys/live-survey')
      }, 2000)
    } catch (error) {
      console.error('Error saving survey:', error)
      setNotification({
        type: 'error',
        message:
          error.response?.data?.message ||
          t('manageSurveys.liveSurveyQuestions.updateError'),
      })
    } finally {
      setLoading(false) // Stop saving
    }
  }

  return (
    <div className='flex justify-center'>
      <div className='w-full p-6 border rounded-md shadow-md bg-white'>
        {/* Notification Section */}
        {notification.message && (
          <div
            className={`mb-4 p-4 rounded-md text-white ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {notification.message}
          </div>
        )}

        {/* Show spinner if data is loading */}
        {isFetching ? (
          <div className='flex justify-center items-center h-48'>
            <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500'></div>
          </div>
        ) : (
          <>
            {/* Title */}
            <div className='mb-6'>
              <label className='block text-lg font-medium text-gray-800'>
                {t('manageSurveys.liveSurveyQuestions.titleLabel')}
              </label>
              <input
                name='title'
                value={formData.title}
                onChange={handleFormChange}
                className='w-full mt-2 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                placeholder={t(
                  'manageSurveys.liveSurveyQuestions.titlePlaceholder'
                )}
              />
            </div>

            {/* Description */}
            <div className='mb-6'>
              <label className='block text-lg font-medium text-gray-800'>
                {t('manageSurveys.liveSurveyQuestions.descriptionLabel')}
              </label>
              <textarea
                name='description'
                rows='3'
                value={formData.description}
                onChange={handleFormChange}
                className='w-full mt-2 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                placeholder={t(
                  'manageSurveys.liveSurveyQuestions.descriptionPlaceholder'
                )}
              ></textarea>
            </div>

            {/* HubCoins */}
            <div className='mb-6 sm:flex items-center gap-4'>
              <label className='block text-lg font-medium text-gray-700'>
                {t('manageSurveys.liveSurveyQuestions.hubCoinsLabel')}
              </label>
              <input
                type='number'
                name='hubCoins'
                value={formData.hubCoins}
                onChange={handleFormChange}
                min='0'
                max='100'
                className='w-fit p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder={t(
                  'manageSurveys.liveSurveyQuestions.hubCoinsPlaceholder'
                )}
              />
            </div>

            {/* Link */}
            <div className='mb-6'>
              <label className='block text-lg font-medium text-gray-800'>
                {t('manageSurveys.liveSurveyQuestions.linkLabel')}
              </label>
              <input
                name='link'
                value={formData.link}
                onChange={handleFormChange}
                className='w-full mt-2 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                placeholder={t(
                  'manageSurveys.liveSurveyQuestions.linkPlaceholder'
                )}
              />
            </div>

            {/* Profile Survey Dropdown */}
            <div className='mb-6'>
              <label className='block text-lg font-medium text-gray-800'>
                {t('manageSurveys.liveSurveyQuestions.profileSurveyLabel')}
              </label>
              <select
                name='profileSurveyId'
                value={formData.profileSurveyId}
                onChange={handleFormChange}
                className='w-full mt-2 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value=''>
                  {t('manageSurveys.liveSurveyQuestions.profileSurveySelect')}
                </option>
                {profileSurveys.map((survey) => (
                  <option key={survey.id} value={survey.id}>
                    {survey.title}
                  </option>
                ))}
              </select>
            </div>

            {/* IsActive */}
            <div className='mb-6'>
              <label className='block text-lg font-medium text-gray-700'>
                {t('manageSurveys.liveSurveyQuestions.statusLabel')}
              </label>
              <select
                name='isActive'
                value={
                  formData.isActive
                    ? t('manageSurveys.liveSurveyQuestions.statusActive')
                    : t('manageSurveys.liveSurveyQuestions.statusInactive')
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive:
                      e.target.value ===
                      t('manageSurveys.liveSurveyQuestions.statusActive'),
                  }))
                }
                className='w-fit mt-2 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option
                  value={t('manageSurveys.liveSurveyQuestions.statusActive')}
                >
                  {t('manageSurveys.liveSurveyQuestions.statusActive')}
                </option>
                <option
                  value={t('manageSurveys.liveSurveyQuestions.statusInactive')}
                >
                  {t('manageSurveys.liveSurveyQuestions.statusInactive')}
                </option>
              </select>
            </div>

            {/* Save Button */}
            <div className='w-full flex justify-center'>
              <button
                onClick={handleSaveSurvey}
                className={`w-[10rem] py-3 ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-700 hover:bg-blue-600'
                } text-white text-lg font-semibold rounded-md shadow-sm transition`}
                disabled={loading}
              >
                {loading
                  ? t('manageSurveys.liveSurveyQuestions.saving')
                  : t('manageSurveys.liveSurveyQuestions.save')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminRoutes(EditLiveSurveyQuestion)

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'admin'])),
    },
  }
}