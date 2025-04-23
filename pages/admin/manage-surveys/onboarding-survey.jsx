import React, { useState, useEffect } from "react";
import axios from "axios";
import SurveyTemplate from "@/components/AuthComps/ManageSurveys/Surveydetails";
import { useRouter } from "next/router";
import AdminRoutes from "@/pages/adminRoutes";
import { useDispatch } from "react-redux";
import { 
  clearTitle, 
  hideAdd, 
  hideExcel, 
  hideRefresh, 
  setTitle, 
  showAdd, 
  showRefresh 
} from "@/store/adminbtnSlice";
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

const OnBoardingSurvey = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { t } = useTranslation('admin')

  const [onBoardingData, setOnBoardingData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // Pagination states
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    dispatch(setTitle(t('manageSurveys.onboardingSurvey.pageTitle')))
    dispatch(
      showAdd({
        label: t('manageSurveys.onboardingSurvey.addLabel'),
        redirectTo: '/admin/manage-surveys/addquestion-onboarding',
      })
    )
    dispatch(
      showRefresh({
        label: t('manageSurveys.onboardingSurvey.refreshLabel'),
        redirectTo: router.asPath,
      })
    )

    // Clean up on unmount
    return () => {
      dispatch(hideAdd())
      dispatch(hideRefresh())
      dispatch(hideExcel())
      dispatch(clearTitle())
    }
  }, [dispatch, router.asPath, t])

  useEffect(() => {
    const fetchOnboardingQuestions = async () => {
      setLoading(true)
      setError('')
      try {
        // Include the current page as a query parameter
        const response = await axios.get(
          `${API_BASE_URL}/questions/onboarding?page=${page}`,
          {
            headers: {
              'x-api-key': API_KEY,
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )

        // Map the data and update pagination info from the response
        const fetchedData =
          response.data?.data?.map((item) => ({
            id: item.id,
            question: item.question,
            description: item.description,
            isActive: item.isActive,
          })) || []

        setOnBoardingData(fetchedData)
        setTotalPages(response.data?.totalPages || 1)
      } catch (error) {
        console.error('Error fetching onboarding questions:', error)
        setError(t('manageSurveys.onboardingSurvey.loadError'))
      } finally {
        setLoading(false)
      }
    }

    fetchOnboardingQuestions()
  }, [page, t])

  const handleDelete = async (id) => {
    setLoading(true)
    try {
      await axios.delete(`${API_BASE_URL}/questions/${id}`, {
        headers: {
          'x-api-key': API_KEY,
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      console.log(`Successfully deleted onboarding question with id: ${id}`)
      setOnBoardingData((prevData) => prevData.filter((q) => q.id !== id))
    } catch (error) {
      console.error(`Error deleting onboarding question with id ${id}:`, error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditRedirect = (id) => {
    console.log(`Redirecting to edit onboarding question ${id}`)
    router.push(`/admin/manage-surveys/edit-onboarding-question/${id}`)
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  return (
    <>
      {loading ? (
        <div className='flex justify-center items-center h-screen'>
          <p className='text-lg font-medium text-gray-600'>
            {t('manageSurveys.onboardingSurvey.loading')}
          </p>
        </div>
      ) : error ? (
        <div className='flex justify-center items-center h-screen'>
          <p className='text-lg font-medium text-red-600'>{error}</p>
        </div>
      ) : (
        <div className='p-4'>
          <SurveyTemplate
            surveyData={onBoardingData}
            onDelete={handleDelete}
            editRedirect={handleEditRedirect}
            showStatus={false} // Hides Active/Inactive pills for onboarding surveys
            headerTitle={t('manageSurveys.onboardingSurvey.pageTitle')}
            questionHeader={t('manageSurveys.onboardingSurvey.questionHeader')}
            descriptionHeader={t(
              'manageSurveys.onboardingSurvey.descriptionHeader'
            )}
            actionsHeader={t('manageSurveys.onboardingSurvey.actionsHeader')}
            editLabel={t('manageSurveys.onboardingSurvey.edit')}
            deleteLabel={t('manageSurveys.onboardingSurvey.delete')}
            noSurveysLabel={t('manageSurveys.onboardingSurvey.noSurveys')}
          />

          {/* Enhanced Pagination UI */}
          <div className='flex justify-center mt-8'>
            <nav className='inline-flex -space-x-px'>
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className='px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50'
              >
                <span aria-hidden='true'>
                  {t('manageSurveys.onboardingSurvey.previousPage')}
                </span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-4 py-2 leading-tight border border-gray-300 bg-white hover:bg-gray-100 ${
                      pageNumber === page
                        ? 'text-blue-600 bg-blue-50 font-medium'
                        : 'text-gray-500'
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className='px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50'
              >
                <span aria-hidden='true'>
                  {t('manageSurveys.onboardingSurvey.nextPage')}
                </span>
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminRoutes(OnBoardingSurvey)

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'admin'])),
    },
  }
}