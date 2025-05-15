import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../layout";
import AdminRoutes from "../../adminRoutes";
import { useDispatch } from "react-redux";
import { setTitle } from "@/store/adminbtnSlice";
import { useRouter } from "next/router";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const LiveSurveyQuestions = ({
  apiEndpoint = '/live-survey/',
  onSuccessRedirect,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const initialFormData = {
    title: '',
    description: '',
    hubCoins: '',
    isActive: true,
    link: '',
    profileSurveyId: '',
    pushToLiveSurvey: false,
  };

  dispatch(setTitle("Add Live Survey"));

  const [formData, setFormData] = useState(initialFormData);
  const [profileSurveys, setProfileSurveys] = useState([]);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  // Fetch profile surveys
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
        );

        if (response.data && Array.isArray(response.data.data)) {
          setProfileSurveys(response.data.data);
        } else {
          setProfileSurveys([]);
          console.error('Unexpected response format:', response.data);
          setNotification({
            type: 'error',
            message: "Invalid profile survey data",
          });
        }
      } catch (error) {
        console.error('Error fetching profile surveys:', error);
        setNotification({
          type: 'error',
          message: "Failed to load profile surveys",
        });
      }
    };

    fetchProfileSurveys();
  }, []);

  // Fetch existing survey data for editing
  useEffect(() => {
    const fetchSurvey = async () => {
      if (router.query.id) {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/live-survey/${router.query.id}`,
            {
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
          setFormData({
            title: response.data.data.title || '',
            description: response.data.data.description || '',
            hubCoins: response.data.data.hubCoins?.toString() || '',
            isActive: response.data.data.isActive ?? true,
            link: response.data.data.link || '',
            profileSurveyId: response.data.data.profileSurveyId || '',
            pushToLiveSurvey: response.data.data.pushToLiveSurvey ?? false,
          });
        } catch (error) {
          console.error('Error fetching survey:', error);
          setNotification({
            type: 'error',
            message: "Failed to load survey data",
          });
        }
      }
    };
    fetchSurvey();
  }, [router.query.id]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    if (name === 'hubCoins') {
      let numValue = value.replace(/^0+/, '') || '0';
      numValue = parseInt(numValue, 10);

      if (isNaN(numValue)) {
        numValue = 0;
      }
      if (numValue > 100) {
        numValue = '100';
      } else if (numValue < 0) {
        numValue = '0';
      }
      newValue = numValue.toString();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    setNotification({ type: '', message: '' });
  };

  const handleSaveLiveSurvey = async () => {
    setLoading(true);
    setNotification({ type: '', message: '' });

    const payload = {
      title: formData.title,
      description: formData.description,
      hubCoins: parseInt(formData.hubCoins || 0, 10),
      isActive: formData.isActive,
      link: formData.link,
      pushToLiveSurvey: formData.pushToLiveSurvey,
      ...(formData.profileSurveyId !== null &&
        formData.profileSurveyId !== '' && {
          profileSurveyId: formData.profileSurveyId,
        }),
    };

    try {
      const isUpdate = router.query.id;
      const url = isUpdate
        ? `${API_BASE_URL}/live-survey/${router.query.id}`
        : `${API_BASE_URL}/live-survey/`;
      const method = isUpdate ? 'put' : 'post';

      const response = await axios[method](url, payload, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log('API Response:', response.data);

      setNotification({
        type: 'success',
        message: isUpdate ? "Live survey updated successfully" : "Live survey created successfully",
      });

      setFormData(initialFormData);
      router.push('/admin/manage-surveys/live-survey');

      if (onSuccessRedirect) {
        setTimeout(() => {
          window.location.href = onSuccessRedirect;
        }, 2000);
      }
    } catch (error) {
      console.error('Error saving live survey:', error);
      setNotification({
        type: 'error',
        message: error.response?.data?.message || "Failed to save live survey",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center'>
      <div className='w-full p-6 border rounded-md shadow-md bg-white'>
        {notification.message && (
          <div
            className={`mb-4 p-4 rounded-md text-white ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {notification.message}
          </div>
        )}

        <div className='mb-6'>
          <label className='block text-lg font-medium text-gray-800'>
            Title
          </label>
          <input
            name='title'
            value={formData.title}
            onChange={handleFormChange}
            className='w-full mt-2 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            placeholder='Enter survey title'
          />
        </div>

        <div className='mb-6'>
          <label className='block text-lg font-medium text-gray-800'>
            Description
          </label>
          <textarea
            name='description'
            rows='2'
            value={formData.description}
            onChange={handleFormChange}
            className='w-full mt-2 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            placeholder='Enter survey description'
          ></textarea>
        </div>

        <div className='mb-6 block sm:flex items-center gap-4 overflow-hidden'>
          <label className='block text-lg font-medium text-gray-700'>
            Hub Coins
          </label>
          <input
            type='number'
            name='hubCoins'
            value={formData.hubCoins}
            onChange={handleFormChange}
            min='0'
            max='100'
            className='w-fit p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Enter hub coins (0-100)'
          />
        </div>

        <div className='mb-6'>
          <label className='block text-lg font-medium text-gray-800'>
            Survey Link
          </label>
          <input
            name='link'
            value={formData.link}
            onChange={handleFormChange}
            className='w-full mt-2 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            placeholder='Enter survey link'
          />
        </div>

        <div className='mb-6'>
          <label className='block text-lg font-medium text-gray-800'>
            Profile Survey
          </label>
          <select
            name='profileSurveyId'
            value={formData.profileSurveyId}
            onChange={handleFormChange}
            className='w-full mt-2 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value=''>
              Select a profile survey
            </option>
            {profileSurveys.map((survey) => (
              <option key={survey.id} value={survey.id}>
                {survey.title}
              </option>
            ))}
          </select>
        </div>

        <div className='mb-6 flex gap-2 items-center'>
          <label className='block text-sm font-medium text-gray-800'>
            Push to Live Survey
          </label>
          <div className='mt-2'>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                name='pushToLiveSurvey'
                checked={formData.pushToLiveSurvey}
                onChange={handleFormChange}
                className='sr-only peer'
              />
              <div className='w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-300 transition-colors duration-200'></div>
              <div className='absolute w-4 h-4 bg-white rounded-full top-1 left-1 peer-checked:translate-x-5 transition-transform duration-200'></div>
            </label>
          </div>
        </div>

        <div className='w-full flex justify-center'>
          <button
            onClick={handleSaveLiveSurvey}
            className={`w-[10rem] py-3 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-700 hover:bg-blue-600'
            } text-white text-lg font-semibold rounded-md shadow-sm transition`}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminRoutes(LiveSurveyQuestions);