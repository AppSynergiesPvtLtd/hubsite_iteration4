import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useTranslation } from 'next-i18next'

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const DashboardLanding = () => {
  const { t } = useTranslation('dashboard')
  const user = useSelector((state) => state.user?.user);

  console.log(user?.id, "user data from redux store");
  const router = useRouter();
  const [selectedButton, setSelectedButton] = useState("LiveSurvey");
  const [liveSurveys, setLiveSurveys] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  useEffect(() => {
    if (selectedButton === 'LiveSurvey') {
      fetchLiveSurveys()
    } else if (selectedButton === 'YourSurvey') {
      if (user && user.id) {
        fetchYourSurveys()
      } else {
        setLiveSurveys([])
      }
    }
  }, [selectedButton, user]);

  const fetchLiveSurveys = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/live-survey/?page=1&limit=10&isActive=true`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            Authorization: `Bearer ${localStorage.getItem('user_token')}`,
          },
        }
      )
      const data = await response.json()
      if (response.ok) {
        setLiveSurveys(data.data || []);
      } else {
        console.error(t('index.fetchError'), data.message)
      }
    } catch (error) {
      console.error(t('index.generalError'), error)
    } finally {
      setLoading(false);
    }
  };

  const fetchYourSurveys = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/live-survey/your-surveys/${user.id}?page=1&limit=10`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            Authorization: `Bearer ${localStorage.getItem('user_token')}`,
          },
        }
      )
      const data = await response.json();
      if (response.ok) {
        setLiveSurveys(data.data || []);
      } else {
        console.error(t('index.fetchError'), data.message)
      }
    } catch (error) {
      console.error(t('index.generalError'), error)
    } finally {
      setLoading(false);
    }
  };


  console.log(liveSurveys, "live surveys data");
  return (
    <div className='p-4 poppins'>
      <div className='flex flex-wrap md:flex-row justify-center w-full md:w-[800px] m-auto gap-3 poppins'>
        <div
          onClick={() => handleButtonClick('LiveSurvey')}
          className={`flex w-[40vw] md:w-[300px] rounded-lg justify-center items-center text-[16px] ${
            selectedButton === 'LiveSurvey'
              ? 'border-2 border-[#0057A1]'
              : 'border-2 border-gray-300'
          } py-2 cursor-pointer hover:bg-gray-100 text-gray-700`}
        >
          <Image
            src='/dashboardbtn1.png'
            alt='Live Survey Icon'
            width={24}
            height={24}
            className='mr-2'
          />
          {t('index.LiveSurvey')}
        </div>

        <div
          onClick={() => handleButtonClick('YourSurvey')}
          className={`flex w-[40vw] md:w-[300px] rounded-lg justify-center items-center text-[16px] ${
            selectedButton === 'YourSurvey'
              ? 'border-2 border-[#0057A1]'
              : 'border-2 border-gray-300'
          } py-2 cursor-pointer hover:bg-gray-100 text-gray-700`}
        >
          <Image
            src='/dashboardbtn2.png'
            alt='Your Survey Icon'
            width={24}
            height={24}
            className='mr-2'
          />
          {t('index.YourSurvey')}
        </div>
      </div>

      <div className='w-[95%] md:w-[80%] m-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mt-6 rounded-lg'>
        {loading ? (
          <p className='text-center col-span-2'>{t('index.LoadingSurveys')}</p>
        ) : liveSurveys.length > 0 ? (
          liveSurveys.map((survey) => (
            <div
              key={survey.id}
              className='shadow-lg rounded-lg border border-gray-200 bg-white flex flex-col justify-between'
            >
              <div className='flex items-center gap-2 mb-4 px-4'>
                <span className='bg-[#0057A1] text-white px-2 mt-4 py-1 rounded-full text-xs'>
                  {survey.isActive ? t('index.Active') : t('index.Inactive')}
                </span>
              </div>
              <div className='flex items-center gap-4 px-5'>
                <Image
                  src='/book.png'
                  alt='Survey Icon'
                  width={36}
                  height={44}
                  className='w-9 h-11'
                />
                <div>
                  <p className='text-lg font-medium text-gray-800'>
                    {survey.title}
                  </p>
                  <p className='text-sm text-gray-500'>{survey.description}</p>
                </div>
                <div className='ml-auto text-center'>
                  <p className='font-bold text-2xl'>{survey.hubCoins}</p>
                  <p className='text-xs font-semibold'>{t('index.HUBCOINS')}</p>
                </div>
              </div>
              {survey.link && survey.link !== "" ? (
                <a
                  href={`${survey.link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 border text-[#0057A1] border-gray-300 w-full py-2 transition duration-200 text-center cursor-pointer hover:bg-gray-100"
                >
                  {t('index.TakeSurvey')}
                </a>
              ) : (
                <div
                    className="mt-4 border text-gray-400 border-gray-300 w-full py-2 text-center cursor-not-allowed bg-gray-100"
                    
                >
                  {t('index.TakeSurvey')}
                </div>
              
              )}
            </div>
          ))
        ) : (
          <p className='text-center col-span-2'>
            {t('index.NoSurveysAvailable')}
          </p>
        )}
      </div>
    </div>
  )
};

export default DashboardLanding;