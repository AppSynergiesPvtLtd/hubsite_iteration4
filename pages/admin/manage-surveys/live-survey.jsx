import React, { useState, useEffect } from 'react'
import SurveyTemplate from '@/components/AuthComps/ManageSurveys/Surveydetails'
import axios from 'axios'
import { useRouter } from 'next/router'
import AdminRoutes from '../../adminRoutes'
import { useDispatch } from 'react-redux'
import {
  clearTitle,
  hideAdd,
  hideExcel,
  hideRefresh,
  setTitle,
  showAdd,
  showRefresh,
} from '@/store/adminbtnSlice'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

const LiveSurvey = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { t } = useTranslation('admin')

  const [liveSurveyData, setLiveSurveyData] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [notification, setNotification] = useState({ type: '', message: '' })

  // Pagination state
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    dispatch(setTitle(t('manageSurveys.liveSurvey.pageTitle')))
    dispatch(
      showAdd({
        label: t('manageSurveys.liveSurvey.addLabel'),
        redirectTo: '/admin/manage-surveys/addquestion-livesurvey',
      })
    )
    dispatch(
      showRefresh({
        label: t('manageSurveys.liveSurvey.refreshLabel'),
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
    const fetchLiveSurveys = async () => {
      setLoading(true)
      setErrorMessage('')
      try {
        // Use dynamic page state in query params
        const response = await axios.get(
          `${API_BASE_URL}/live-survey/?page=${page}&isActive=false`,
          {
            headers: {
              'x-api-key': API_KEY,
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        console.log('Resp', response)

        // Map the survey data as needed
        const data = response.data?.data || []
        const formattedData = data.map((survey) => ({
          id: survey.id,
          question: survey.title,
          description: survey.description,
          isActive: survey.isActive, // include active/inactive flag
        }))

        setLiveSurveyData(formattedData)
        setTotalPages(response.data?.totalPages || 1)
      } catch (error) {
        console.error('Error fetching live surveys:', error)
        setErrorMessage(t('manageSurveys.liveSurvey.loadError'))
      } finally {
        setLoading(false)
      }
    }

    fetchLiveSurveys()
  }, [page, t])

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/live-survey/${id}`, {
        headers: {
          'x-api-key': API_KEY,
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      // Remove deleted survey from state
      setLiveSurveyData(liveSurveyData.filter((q) => q.id !== id))
      setNotification({
        type: 'success',
        message: t('manageSurveys.liveSurvey.deleteSuccess'),
      })
    } catch (error) {
      console.error('Error deleting live survey:', error)
      setNotification({
        type: 'error',
        message: t('manageSurveys.liveSurvey.deleteError'),
      })
    }
  }

  const handleEditRedirect = (id) => {
    console.log(`Redirecting to edit live survey ${id}`)
    window.location.href = `/admin/manage-surveys/live-survey-questions/${id}`
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p className='text-lg font-medium text-gray-600'>
          {t('manageSurveys.liveSurvey.loading')}
        </p>
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p className='text-lg font-medium text-red-600'>{errorMessage}</p>
      </div>
    )
  }

  return (
    <div className='w-full p-4'>
      {/* Notification Section */}
      {notification.message && (
        <div
          className={`mb-4 p-4 rounded-md text-white ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {notification.message}
        </div>
      )}

      <SurveyTemplate
        surveyData={liveSurveyData}
        onDelete={handleDelete}
        editRedirect={handleEditRedirect}
        headerTitle={t('manageSurveys.liveSurvey.pageTitle')}
        questionHeader={t('manageSurveys.liveSurvey.questionHeader')}
        descriptionHeader={t('manageSurveys.liveSurvey.descriptionHeader')}
        statusHeader={t('manageSurveys.liveSurvey.statusHeader')}
        actionsHeader={t('manageSurveys.liveSurvey.actionsHeader')}
        editLabel={t('manageSurveys.liveSurvey.edit')}
        deleteLabel={t('manageSurveys.liveSurvey.delete')}
        noSurveysLabel={t('manageSurveys.liveSurvey.noSurveys')}
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
              {t('manageSurveys.liveSurvey.previousPage')}
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
              {t('manageSurveys.liveSurvey.nextPage')}
            </span>
          </button>
        </nav>
      </div>
    </div>
  )
}

export default AdminRoutes(LiveSurvey)

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'admin'])),
    },
  }
}
