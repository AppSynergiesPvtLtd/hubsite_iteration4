"use client"
import StandAloneTemplate from "@/components/StandAlone.template"
import axios from "axios";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react"
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

const SurveySuccess = () => {
  const router = useRouter()
  const { surveyId, userId } = router.query
  console.log(surveyId, userId)
  const success = async () => {
    try {
      const apiResp = await axios.get(
        `${API_BASE_URL}/live-survey/completions/${surveyId}/${userId}`,
        {
          headers: {
            'x-api-key': API_KEY,
          },
        }
      )
      console.log(apiResp)
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    success()
  }, [])
  return <StandAloneTemplate />
}

export default SurveySuccess

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'standalone'])),
    },
  }
}

