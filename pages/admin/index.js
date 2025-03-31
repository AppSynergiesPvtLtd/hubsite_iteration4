import React from "react";
import Admindashboard from "./admindashboard";
import AdminRoutes from "../adminRoutes";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const DashboardPage = () => {
  return <Admindashboard />
}

export default AdminRoutes(DashboardPage)

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'admin'])),
    },
  }
}
