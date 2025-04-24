import MainLayout from "@/layouts/MainLayout";
import React, { useState } from "react";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'

const MultiStepUnsubscribe = () => {
  const { t } = useTranslation('unsubscribe')
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  // Handlers
  const handleNextStep = () => {
    if (step === 1) {
      if (!email) {
        setError(t('pleaseEnterEmail'))
      } else {
        setError('')
        setStep(2);
      }
    } else {
      setStep(step + 1);
    }
  };

  const handleUnsubscribe = () => {
    setStep(3);
  };

  const handleGoBack = () => {
    setStep(1);
    setEmail('')
  };

  return (
    <div className='poppins flex justify-center items-center h-[300px] md:min-h-[600px] '>
      <div className='  '>
        {step === 1 && (
          <div className='w-[95%] m-auto'>
            <h2 className='text-xl font-semibold mb-4'>{t('email')}</h2>
            <input
              type='email'
              placeholder={t('enterEmailAddress')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-2 border ${
                error ? 'border-red-500' : 'border-gray-300'
              } rounded mb-4`}
            />
            {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
            <button
              onClick={handleNextStep}
              className='bg-[#0057A1] text-white px-4 py-2 rounded-lg w-full'
            >
              {t('unsubscribe')}
            </button>
            <p className='text-gray-500 text-center font-bold md:w-[95%] text-[16px] md:text-sm mt-4'>
              {t('stopReceivingEmails')}
            </p>
          </div>
        )}

        {step === 2 && (
          <div className='w-[95%] md:w-[100%] m-auto'>
            <h2 className='text-[24px] md:text-[32px] text-center font-semibold mb-4 text-[#333333] '>
              {t('areYouSureUnsubscribe')}
            </h2>
            <p className='md:text-[20px] text-[#333333] mb-4 text-center'>
              {t('currentlySubscribed')}
              <br />
              <strong>{email}</strong>
            </p>
            <div className='flex justify-center gap-4 md:mt-12'>
              <button
                onClick={handleUnsubscribe}
                className='border border-gray-400 px-4 text-[16px] md:w-[200px] py-2 rounded-lg font-bold text-gray-700'
              >
                {t('yesUnsubscribe')}
              </button>
              <button
                onClick={handleGoBack}
                className='bg-[#0057A1] text-[16px] md:w-[200px] text-white px-4 py-2 rounded-lg font-bold'
              >
                {t('noNotYet')}
              </button>
            </div>
            <p className='text-gray-500 text-[20px] mt-4 md:w-[400px] md:mt-20 m-auto text-center'>
              {t('stopReceivingEmails')}
            </p>
          </div>
        )}

        {step === 3 && (
          <div className='w-[90%] m-auto md:w-[700px] text-center'>
            <h2 className='text-[24px] md:text-[45px] m-auto font-semibold md:mb-4'>
              {t('successfullyUnsubscribed')}
            </h2>
            <p className=' mt-6 md:mt-12 md:w-[500px] m-auto text-[18px] -mb-1'>
              {t('noLongerReceiveEmails')}
            </p>
            <p className=''>
              {t('changeMindSubscribeBack', {
                interpolation: { escapeValue: false },
                0: '<a href="#" class="text-blue-500 underline">',
                1: '</a>',
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  )
};

MultiStepUnsubscribe.Layout = MainLayout

export default MultiStepUnsubscribe;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'unsubscribe'])),
    },
  }
}