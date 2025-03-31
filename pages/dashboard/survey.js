import React from "react";
import Layout from "./layout";
import Surveys from "@/components/DashBoard/Surveys";
import PrivateRoute from "../PrivateRoute";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const SurveyPage = () => {
  return <Surveys />
}

export default PrivateRoute(SurveyPage)

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'dashboard'])),
    },
  }
}
