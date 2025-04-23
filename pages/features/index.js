import React from 'react';
import { motion } from 'framer-motion';
import FeatureCard from '@/components/Key_Benefits/FeatureCard';
import { features } from '@/constants/benifits.constants';
import MainLayout from '@/layouts/MainLayout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'

const Features = () => {
  const { t } = useTranslation('common')
  return (
    <div className='p-6 bg-gray-50 text-center'>
      {/* Title Section */}
      <motion.h1
        className="text-4xl font-bold text-[#0057A1] poppins"
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {t('feature.title')}
      </motion.h1>
      <motion.h2
        className="text-2xl font-semibold text-[#0057A1] mt-8 poppins"
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {t('feature.subtitle')}
      </motion.h2>
      <motion.p
        className="mt-6 text-lg text-[#828282] leading-snug mx-auto max-w-2xl poppins"
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {t('feature.paragraph')}
      </motion.p>

      {/* Features Section */}
      <motion.div
        className='flex flex-wrap justify-center mt-10 md:w-[90%] m-auto'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        {features?.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={t(feature.title)}
            description={t(feature.description)}
          />
        ))}
      </motion.div>
    </div>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

Features.Layout = MainLayout; 
export default Features;
