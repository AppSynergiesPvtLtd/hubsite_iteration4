"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

export default function GoogleLogin() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { data: session, status } = useSession()
  const { t } = useTranslation('common') // Use the 'common' namespace

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  // Used to ensure we only trigger the API call once.
  const [googleTriggered, setGoogleTriggered] = useState(false)

  // When the user returns from Google, if we have an authenticated session
  // with the required idToken, call the backend API to complete login.
  useEffect(() => {
    if (status === 'authenticated' && session?.idToken && !googleTriggered) {
      setGoogleTriggered(true)
      setLoading(true)
      ;(async () => {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/auth/google`,
            { idToken: session.idToken },
            {
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
              },
            }
          )
          console.log('Response', response)
          const userData = response.data
          localStorage.setItem('token', userData.token.split(' ')[1])
          console.log(userData)
          dispatch(setUser(userData))
          //   router.push("/dashboard");
        } catch (err) {
          setError(
            err.response?.data?.message || t('googleAuth.googleLoginFailed') // Use the translation key
          )
          setLoading(false)
        }
      })()
    }
  }, [status, session, googleTriggered, dispatch, router, t])

  // Initiates the Google sign-in process (using NextAuth redirect flow)
  const handleGoogleLogin = async () => {
    setError('')
    await signIn('google')
  }

  return (
    <div className='min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6'>
      <div className='bg-white shadow rounded-lg p-8 w-full max-w-md text-center'>
        <h1 className='text-3xl font-bold mb-6'>
          {t('googleAuth.signInWithGoogle')}
        </h1>
        <p className='text-gray-600 mb-4'>{t('googleAuth.signInToContinue')}</p>
        {error && <div className='text-red-500 mb-4'>{error}</div>}
        {loading ? (
          <button
            className='w-full py-3 bg-blue-500 text-white rounded-lg cursor-not-allowed'
            disabled
          >
            Loading...
          </button>
        ) : (
          <button
            onClick={handleGoogleLogin}
            className='w-full flex items-center justify-center py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
          >
            <Image
              src='/google.svg'
              alt='Google Logo'
              width={24}
              height={24}
              className='mr-2'
            />
            <span>{t('googleAuth.signInWithGoogle')}</span>
          </button>
        )}
      </div>
    </div>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}
