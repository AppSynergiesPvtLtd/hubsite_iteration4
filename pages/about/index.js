import React from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import AboutBanner from '@/components/About/AboutBanner'
import MainLayout from '@/layouts/MainLayout'

const About = () => {
  return (
    <div>
      <AboutBanner />
    </div>
  )
}
About.Layout = MainLayout

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'about'])),
    },
  }
}

export default About
