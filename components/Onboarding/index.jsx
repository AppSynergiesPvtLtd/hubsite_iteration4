import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { onBoarding, setUser } from '@/store/userSlice'
import GetStarted from "./GetStarted";
import Questions from "./Questions";
import axios from "axios";
import Spinner from "../Spinner";
import { useTranslation } from 'next-i18next'

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const OnBoarding = () => {
  const { t } = useTranslation('onboarding')
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user)
  const [currentStage, setCurrentStage] = useState('getStarted')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user.isOnboardingDone) {
      router.push('/dashboard')
    } else {
      setLoading(false)
    }
  }, [user.isOnboardingDone, router])

  useEffect(() => {
    const stage = router.query.stage || "getStarted";
    setCurrentStage(stage);
  }, [router.query.stage]);

  const handleCompleteGetStarted = () => {
    router.push("/onboarding?stage=questions", undefined, { shallow: true });
  };

  const handleCompleteQuestions = async () => {
    if (user) {
      const updatedUser = { ...user, boarding: true }
      localStorage.setItem('onBoarding', JSON.stringify(true))
      try {
        await axios.post(
          `${API_BASE_URL}/response/complete-onboarding`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': API_KEY,
              Authorization: `Bearer ${localStorage.getItem('user_token')}`,
            },
          }
        )
      } catch (error) {
        console.error(t('error_completing_onboarding'), error)
      }
    } else {
      console.error(t('user_data_unavailable'))
    }
  }

  const renderContent = () => {
    if (currentStage === "getStarted") {
      return <GetStarted onComplete={handleCompleteGetStarted} />;
    } else if (currentStage === "questions") {
      return <Questions onComplete={handleCompleteQuestions} />;
    }
    return null;
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className='flex justify-center items-center'>
          {renderContent()}
        </div>
      )}
    </>
  )
};

export default OnBoarding