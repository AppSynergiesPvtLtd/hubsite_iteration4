"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useTranslation } from 'react-i18next'

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

export default function UserLogin() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { t } = useTranslation('common') // Use translation

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [currentStep, setCurrentStep] = useState(1) // 1 = login, 2 = OTP verification
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [error, setError] = useState('')
  const [alert, setAlert] = useState({ message: '', type: '' })
  const [showPassword, setShowPassword] = useState(false)

  // Regular expression to validate email pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const handleLogin = async () => {
    setLoading(true)
    setError('')

    if (!email || !password) {
      setError(t('login.errors.fillFields'))
      setLoading(false)
      return
    }

    // Validate email format before hitting the API
    if (!emailRegex.test(email)) {
      setError(t('login.errors.validEmail'))
      setLoading(false)
      return
    }

    // Validate password length
    if (password.length < 6) {
      setError(t('login.errors.passwordLength'))
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/login-email`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
          },
        }
      )
      const userData = response.data

      if (!userData.isEmailVerified) {
        setAlert({
          message: t('login.messages.emailNotVerified'),
          type: 'info',
        })
        setCurrentStep(2)
        setLoading(false)
        return
      }

      // Save token using a key specific for users:
      localStorage.setItem('user_token', userData.token.split(' ')[1])
      dispatch(setUser(userData))
      router.push('/dashboard')
    } catch (err) {
      console.log('err', err)
      setError(err.response?.data?.message || t('login.errors.loginFailed'))
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    setLoading(true)
    setError('')

    if (!otp) {
      setError(t('login.errors.enterOtp'))
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/verify-email`,
        { email, otp },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
          },
        }
      )
      const userData = response.data
      localStorage.setItem('user_token', userData.token.split(' ')[1])
      dispatch(setUser(userData))
      setAlert({ message: t('login.messages.otpVerified'), type: 'success' })
      router.push('/dashboard')
    } catch (err) {
      setError(
        err.response?.data?.message || t('login.errors.otpVerificationFailed')
      )
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setResendLoading(true)
    setAlert({ message: '', type: '' })
    try {
      await axios.post(
        `${API_BASE_URL}/auth/resend-email-verification`,
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
          },
        }
      )
      setAlert({
        message: t('login.messages.otpResent'),
        type: 'info',
      })
    } catch (err) {
      setAlert({
        message:
          err.response?.data?.message || t('login.errors.resendOtpFailed'),
        type: 'error',
      })
    } finally {
      setResendLoading(false)
    }
  }

  const { data: session, status } = useSession()
  const [googleTriggered, setGoogleTriggered] = useState(false)

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
          const userData = response.data
          localStorage.setItem('user_token', userData.token.split(' ')[1])
          dispatch(setUser(userData))
          router.push('/dashboard')
        } catch (err) {
          setError(
            err.response?.data?.message || t('login.errors.googleLoginFailed')
          )
          setLoading(false)
        }
      })()
    }
  }, [status, session, googleTriggered, dispatch, router, t])

  const handleGoogleLogin = async () => {
    setError('')
    await signIn('google')
  }

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (currentStep === 1) {
        handleLogin()
      } else if (currentStep === 2) {
        handleVerifyOtp()
      }
    }
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 poppins'>
      <div className='flex flex-col justify-center space-y-6'>
        <h2 className='text-3xl font-bold text-gray-800 text-center'>
          {currentStep === 1 ? t('login.title') : t('login.verifyOtpTitle')}
        </h2>
        <p className='text-gray-600 text-center'>
          {currentStep === 1
            ? t('login.loginContinue')
            : t('login.verifyEmailProceed')}
        </p>

        {alert.message && (
          <div
            className={`p-4 text-center ${
              alert.type === 'success'
                ? 'bg-green-100 text-green-800'
                : alert.type === 'info'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-red-100 text-red-800'
            } rounded`}
          >
            {alert.message}
          </div>
        )}

        {currentStep === 1 && (
          <div className='space-y-4 flex flex-col items-center'>
            <div className='w-[80%]'>
              <input
                type='email'
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-0 focus:outline-none'
                placeholder={t('login.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className='w-[80%] relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-0 focus:outline-none'
                placeholder={t('login.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <span
                className='absolute inset-y-0 right-4 flex items-center cursor-pointer'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeIcon className='h-5 w-5 text-gray-500' />
                ) : (
                  <EyeOffIcon className='h-5 w-5 text-gray-500' />
                )}
              </span>
            </div>
            {error && <p className='text-red-500 text-sm'>{error}</p>}
            <button
              onClick={handleLogin}
              className='w-[80%] py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
              disabled={loading}
            >
              {loading ? t('login.loading') : t('login.loginButton')}
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div className='space-y-4 flex flex-col items-center'>
            <div className='w-[80%]'>
              <input
                type='text'
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-0 focus:outline-none'
                placeholder={t('login.otpPlaceholder')}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            {error && <p className='text-red-500 text-sm'>{error}</p>}
            <button
              onClick={handleVerifyOtp}
              className='w-[80%] py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
              disabled={loading}
            >
              {loading ? t('login.verifying') : t('login.verifyOtpButton')}
            </button>
            <button
              onClick={handleResendOtp}
              className='w-[80%] py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300'
              disabled={resendLoading}
            >
              {resendLoading
                ? t('login.resending')
                : t('login.resendOtpButton')}
            </button>
          </div>
        )}

        <div className='text-center mt-4'>
          {currentStep === 1 && (
            <button
              onClick={() => router.push('/?modal=forgotpassword')}
              className='text-sm text-blue-600 hover:underline'
            >
              {t('login.forgotPassword')}
            </button>
          )}
        </div>

        {currentStep === 1 && (
          <p className='text-sm text-center text-gray-700 mt-4'>
            {t('login.noAccount')}
            <button
              onClick={() => router.push('/?modal=signUp')}
              className='text-blue-600 hover:underline font-semibold'
            >
              {t('login.signUp')}
            </button>
          </p>
        )}

        {currentStep === 1 && (
          <div className='flex justify-center mt-6'>
            <button
              onClick={handleGoogleLogin}
              className='w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 shadow hover:bg-gray-200'
            >
              <Image src='/google.svg' alt='Google' width={24} height={24} />
            </button>
          </div>
        )}
      </div>

      <div className='hidden lg:flex items-center justify-center relative h-[80vh] w-full'>
        <Image
          src='/login.jpg'
          alt='Login Illustration'
          width={350}
          height={200}
          style={{ objectFit: 'contain' }}
          className='rounded-lg w-[90%] h-[550px]'
        />
      </div>
    </div>
  )
}
