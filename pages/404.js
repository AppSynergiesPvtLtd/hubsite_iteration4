import React from "react";
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const NotFound = () => {
  const { t } = useTranslation('common') // Assuming you're using a 'common' namespace

  return (
    <div className='flex flex-col items-center justify-center h-screen px-4'>
      <h1 className='text-orange-500 text-[100px] md:text-[180px] font-extrabold'>
        {t('notFound.404_title')}
      </h1>

      <h2 className='text-orange-500 text-3xl md:text-5xl font-extrabold text-center'>
        {t('notFound.page_not_found_heading')}
      </h2>

      <p className='text-[#797979] mt-2 text-center w-full max-w-md md:max-w-lg'>
        {t('notFound.page_not_found_description')}
      </p>

      <button
        onClick={() => (window.location.href = '/')}
        className='mt-6 px-4 py-2 md:px-6 md:py-3 bg-[#0057A1] text-white font-semibold rounded-full hover:bg-blue-700'
      >
        {t('notFound.go_to_home_button')}
      </button>
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

export default NotFound