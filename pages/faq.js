import React, { useState } from "react";
import { motion } from "framer-motion";
import MainLayout from "@/layouts/MainLayout";
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const FAQWithMotion = () => {
  const { t } = useTranslation(['faq']) // Include 'faq' and 'common' namespaces
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: t('faq:questions.0.question'),
      answer: t('faq:questions.0.answer'),
    },
    {
      question: t('faq:questions.1.question'),
      answer: t('faq:questions.1.answer'),
    },
    {
      question: t('faq:questions.2.question'),
      answer: t('faq:questions.2.answer'),
    },
    {
      question: t('faq:questions.3.question'),
      answer: t('faq:questions.3.answer'),
    },
    {
      question: t('faq:questions.4.question'),
      answer: t('faq:questions.4.answer'),
    },
    {
      question: t('faq:questions.5.question'),
      answer: t('faq:questions.5.answer'),
    },
    {
      question: t('faq:questions.6.question'),
      answer: t('faq:questions.6.answer'),
    },
    {
      question: t('faq:questions.7.question'),
      answer: t('faq:questions.7.answer'),
    },
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='w-[95%] md:w-[80%] mx-auto md:p-6'
    >
      <h1 className='text-3xl font-bold text-center mb-6'>{t('faq:title')}</h1>
      <p className='text-center text-gray-600 md:w-[800px] md:leading-[35px] m-auto md:mt-10 mb-4 md:text-[20px]'>
        {t('faq:description', {
          email: (
            <a
              href='mailto:support@hubsitesocial.com'
              className='text-blue-600 underline'
            >
              support@hubsitesocial.com
            </a>
          ),
        })}
      </p>
      <div className='border border-gray-300 rounded-2xl'>
        {faqs.map((faq, index) => (
          <div key={index} className='border-b last:border-none'>
            <button
              onClick={() => toggleFAQ(index)}
              className='w-full flex justify-between items-center px-4 py-3 text-left focus:outline-none'
            >
              <span className='font-medium text-gray-800'>{faq.question}</span>
              <span className='text-orange-500 text-2xl font-semibold'>
                {openIndex === index ? '–' : '+'}
              </span>
            </button>

            <motion.div
              initial={false}
              animate={
                openIndex === index
                  ? { height: 'auto', opacity: 1 }
                  : { height: 0, opacity: 0 }
              }
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className='overflow-hidden'
            >
              <div className='px-4 py-3 border-t border-gray-300 text-gray-700'>
                {faq.answer}
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

FAQWithMotion.Layout = MainLayout

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'faq'])),
    },
  }
}

export default FAQWithMotion