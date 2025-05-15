import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Layout from "../../layout";
import AdminRoutes from "@/pages/adminRoutes";
import { useDispatch } from "react-redux";
import { clearTitle, hideAdd, hideExcel, hideRefresh, setTitle, showRefresh } from "@/store/adminbtnSlice";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const EditLiveSurveyQuestion = () => {
  const router = useRouter();
  const { slug: id } = router.query; // Get the `id` from the URL slug
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isActive: true,
    hubCoins: 0,
    link: '',
    profileSurveyId: '',
    pushToLiveSurvey: false, // Added new field
  });
  const [profileSurveys, setProfileSurveys] = useState([]);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // Separate loading state for data fetching

  useEffect(() => {
    dispatch(setTitle('Edit Live Survey Question'));
    dispatch(showRefresh({ label: 'Refresh', redirectTo: router.asPath }));

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
        setIsFetching(true);
        try {
          const response = await axios.get(
            `${API_BASE_URL}/live-survey/${id}`,
            {
              headers: {
                'x-api-key': API_KEY,
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );

          const survey = response.data;
          console.log("survey", survey);
          setFormData({
            title: survey.title || '',
            description: survey.description || '',
            isActive: survey.isActive ?? true,
            hubCoins: survey.hubCoins?.toString() || '0',
            link: survey.link || '',
            profileSurveyId: survey.profileSurveyId || '',
            pushToLiveSurvey: survey.pushToLiveSurvey ?? false, // Handle new field
          });
        } catch (error) {
          console.error('Error fetching survey details:', error);
          setNotification({
            type: 'error',
            message: 'Failed to load survey data',
          });
        } finally {
          setIsFetching(false);
        }
      };

      fetchSurveyDetails();
    }
  }, [id]);

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
        );
        setProfileSurveys(response.data.data || []);
      } catch (error) {
        console.error('Error fetching profile surveys:', error);
        setNotification({
          type: 'error',
          message: 'Failed to load profile surveys',
        });
      }
    };

    fetchProfileSurveys();
  }, []);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    if (name === 'hubCoins') {
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
    setNotification({ type: '', message: '' });
  };

  const handleSaveSurvey = async () => {
    setLoading(true);
    setNotification({ type: '', message: '' });

    const payload = {
      title: formData.title,
      description: formData.description,
      isActive: formData.isActive,
      hubCoins: parseInt(formData.hubCoins, 10),
      link: formData.link,
      profileSurveyId: formData.profileSurveyId || null,
      pushToLiveSurvey: formData.pushToLiveSurvey, // Include new field
    };

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
      );

      console.log('API Response:', response.data);

      setNotification({
        type: 'success',
        message: 'Live survey updated successfully',
      });

      setTimeout(() => {
        router.push('/admin/manage-surveys/live-survey');
      }, 2000);
    } catch (error) {
      console.error('Error saving survey:', error);
      setNotification({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update live survey',
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

        {isFetching ? (
          <div className='flex justify-center items-center h-48'>
            <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500'></div>
          </div>
        ) : (
          <>
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
                rows='3'
                value={formData.description}
                onChange={handleFormChange}
                className='w-full mt-2 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                placeholder='Enter survey description'
              ></textarea>
            </div>

            <div className='mb-6 sm:flex items-center gap-4'>
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
                className='w-full mt-2 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value=''>Select a profile survey</option>
                {profileSurveys.map((survey) => (
                  <option key={survey.id} value={survey.id}>
                    {survey.title}
                  </option>
                ))}
              </select>
            </div>

            <div className='mb-6'>
              <label className='block text-lg font-medium text-gray-800'>
                Status
              </label>
              <select
                name='isActive'
                value={formData.isActive ? 'Active' : 'Inactive'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive: e.target.value === 'Active',
                  }))
                }
                className='w-fit mt-2 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value='Active'>Active</option>
                <option value='Inactive'>Inactive</option>
              </select>
            </div>

            <div className='mb-6 flex gap-3 items-center'>
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
                onClick={handleSaveSurvey}
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
          </>
        )}
      </div>
    </div>
  );
};

export default AdminRoutes(EditLiveSurveyQuestion);