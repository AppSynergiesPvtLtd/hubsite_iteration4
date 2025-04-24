import React from 'react'
import Yoursurvey from '@/components/DashBoard/Yoursurvey'
import Layout from "./layout";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const yoursurvey = () => {
  return (
    <div>
      <Yoursurvey />
    </div>
  )
}

export default yoursurvey

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'dashboard'])),
    },
  }
}
