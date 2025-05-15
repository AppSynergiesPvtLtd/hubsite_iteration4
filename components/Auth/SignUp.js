'use client'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { PiEye } from 'react-icons/pi'
import { FaRegEyeSlash } from 'react-icons/fa'
import { setUser } from '@/store/userSlice'
import { useTranslation } from 'react-i18next'

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

export default function SignUp() {
  const { t } = useTranslation('common')
  const [currentStep, setCurrentStep] = useState(1)
  const { data: session, status } = useSession()
  const [resendLoading, setResendLoading] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
    rememberMe: true,
    otp: '',
  })

  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({ message: '', type: '' })

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const userData = {
        name: session.name,
        email: session.email,
        image: session.image,
        id: session.id,
        accessToken: session.accessToken,
      }
      localStorage.setItem('user_token', session.accessToken)
      dispatch(setUser(userData))
    }
  }, [status, session, dispatch])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
    setErrors({ ...errors, [name]: '' })
    setAlert({ message: '', type: '' })
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible)
  }

  const handleNext = async () => {
    const newErrors = {}
    if (!formData.firstName) newErrors.firstName = t('signup.firstNameRequired')
    if (!formData.lastName) newErrors.lastName = t('signup.lastNameRequired')
    if (!formData.email) newErrors.email = t('signup.emailRequired')
    if (!formData.password) newErrors.password = t('signup.passwordRequired')
    if (!formData.confirmPassword)
      newErrors.confirmPassword = t('signup.confirmPasswordRequired')
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = t('signup.passwordsNotMatch')
    if (!formData.agreeTerms)
      newErrors.agreeTerms = t('signup.agreeTermsRequired')

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const signupResp = await axios.post(
        `${API_BASE_URL}/auth/register-email`,
        {
          email: formData.email,
          password: formData.confirmPassword,
          name: `${formData.firstName} ${formData.lastName}`,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
          },
        }
      )

      setAlert({ message: t('signup.otpSentSuccess'), type: 'success' })
      setErrors({})
      setCurrentStep(2)
    } catch (error) {
      setAlert({
        message: error.response?.data?.message || t('signup.failedToSendOtp'),
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePrevious = () => {
    setErrors({})
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    if (!formData.otp) {
      setErrors({ otp: t('signup.otpRequired') })
      return
    }

    setLoading(true)
    try {
      const OtpResp = await axios.post(
        `${API_BASE_URL}/auth/verify-email`,
        {
          email: formData.email,
          otp: formData.otp,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
          },
        }
      )
      localStorage.setItem('user_token', OtpResp.data.token.split(' ')[1])
      dispatch(setUser(OtpResp.data))
      setAlert({ message: t('signup.otpVerifiedSuccess'), type: 'success' })
      setCurrentStep(3)
    } catch (error) {
      setAlert({
        message:
          error.response?.data?.message || t('signup.otpVerificationFailed'),
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = () => {
    router.push('/?modal=login', undefined, { shallow: true })
  }

  const handleGoogleSignUp = async () => {
    router.push('/google-auth')
  }

  const handleResendOtp = async () => {
    setResendLoading(true)
    setAlert({ message: '', type: '' })
    try {
      await axios.post(
        `${API_BASE_URL}/auth/resend-email-verification`,
        { email: formData.email },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
          },
        }
      )
      setAlert({
        message: t('signup.otpResent'),
        type: 'info',
      })
    } catch (error) {
      setAlert({
        message: error.response?.data?.message || t('signup.failedResendOtp'),
        type: 'error',
      })
    } finally {
      setResendLoading(false)
    }
  }

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
        } catch (err) {
          setError(
            err.response?.data?.message ||
              'Google login failed. Please try again.'
          )
          setLoading(false)
        }
      })()
    }
  }, [status, session, googleTriggered, dispatch, router])

  const handleGoogleLogin = async () => {
    setError('')
    await signIn('google')
  }

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (currentStep === 1) {
        handleNext()
      } else if (currentStep === 2) {
        handleSubmit()
      }
    }
  }

  return (
    <div className='poppins flex flex-col md:flex-row justify-center items-center min-fit text-black'>
      <div className='w-full max-w-md bg-white rounded-lg space-y-6 p-6 shadow-lg z-50'>
        {alert.message && (
          <div
            className={`p-4 text-center z-50 ${
              alert.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            } rounded`}
          >
            {alert.message}
          </div>
        )}

        {currentStep === 1 && (
          <div className='space-y-4'>
            <h2 className='text-2xl font-semibold text-center mb-4'>
              {t('signup.signUp')}
            </h2>
            <div className='grid grid-cols-2 gap-4 gap-y-1'>
              {/* Label: First Name */}
              <label htmlFor='firstName' className='font-medium'>
                {t('signup.firstName')}
              </label>

              {/* Label: Last Name */}
              <label htmlFor='lastName' className='font-medium'>
                {t('signup.lastName')}
              </label>

              {/* Input: First Name */}
              <div>
                <input
                  type='text'
                  id='firstName'
                  name='firstName'
                  className='w-full border rounded px-4 py-2 focus:outline-none focus:ring-0'
                  placeholder={t('signup.firstName')}
                  value={formData.firstName}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                />
                {errors.firstName && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Input: Last Name */}
              <div>
                <input
                  type='text'
                  id='lastName'
                  name='lastName'
                  className='w-full border rounded px-4 py-2 focus:outline-none focus:ring-0'
                  placeholder={t('signup.lastName')}
                  value={formData.lastName}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                />
                {errors.lastName && (
                  <p className='text-red-500 text-sm mt-1'>{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor='email' className='block font-medium'>
                {t('signup.email')}
              </label>
              <input
                type='email'
                id='email'
                name='email'
                className='w-full border rounded px-4 py-2 focus:outline-none focus:ring-0'
                placeholder={t('signup.email')}
                value={formData.email}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
              {errors.email && (
                <p className='text-red-500 text-sm mt-1'>{errors.email}</p>
              )}
            </div>
            <div className='flex flex-col gap-4'>
              <div className='relative'>
                <label htmlFor='password' className='block font-medium'>
                  {t('signup.password')}
                </label>
                <div className='relative'>
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    id='password'
                    name='password'
                    className='w-full border rounded px-4 py-2 pr-10 focus:outline-none focus:ring-0'
                    placeholder={t('signup.enterPassword')}
                    value={formData.password}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    type='button'
                    className='absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700'
                    onClick={togglePasswordVisibility}
                  >
                    {passwordVisible ? (
                      <PiEye className='h-5 w-5' />
                    ) : (
                      <FaRegEyeSlash className='h-5 w-5' />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className='text-red-500 text-sm mt-1'>{errors.password}</p>
                )}
              </div>
              <div className='relative'>
                <label htmlFor='confirmPassword' className='block font-medium'>
                  {t('signup.confirmPassword')}
                </label>
                <div className='relative'>
                  <input
                    type={confirmPasswordVisible ? 'text' : 'password'}
                    id='confirmPassword'
                    name='confirmPassword'
                    className='w-full border rounded px-4 py-2 pr-10 focus:outline-none focus:ring-0'
                    placeholder={t('signup.confirmPasswordPlaceholder')}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    type='button'
                    className='absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700'
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {confirmPasswordVisible ? (
                      <PiEye className='h-5 w-5' />
                    ) : (
                      <FaRegEyeSlash className='h-5 w-5' />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
            <div className='space-y-2'>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  name='rememberMe'
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className='mr-2 focus:ring-0'
                />
                {t('signup.rememberMe')}
              </label>
              <label className='flex items-center flex-wrap'>
                <input
                  type='checkbox'
                  name='agreeTerms'
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className='mr-2 focus:ring-0'
                />
                {t('signup.agreeTerms')}&nbsp;
                <a href='/termsofuse' className='text-[#0057A1]'>
                  {t('signup.terms')}
                </a>
                &nbsp;{t('signup.and')}&nbsp;
                <a href='/privacypolicy' className='text-[#0057A1]'>
                  {t('signup.privacyPolicy')}
                </a>
              </label>
              {errors.agreeTerms && (
                <p className='text-red-500 text-sm mt-1'>{errors.agreeTerms}</p>
              )}
            </div>
            <div className='text-center'>
              <button
                type='button'
                className='bg-[#0057A1] text-white w-full py-2 rounded hover:bg-[#0056a1ef] transition'
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? t('signup.processing') : t('signup.signUp')}
              </button>
            </div>
            <p className='text-sm w-[80%] m-auto text-center text-black'>
              {t('signup.alreadyHaveAccount')}
              <button
                onClick={handleSignUp}
                className='text-[#0057A1] hover:underline font-semibold'
              >
                {t('signup.login')}
              </button>
              <div className='flex justify-center mt-6'>
                <button
                  onClick={handleGoogleLogin}
                  className='w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 shadow hover:bg-gray-200'
                >
                  <Image
                    src='/google.svg'
                    alt='Google'
                    width={24}
                    height={24}
                  />
                </button>
              </div>
            </p>
          </div>
        )}

        {currentStep === 2 && (
          <div className='space-y-4'>
            <h1 className='text-xl font-semibold'>{t('signup.verifyEmail')}</h1>
            <p>{t('signup.enterCode')}</p>
            <input
              type='text'
              placeholder={t('signup.enterOtpCode')}
              className='border border-gray-200 p-2 w-full focus:outline-none focus:ring-0'
              name='otp'
              value={formData.otp}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            {errors.otp && (
              <p className='text-red-500 text-sm mt-1'>{errors.otp}</p>
            )}
            <div className='flex flex-col space-y-2'>
              <button
                type='button'
                className='bg-[#0057A1] text-white py-2 px-4 rounded hover:bg-[#0056a1ef] transition'
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? t('signup.verifying') : t('signup.verifyEmail')}
              </button>
              <button
                type='button'
                className='bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition'
                onClick={handleResendOtp}
                disabled={resendLoading}
              >
                {resendLoading ? t('signup.resending') : t('signup.resendOtp')}
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className='flex flex-col justify-center items-center space-y-6 text-center h-[30rem]'>
            <Image
              src='/login.jpg'
              alt='Profile Completion'
              width={350}
              height={200}
              objectFit='contain'
            />
            <h1 className='text-xl font-semibold'>{t('signup.allSet')}</h1>
            <button
              type='button'
              onClick={() => router.push('/dashboard')}
              className='bg-[#0057A1] text-white py-2 px-6 rounded-lg hover:bg-[#0056a1ef] transition'
            >
              {t('signup.createProfile')}
            </button>
          </div>
        )}
      </div>

      {currentStep !== 3 && (
        <div className='hidden md:flex items-center justify-center relative h-[76vh] w-[100%]'>
          <Image
            src='/login.jpg'
            alt='Step Illustration'
            layout='fill'
            objectFit='contain'
            className='rounded-lg'
          />
        </div>
      )}
    </div>
  )
}
