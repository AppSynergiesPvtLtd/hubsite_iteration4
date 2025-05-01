import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import StandAloneTemplate from '@/components/StandAlone.template'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

const SurveySuccess = () => {
  const router = useRouter()
  const { surveyId, userId } = router.query
  const { t } = useTranslation('standalone')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!router.isReady || !surveyId || !userId || loaded) return

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
        console.log('Success API response:', apiResp.data)
        setLoaded(true)
      } catch (err) {
        console.error('API call failed:', err)
        setLoaded(true)
      }
    }

    success()
  }, [router.isReady, surveyId, userId, loaded])

  return (
    <StandAloneTemplate
      heading={t('template.heading')}
      message={t('template.message')}
      goToDashboardLabel={t('template.goToDashboard')}
      giveFeedbackLabel={t('template.giveFeedback')}
    />
  )
}

export default SurveySuccess

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'standalone'])),
    },
  }
}
