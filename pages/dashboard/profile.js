import React from "react";
import Layout from "./layout";
import Profile from "@/components/DashBoard/Profile";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const ProfilePage = () => {
  return (
    <Layout>
      <Profile />
    </Layout>
  )
}

export default ProfilePage

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'dashboard'])),
    },
  }
}
