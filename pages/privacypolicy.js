import React from "react";
import { motion } from "framer-motion";
import MainLayout from "@/layouts/MainLayout";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'

const PrivacyPolicy = () => {
  const { t } = useTranslation('privacypolicy')

  const fadeIn = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const staggerContainer = {
    initial: {},
    animate: { transition: { staggerChildren: 0.2 } },
  }

  return (
    <motion.div
      className='poppins w-[95%] md:w-[80%] mx-auto py-8 text-gray-800'
      variants={staggerContainer}
      initial='initial'
      animate='animate'
    >
      <motion.h1
        className='text-3xl font-bold text-center mb-6'
        {...fadeIn}
        transition={{ duration: 0.8 }}
      >
        {t('privacyPolicyTitle')}
      </motion.h1>

      <motion.div className='space-y-6' variants={staggerContainer}>
        <motion.section {...fadeIn}>
          <h2 className='text-xl font-semibold mb-2'>
            {t('introductionTitle')}
          </h2>
          <p>{t('introductionText')}</p>
        </motion.section>

        <motion.section {...fadeIn}>
          <h2 className='text-xl font-semibold mb-2'>
            {t('informationCollectTitle')}
          </h2>
          <p className='mb-2'>{t('informationCollectDirect')}</p>
          <ul className='list-disc list-inside space-y-1'>
            <li>{t('informationCollectListName')}</li>
            <li>{t('informationCollectListEmail')}</li>
            <li>{t('informationCollectListPostal')}</li>
            <li>{t('informationCollectListPhone')}</li>
            <li>{t('informationCollectListDemographic')}</li>
          </ul>
          <p className='mt-4'>{t('informationCollectSurvey')}</p>
          <p>{t('informationCollectUsage')}</p>
        </motion.section>

        <motion.section {...fadeIn}>
          <h2 className='text-xl font-semibold mb-2'>
            {t('informationUseTitle')}
          </h2>
          <ul className='list-disc list-inside space-y-1'>
            <li>{t('informationUseListProvide')}</li>
            <li>{t('informationUseListProcess')}</li>
            <li>{t('informationUseListCommunicate')}</li>
            <li>{t('informationUseListTailor')}</li>
            <li>{t('informationUseListConduct')}</li>
          </ul>
          <p className='mt-4'>{t('informationUseConsent')}</p>
        </motion.section>

        <motion.section {...fadeIn}>
          <h2 className='text-xl font-semibold mb-2'>
            {t('dataSharingTitle')}
          </h2>
          <p>{t('dataSharingService')}</p>
          <p>{t('dataSharingLegal')}</p>
        </motion.section>

        <motion.section {...fadeIn}>
          <h2 className='text-xl font-semibold mb-2'>
            {t('dataSecurityTitle')}
          </h2>
          <p>{t('dataSecurityMeasures')}</p>
          <p>{t('dataSecurityGuarantee')}</p>
        </motion.section>

        <motion.section {...fadeIn}>
          <h2 className='text-xl font-semibold mb-2'>
            {t('dataRetentionTitle')}
          </h2>
          <p>{t('dataRetentionText')}</p>
        </motion.section>

        <motion.section {...fadeIn}>
          <h2 className='text-xl font-semibold mb-2'>{t('yourRightsTitle')}</h2>
          <ul className='list-disc list-inside space-y-1'>
            <li>{t('yourRightsListAccess')}</li>
            <li>{t('yourRightsListDelete')}</li>
            <li>{t('yourRightsListOptOut')}</li>
          </ul>
        </motion.section>

        <motion.section {...fadeIn}>
          <h2 className='text-xl font-semibold mb-2'>
            {t('changesPolicyTitle')}
          </h2>
          <p>{t('changesPolicyUpdate')}</p>
          <p>{t('changesPolicyAccept')}</p>
        </motion.section>

        <motion.section {...fadeIn}>
          <h2 className='text-xl font-semibold mb-2'>{t('contactUsTitle')}</h2>
          <p>{t('contactUsText')}</p>
          <p className='mt-2'>
            <strong>{t('contactUsCompany')}</strong>
            <br />
            {t('contactUsEmail')}{' '}
            <a
              href='mailto:support@hubsitesocial.com'
              className='text-blue-600 underline'
            >
              hello@hubsitesocial.com
            </a>
            <br />
            {t('contactUsPhone')} +260974314084
            <br />
            {t('contactUsAddress')}
          </p>
        </motion.section>
      </motion.div>
    </motion.div>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'privacypolicy'])),
    },
  }
}

PrivacyPolicy.Layout = MainLayout
export default PrivacyPolicy