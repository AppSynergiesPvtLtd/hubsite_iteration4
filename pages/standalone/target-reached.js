"use client";

import StandAloneTemplate from "@/components/StandAlone.template";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const TargetReached = () => {
  const { t } = useTranslation('standalone')

  return (
    <StandAloneTemplate
      heading={t('reached.heading')}
      message={t('reached.message')}
    />
  )
};

export default TargetReached;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'standalone'])),
    },
  }
}