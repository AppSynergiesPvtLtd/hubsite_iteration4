import MainLayout from '@/layouts/MainLayout';
import Image from 'next/image';
import React, { useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

const ContactForm = () => {
  const { t } = useTranslation('contact')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    file: null,
  })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const handleInputChange = (event) => {
    const { id, value } = event.target
    setFormData({ ...formData, [id]: value })
    setErrors({ ...errors, [id]: '' })
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setFormData({ ...formData, file })
    setErrors({ ...errors, file: '' })
  }

  const validateForm = () => {
    const newErrors = {}
    const { name, email, message, file } = formData

    if (!name) newErrors.name = t('nameRequired')
    if (!email) {
      newErrors.email = t('emailRequired')
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailPattern.test(email)) {
        newErrors.email = t('emailInvalid')
      }
    }
    if (!message) newErrors.message = t('messageRequired')

    // If a file is provided, validate the type.
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        newErrors.file = t('uploadInvalid')
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validateForm()) return

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('message', formData.message)
      if (formData.file) {
        formDataToSend.append('file', formData.file)
      }

      const response = await fetch(`${API_BASE_URL}/contact-us/create`, {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'x-api-key': 'g6PrusoQaCHaSPuTRuTe7lKEx3th9',
        },
      })

      const responseData = await response.json()

      if (response.ok) {
        setFormSubmitted(true)
      } else {
        if (responseData.errors) {
          const apiErrors = {}
          responseData.errors.forEach((error) => {
            apiErrors[error.field] = error.message
          })
          setErrors(apiErrors)
        } else {
          setErrors({ form: t('submitFail') })
        }
      }
    } catch (err) {
      setErrors({ form: t('submitError') })
    }
  }

  return (
    <div className='flex flex-col mt-10 items-center justify-center max-h-[650px] poppins p-3'>
      {formSubmitted ? (
        <div className='flex flex-col items-center justify-center mt-8'>
          <div className='w-[250px] h-[250px] md:w-[500.6px] md:h-[450px] relative'>
            <Image
              src='/contact-fianl.png'
              alt={t('imgFinal')}
              layout='fill'
              objectFit='cover'
            />
          </div>
          <p className='md:text-2xl md:w-[630px] text-center font-medium mt-4'>
            {t('headingFinal')}
          </p>
        </div>
      ) : (
        <>
          <h1 className='text-xl md:w-[320px] font-medium text-[#333333] text-center mb-6 poppins-bold'>
            {t('heading1')}
            <br /> {t('heading2')}
          </h1>
          <div className='flex flex-col-reverse md:flex-row items-center justify-center w-full space-y-6 md:space-y-0 md:space-x-12'>
            <div className='w-full max-w-lg'>
              <form className='space-y-4 mb-6' onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-700'
                  >
                    {t('name')}
                  </label>
                  <input
                    type='text'
                    id='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`mt-1 w-full border ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg p-2 focus:outline-none focus:ring-2 ${
                      errors.name ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                    }`}
                    placeholder={t('namePlaceholder')}
                  />
                  {errors.name && (
                    <p className='text-red-500 text-sm mt-1'>{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium text-gray-700'
                  >
                    {t('email')}
                  </label>
                  <input
                    type='email'
                    id='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`mt-1 w-full border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg p-2 focus:outline-none focus:ring-2 ${
                      errors.email
                        ? 'focus:ring-red-500'
                        : 'focus:ring-blue-500'
                    }`}
                    placeholder={t('emailPlaceholder')}
                  />
                  {errors.email && (
                    <p className='text-red-500 text-sm mt-1'>{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor='upload'
                    className='block text-sm font-medium text-gray-700'
                  >
                    {t('upload')}
                  </label>
                  <div
                    className={`mt-1 w-full border ${
                      errors.file ? 'border-red-500' : 'border-gray-300'
                    } border-dashed rounded-lg p-4 text-center h-[100px]`}
                  >
                    <input
                      type='file'
                      id='upload'
                      className='hidden'
                      onChange={handleFileChange}
                      accept='.jpg, .jpeg, .png'
                    />
                    <label
                      htmlFor='upload'
                      className='text-[#0057A1] m-auto cursor-pointer hover:underline'
                    >
                      {formData.file ? (
                        <p className='text-gray-700'>{formData.file.name}</p>
                      ) : (
                        <FaCloudUploadAlt className='w-12 h-12 m-auto text-[#0057A1]' />
                      )}
                    </label>
                  </div>
                  {errors.file && (
                    <p className='text-red-500 text-sm mt-1'>{errors.file}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor='message'
                    className='block text-sm font-medium text-gray-700'
                  >
                    {t('message')}
                  </label>
                  <textarea
                    id='message'
                    rows='4'
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`mt-1 w-full border ${
                      errors.message ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg p-2 focus:outline-none focus:ring-2 ${
                      errors.message
                        ? 'focus:ring-red-500'
                        : 'focus:ring-blue-500'
                    }`}
                    placeholder={t('messagePlaceholder')}
                  ></textarea>
                  {errors.message && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type='submit'
                  className='w-fit mt-4 bg-[#0057A1] text-white font-medium py-2 px-2 md:py-2 md:px-8 rounded-lg hover:bg-[#0056a1e9] focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  {t('submit')}
                </button>
              </form>
            </div>

            <div className='w-[345px] h-[229px] md:w-[596.6px] md:h-[387px] relative'>
              <Image
                src='/contact.png'
                alt={t('img')}
                layout='fill'
                objectFit='cover'
                className='shadow-black'
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

ContactForm.Layout = MainLayout

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'contact'])),
    },
  }
}

export default ContactForm;