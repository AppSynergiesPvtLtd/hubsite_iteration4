import React from "react";
import Layout from "./layout";
import DashboardLanding from "@/components/DashBoard/DashBoard";
import PrivateRoute from "../PrivateRoute";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const DashboardPage = () => {
  return <DashboardLanding />
}

export default PrivateRoute(DashboardPage)
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'dashboard'])),
    },
  }
}
