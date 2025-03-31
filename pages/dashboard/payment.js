import React from 'react'
import Layout from './layout'
import PaymentComp from '@/components/DashBoard/Payment'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const Payment = () => {
  return (
    <Layout>
      <PaymentComp />
    </Layout>
  )
}

export default Payment

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'dashboard'])),
    },
  }
}