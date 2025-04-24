import React from "react";
import { motion } from "framer-motion";
import MainLayout from "@/layouts/MainLayout";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'

const RewardPolicy = () => {
  const { t } = useTranslation('rewardpolicy')

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.2 } },
    exit: { opacity: 0 },
  };

  const fadeInVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      className='poppins md:w-[75%] mx-auto my-8 p-4 text-gray-800'
      variants={containerVariants}
      initial='initial'
      animate='animate'
      exit='exit'
    >
      {/* Title */}
      <motion.h1
        className='text-2xl md:text-4xl font-bold mb-6 text-center text-gray-900'
        variants={fadeInVariants}
      >
        {t('title')}
      </motion.h1>

      {/* Sections */}
      <motion.div className='space-y-6' variants={containerVariants}>
        {/* Section 1 */}
        <motion.section variants={fadeInVariants}>
          <h2 className='text-xl font-bold mb-4 text-gray-900'>
            {t('section1.title')}
          </h2>
          <p className='mb-6'>{t('section1.content')}</p>
        </motion.section>

        {/* Section 2 */}
        <motion.section variants={fadeInVariants}>
          <h2 className='text-xl font-bold mb-4 text-gray-900'>
            {t('section2.title')}
          </h2>
          <p className='mb-4'>
            <span>{t('section2.eligibility.title')}</span>
            {t('section2.eligibility.content')}
          </p>
          <p className='mb-4'>
            <span>{t('section2.types.title')}</span>
            {t('section2.types.content')}
          </p>
          <p className='mb-4'>
            <span>{t('section2.accumulation.title')}</span>
            {t('section2.accumulation.content')}
          </p>
        </motion.section>

        {/* Section 3 */}
        <motion.section variants={fadeInVariants}>
          <h2 className='text-xl font-bold mb-4 text-gray-900'>
            {t('section3.title')}
          </h2>
          <p className='mb-4'>
            <span>{t('section3.process.title')}</span>
            {t('section3.process.content')}
          </p>
          <p className='mb-4'>
            <span>{t('section3.threshold.title')}</span>
            {t('section3.threshold.content')}
          </p>
          <p className='mb-4'>
            <span>{t('section3.methods.title')}</span>
            {t('section3.methods.content')}
          </p>
          <p className='mb-4'>
            <span>{t('section3.time.title')}</span>
            {t('section3.time.content')}
          </p>
        </motion.section>

        {/* Section 4 */}
        <motion.section variants={fadeInVariants}>
          <h2 className='text-xl font-bold mb-4 text-gray-900'>
            {t('section4.title')}
          </h2>
          <p className='mb-4'>
            <span>{t('section4.expiration.title')}</span>
            {t('section4.expiration.content')}
          </p>
          <p className='mb-4'>
            <span>{t('section4.forfeiture.title')}</span>
            {t('section4.forfeiture.content')}
          </p>
          <ul className='list-disc ml-8 mb-4 text-left'>
            <li>{t('section4.forfeiture.list1')}</li>
            <li>{t('section4.forfeiture.list2')}</li>
            <li>{t('section4.forfeiture.list3')}</li>
          </ul>
        </motion.section>

        {/* Section 5 */}
        <motion.section variants={fadeInVariants}>
          <h2 className='text-xl font-bold mb-4 text-gray-900'>
            {t('section5.title')}
          </h2>
          <p className='mb-4'>
            <span>{t('section5.active.title')}</span>
            {t('section5.active.content')}
          </p>
          <p className='mb-4'>
            <span>{t('section5.inactive.title')}</span>
            {t('section5.inactive.content')}
          </p>
        </motion.section>
      </motion.div>
    </motion.div>
  )
};

RewardPolicy.Layout = MainLayout

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'rewardpolicy'])),
    },
  }
}

export default RewardPolicy;
