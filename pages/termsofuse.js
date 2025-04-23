import MainLayout from '@/layouts/MainLayout';
import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'

const TermsOfUse = () => {
  const { t } = useTranslation('terms')

  return (
    <div className='poppins md:w-[75%] mx-auto my-8 p-4 text-gray-800 text-[16px]'>
      <h1 className='m-auto w-fit text-xl md:text-4xl font-bold mb-4'>
        {t('termsAndConditions')}
      </h1>

      <h1 className='text-xl font-bold mb-4 text-gray-900'>
        {t('introduction')}
      </h1>
      <p className='mb-6'>{t('welcomeToHubsiteSocial')}</p>

      <h1 className='text-xl font-bold mb-4 text-gray-900'>
        {t('eligibility')}
      </h1>
      <p className='mb-4'>{t('ageRequirement')}</p>
      <p className='mb-4'>{t('residency')}</p>
      <p className='mb-4'>{t('accuracyOfInformation')}</p>

      <h1 className='text-xl font-bold mb-4 text-gray-900'>
        {t('registrationAndAccountManagement')}
      </h1>
      <p className='mb-4'>{t('registrationProcess')}</p>
      <p className='mb-4'>{t('accountResponsibility')}</p>
      <p className='mb-4'>{t('prohibitionOfMultipleAccounts')}</p>
      <p className='mb-4'>{t('terminationOfAccount')}</p>

      <h1 className='text-xl font-bold mb-4 text-gray-900'>
        {t('participationInSurveys')}
      </h1>
      <p className='mb-4'>{t('surveyInvitations')}</p>
      <p className='mb-4'>{t('accuracyOfSurveyResponses')}</p>
      <p className='mb-4'>{t('confidentialityOfSurveyContent')}</p>
      <p className='mb-4'>{t('integrityOfSurveys')}</p>

      <h1 className='text-xl font-bold mb-4 text-gray-900'>
        {t('incentivesAndRewards')}
      </h1>
      <p className='mb-4'>{t('earningRewards')}</p>
      <p className='mb-4'>{t('redemptionOfRewards')}</p>
      <p className='mb-4'>{t('expirationOfRewards')}</p>
      <p className='mb-4'>{t('forfeitureOfRewards')}</p>

      <h1 className='text-xl font-bold mb-4 text-gray-900'>
        {t('privacyPolicy')}
      </h1>
      <p className='mb-4'>{t('dataCollection')}</p>
      <p className='mb-4'>{t('useOfData')}</p>

      <h1 className='text-xl font-bold mb-4 text-gray-900'>
        {t('intellectualProperty')}
      </h1>
      <p className='mb-4'>{t('allContentSurveysAndMaterials')}</p>
    </div>
  )
};

TermsOfUse.Layout = MainLayout
export default TermsOfUse;

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'terms'])),
    },
  }
}