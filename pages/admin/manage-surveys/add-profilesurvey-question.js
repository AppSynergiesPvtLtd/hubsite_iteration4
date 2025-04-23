import React, { useState, useEffect } from "react";
import Layout from "../layout";
import AddQuestionTemplate from "@/components/AuthComps/ManageSurveys/QuestionTemplate";
import axios from "axios";
import { useRouter } from "next/router";
import AdminRoutes from "@/pages/adminRoutes";
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

const AddProfileSurveyQuestion = () => {
  const router = useRouter()
  const { slug } = router.query // Slug for identifying the question to edit
  const { t } = useTranslation('admin')
  const [initialQuestionData, setInitialQuestionData] = useState(null) // Store original data for comparison
  const [questionData, setQuestionData] = useState({
    questionTitle: '',
    questionDescription: '',
    questionType: 'SINGLE_SELECTION',
    isRequired: true,
    options: [],
  })
  const [loading, setLoading] = useState(true) // Loading while fetching data
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('') // Success feedback message

  // Fetch question details on component mount
  useEffect(() => {
    if (!slug) return // Ensure slug is available

    const fetchQuestionDetails = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${API_BASE_URL}/questions/${slug}`, {
          headers: {
            'x-api-key': API_KEY,
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        const data = response.data
        const formattedData = {
          questionTitle: data.question,
          questionDescription: data.description,
          questionType: data.type,
          isRequired: data.isRequired,
          options: data.option || [],
        }

        setInitialQuestionData(formattedData) // Set the original data
        setQuestionData(formattedData) // Populate the form state
      } catch (error) {
        console.error('Error fetching question details:', error)
        setErrorMessage(t('manageSurveys.addProfileSurveyQuestion.loadError'))
      } finally {
        setLoading(false)
      }
    }

    fetchQuestionDetails()
  }, [slug, t])

  // Save changes to the question
  const handleSaveChanges = async () => {
    // Check for changes
    if (JSON.stringify(questionData) === JSON.stringify(initialQuestionData)) {
      setSuccessMessage(t('manageSurveys.addProfileSurveyQuestion.noChanges'))
      return // Skip saving if nothing changed
    }

    setLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    const questionPayload = {
      question: questionData.questionTitle,
      description: questionData.questionDescription,
      type: questionData.questionType,
      isRequired: questionData.isRequired,
      isActive: true,
    }

    try {
      // Update the question details
      await axios.put(`${API_BASE_URL}/questions/${slug}`, questionPayload, {
        headers: {
          'x-api-key': API_KEY,
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      // Update options if any exist
      if (questionData.options.length > 0) {
        await axios.put(
          `${API_BASE_URL}/questions/options/${slug}`,
          questionData.options,
          {
            headers: {
              'x-api-key': API_KEY,
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
      }

      setInitialQuestionData(questionData) // Update the initial state
      setSuccessMessage(
        t('manageSurveys.addProfileSurveyQuestion.updateSuccess')
      )
    } catch (error) {
      console.error('Error saving question:', error)
      setErrorMessage(t('manageSurveys.addProfileSurveyQuestion.updateError'))
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p className='text-lg font-medium text-gray-600'>
          {t('manageSurveys.addProfileSurveyQuestion.loading')}
        </p>
      </div>
    )
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
      {successMessage && (
        <div className='mt-4 p-4 bg-green-100 text-green-700 rounded-md text-center'>
          {successMessage}
        </div>
      )}
    </>
  )
}

export default AdminRoutes(AddProfileSurveyQuestion)

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'admin'])),
    },
  }
}