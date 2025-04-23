"use client";

import StandAloneTemplate from "@/components/StandAlone.template";
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const ScreenOut = () => {
  const { t } = useTranslation('standalone')

  return (
    <StandAloneTemplate
      heading={t('screenout.heading')}
      message={t('screenout.message')}
    />
  )
}

export default ScreenOut

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'standalone'])),
    },
  }
}