"use client"
import StandAloneTemplate from "@/components/StandAlone.template"
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const SurveySuccess = () => {
  return <StandAloneTemplate />
}

export default SurveySuccess

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'standalone'])),
    },
  }
}

