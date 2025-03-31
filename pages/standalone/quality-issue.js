"use client";

import StandAloneTemplate from "@/components/StandAlone.template";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const QualityIssue = () => {
  const { t } = useTranslation('standalone')

  return (
    <StandAloneTemplate
      heading={t('issue.heading')}
      message={t('issue.message')}
    />
  )
};

export default QualityIssue;

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'standalone'])),
    },
  }
}