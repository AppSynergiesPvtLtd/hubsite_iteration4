import OnBoarding from '@/components/Onboarding'
import Spinner from '@/components/Spinner';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const OnboardingPage = () => {
  const [loading, setLoading] = useState(true)
  const user = useSelector((state) => state.user.user)
  const router = useRouter()

  useEffect(() => {
    if (user === undefined) return
    if (!user) {
      router.push('/')
    } else {
      setLoading(false)
    }
  }, [user, router])

  return <div>{loading ? <Spinner /> : <OnBoarding />}</div>
}

export default OnboardingPage

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'onboarding'])),
    },
  }
}
