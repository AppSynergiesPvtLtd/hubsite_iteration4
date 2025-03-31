import React, { useState, useEffect } from "react";
import Layout from "../../layout";
import AddQuestionTemplate from "@/components/AuthComps/ManageSurveys/QuestionTemplate";
import axios from "axios";
import { useRouter } from "next/router";
import AdminRoutes from "@/pages/adminRoutes";
import { useDispatch } from "react-redux";
import { clearTitle, hideAdd, hideExcel, hideRefresh, setTitle } from "@/store/adminbtnSlice";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const EditOnBoardingQuestion = () => {
  const router = useRouter();
  const { slug } = router.query; // slug identifies the question to edit
  const { t } = useTranslation('admin')

  // Store both the original API data and the current form data.
  const [initialQuestionData, setInitialQuestionData] = useState(null);
  const [questionData, setQuestionData] = useState({
    questionTitle: '',
    questionDescription: '',
    type: 'SINGLE_SELECTION',
    isRequired: true,
    options: [],
  })
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTitle('Onboarding Question'))
    return () => {
      dispatch(hideAdd());
      dispatch(hideRefresh());
      dispatch(hideExcel());
      dispatch(clearTitle());
    };
  }, [dispatch, router.asPath]);

  // Fetch the question details from the API.
  useEffect(() => {
    if (!slug) return

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
          type: data.type,
          isRequired: data.isRequired,
          // Only include options if the type allows it.
          options: ['SINGLE_SELECTION', 'MULTIPLE_SELECTION'].includes(
            data.type
          )
            ? data.option || []
            : [],
        }
        setInitialQuestionData(formattedData)
        setQuestionData(formattedData)
      } catch (error) {
        console.error('Error fetching question details:', error)
        setErrorMessage(t('manageSurveys.editOnboardingQuestion.loadError'))
      } finally {
        setLoading(false)
      }
    }

    fetchQuestionDetails()
  }, [slug, t])

  // Determine if there are unsaved changes.
  const hasChanges =
    JSON.stringify(questionData) !== JSON.stringify(initialQuestionData)

  // Reset the form to its original state.
  const handleReset = () => {
    setQuestionData(initialQuestionData);
    setErrorMessage('')
    setSuccessMessage('')
  };

  // Handle saving/updating the question.
  const handleSaveChanges = async () => {
    // If no changes have been made, alert the user.
    if (JSON.stringify(questionData) === JSON.stringify(initialQuestionData)) {
      setSuccessMessage(t('manageSurveys.editOnboardingQuestion.noChanges'))
      return;
    }

    // Validate options if question type is SINGLE_SELECTION or MULTIPLE_SELECTION.
    if (
      ['SINGLE_SELECTION', 'MULTIPLE_SELECTION'].includes(questionData.type)
    ) {
      if (!questionData.options || questionData.options.length < 2) {
        setErrorMessage(t('manageSurveys.editOnboardingQuestion.optionError'))
        return
      }
    }

    setLoading(true);
    setErrorMessage('')
    setSuccessMessage('')

    // Prepare the question payload.
    const questionPayload = {
      question: questionData.questionTitle,
      description: questionData.questionDescription,
      type: questionData.type,
      isRequired: questionData.isRequired,
      isActive: true,
    };

    try {
      // Update the main question details.
      await axios.put(`${API_BASE_URL}/questions/${slug}`, questionPayload, {
        headers: {
          'x-api-key': API_KEY,
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      // If the question uses options, update them via the separate endpoint.
      if (
        ['SINGLE_SELECTION', 'MULTIPLE_SELECTION'].includes(
          questionData.type
        ) &&
        questionData.options.length > 0
      ) {
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

      // Update the "original" data.
      setInitialQuestionData(questionData);
      setSuccessMessage(t('manageSurveys.editOnboardingQuestion.updateSuccess'))
    } catch (error) {
      console.error('Error saving question:', error)
      setErrorMessage(t('manageSurveys.editOnboardingQuestion.updateError'))
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p className='text-lg font-medium text-gray-600'>
          {t('manageSurveys.editOnboardingQuestion.loading')}
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
        onReset={handleReset}
        hasChanges={hasChanges}
      />
      {successMessage && (
        <div className='mt-4 p-4 bg-green-100 text-green-700 rounded-md text-center'>
          {successMessage}
        </div>
      )}
    </>
  )
};

export default AdminRoutes(EditOnBoardingQuestion);

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'admin'])),
    },
  }
}