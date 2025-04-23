import React from "react";
import Layout from "./layout";
import Rewards from "@/components/DashBoard/Rewards";
import PrivateRoute from "../PrivateRoute";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const RewardsPage = () => {
  return <Rewards />
}

export default PrivateRoute(RewardsPage)

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'dashboard'])),
    },
  }
}
