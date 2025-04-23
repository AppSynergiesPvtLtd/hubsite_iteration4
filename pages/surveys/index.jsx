import QuestionsSurvey from '@/components/Surveys/QuestionsSurvey'
import React from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const Surveys = () => {
  return (
    <div>
      <QuestionsSurvey />
    </div>
  )
}

export default Surveys

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'survey'])),
    },
  }
}