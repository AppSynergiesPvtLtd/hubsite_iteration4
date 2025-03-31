import React, { useState } from "react";
import AddQuestionTemplate from "@/components/AuthComps/ManageSurveys/QuestionTemplate";
import axios from "axios";
import { useRouter } from "next/router";
import AdminRoutes from "../../adminRoutes";
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

const AddOnBoardingQuestion = () => {
  const router = useRouter()
  const { t } = useTranslation('admin')

  const [questionData, setQuestionData] = useState({
    questionTitle: '',
    questionDescription: '',
    type: 'SINGLE_SELECTION', // Consistent field name
    isRequired: true,
    options: [],
  })
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [validationErrors, setValidationErrors] = useState([])

  const handleSaveChanges = async () => {
    setLoading(true)
    setErrorMessage('')
    setValidationErrors([])

    // Validation: Ensure at least 2 options for selection types
    if (
      ['SINGLE_SELECTION', 'MULTIPLE_SELECTION'].includes(questionData.type) &&
      questionData.options.length < 2
    ) {
      setErrorMessage(t('manageSurveys.addQuestionOnboarding.minOptionsError'))
      setLoading(false)
      return
    }

    // Prepare payload
    const questionPayload = {
      question: questionData.questionTitle,
      description: questionData.questionDescription,
      type: questionData.type,
      isRequired: questionData.isRequired,
      forOnboarding: true,
      options: ['SINGLE_SELECTION', 'MULTIPLE_SELECTION'].includes(
        questionData.type
      )
        ? questionData.options
        : undefined,
    }

    try {
      // Save question with options directly in one request
      await axios.post(`${API_BASE_URL}/questions`, questionPayload, {
        headers: {
          'x-api-key': API_KEY,
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      // Redirect to onboarding survey list on success
      router.push('/admin/manage-surveys/onboarding-survey')
    } catch (error) {
      console.error('Error saving question:', error)

      if (error.response && error.response.data && error.response.data.errors) {
        // Handle validation errors from the server
        setValidationErrors(error.response.data.errors)
      } else {
        setErrorMessage(t('manageSurveys.addQuestionOnboarding.saveError'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AddQuestionTemplate
        questionData={questionData}
        setQuestionData={setQuestionData}
        loading={loading}
        errorMessage={errorMessage}
        onSave={handleSaveChanges}
      />
      {/* Display validation errors */}
      {validationErrors.length > 0 && (
        <div className='mt-4 p-4 bg-red-100 text-red-700 rounded-md'>
          <ul>
            {validationErrors.map((err, index) => (
              <li key={index}>
                {err.field}: {err.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}

export default AdminRoutes(AddOnBoardingQuestion)

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'admin'])),
    },
  }
}