import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from 'next-i18next'

const Yoursurvey = () => {
  const { t } = useTranslation('dashboard')
  const router = useRouter();
  const [selectedButton, setSelectedButton] = useState(null); 

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName) 
  };

  return (
    <div className='p-4 poppins'>
      <div className='flex flex-wrap md:flex-row justify-center w-full md:w-[800px] m-auto gap-3 poppins '>
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
          {t('yoursurvey.tabs.liveSurvey')}
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
          {t('yoursurvey.tabs.yourSurvey')}
        </div>
      </div>

      <div className=' shadow-lg w-full md:w-[80%] border border-gray-200 m-auto flex  md:flex-row justify-between items-center  mt-4 bg-white rounded-lg'>
        <div className=' text-center flex flex-wrap   border-b-8 border-b-[#0057A1] mb-2 md:mb-0 w-24 md:w-[250px] md:h-[80px]'>
          <p className='md:text-xl font-bold md:ml-4 w-[80px]'>
            <span className='md:text-2xl md:ml-4'>
              <b>10</b>
            </span>{' '}
            {t('yoursurvey.hubscore.count')}
          </p>
        </div>
        <div className=' min-w-[150px] w-[200px] md:w-auto'>
          <p className='poppins font-24 text-center md:text-left p-4'>
            {t('yoursurvey.hubscore.redeemMessage')}
          </p>
        </div>
      </div>

      <div className='shadow-lg w-full md:w-[80%] m-auto flex justify-between items-center p-4 mt-4 bg-gradient-to-r from-[#008AFFDB] to-[#0057A1] rounded-lg'>
        <div className='flex items-center gap-2'>
          <Image
            src='/dashboardimg1.png'
            alt='More About You Icon'
            width={24}
            height={24}
          />
          <p className='font-medium text-white'>
            {t('yoursurvey.earningSection.title')}
          </p>
        </div>
        <div>
          <p className='font-bold text-white text-sm'>
            {t('yoursurvey.earningSection.earnLabel')}
          </p>
        </div>
      </div>

      <div className='w-[95%] md:w-[80%] m-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mt-6 rounded-lg'>
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className='shadow-lg rounded-lg border border-gray-200 bg-white flex flex-col justify-between'
          >
            <div className='flex items-center gap-2 mb-4 px-4'>
              <span className='bg-[#0057A1] text-white px-2 mt-4 py-1 rounded-full text-xs'>
                {t('yoursurvey.surveyCard.status')}
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
                  {t('yoursurvey.surveyCard.question')}
                </p>
                <p className='text-sm text-gray-500'>
                  5 {t('yoursurvey.surveyCard.timeLabel')}
                </p>
              </div>
              <div className='ml-auto text-center'>
                <p className='font-bold text-2xl'>20</p>
                <p className='text-xs font-semibold'>
                  {t('yoursurvey.surveyCard.coinsLabel')}
                </p>
              </div>
            </div>
            <Link href='/surveys'>
              <div className='mt-4 border text-[#0057A1] border-gray-300 w-full py-2 transition duration-200 text-center cursor-pointer'>
                {t('yoursurvey.surveyCard.actionButton')}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
};

export default Yoursurvey;