import React from 'react'

import Welcome from '@/components/Home/WelcomeBanner/WelcomeBanner'
import SignUpSection from '@/components/Works/Signupsection'
import OnboardingSection from '@/components/Works/OnboardingSection'
import CompleteProfileSection from '@/components/Works/CompleteProfileSection'
import SurveysSection from '@/components/Works/SurveysSection'
import RewardSection from './RewardsSection'
import MainLayout from '@/layouts/MainLayout'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'

const Work = () => {
  const { t } = useTranslation('works')
  return (
    <div>
      <Welcome heading={t('heading')} />
      <div className='text-center m-auto max-w-[75%] md:mt-12 '>
        <h1 className='text-[#303F9E] text-4xl font-bold md:text-[45px]'>
          {t('title')}
        </h1>
        <p className=' text- mt-8'>{t('description')}</p>
      </div>
      <SignUpSection />
      <CompleteProfileSection />
      <OnboardingSection />
      <SurveysSection />

      <RewardSection />
    </div>
  )
}

Work.Layout = MainLayout

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'works'])),
    },
  }
}

export default Work
