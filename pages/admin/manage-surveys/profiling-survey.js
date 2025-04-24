import SurveyTemplate from "@/components/AuthComps/ManageSurveys/Surveydetails";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import AdminRoutes from "../../adminRoutes";
import { useDispatch } from "react-redux";
import {
  clearTitle,
  hideAdd,
  hideExcel,
  hideRefresh,
  setTitle,
  showAdd,
  showRefresh,
} from "@/store/adminbtnSlice";
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

const ProfileSurvey = () => {
  const router = useRouter()
  const { t } = useTranslation('admin')
  const [profilingData, setProfilingData] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [notification, setNotification] = useState({ type: '', message: '' })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setTitle(t('manageSurveys.profilingSurvey.pageTitle')))
    dispatch(
      showAdd({
        label: t('manageSurveys.profilingSurvey.addLabel'),
        redirectTo: '/admin/manage-surveys/add-profilesurvey',
      })
    )
    dispatch(
      showRefresh({
        label: t('manageSurveys.profilingSurvey.refreshLabel'),
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
    const fetchProfileSurveys = async () => {
      setLoading(true)
      setErrorMessage('')
      try {
        const response = await axios.get(
          `${API_BASE_URL}/profile-survey/?isActive=false&page=${page}`,
          {
            headers: {
              'x-api-key': API_KEY,
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )

        // API response expected to include totalPages along with the data array
        const surveys = response.data?.data || []
        setTotalPages(response.data?.totalPages || 1)

        const formattedData = surveys.map((survey) => ({
          id: survey.id,
          question: survey.title,
          description: survey.description,
          isActive: survey.isActive,
        }))

        setProfilingData(formattedData)
      } catch (error) {
        console.error('Error fetching profile surveys:', error)
        setErrorMessage(t('manageSurveys.profilingSurvey.loadError'))
      } finally {
        setLoading(false)
      }
    }

    fetchProfileSurveys()
  }, [page, t])

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/profile-survey/${id}`, {
        headers: {
          'x-api-key': API_KEY,
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      setProfilingData(profilingData.filter((q) => q.id !== id))
      setNotification({
        type: 'success',
        message: t('manageSurveys.profilingSurvey.deleteSuccess'),
      })
    } catch (error) {
      console.error('Error deleting profile survey:', error)
      setNotification({
        type: 'error',
        message: t('manageSurveys.profilingSurvey.deleteError'),
      })
    }
  }

  const handleEditRedirect = (id) => {
    console.log(`Redirecting to edit profile survey ${id}`)
    window.location.href = `/admin/manage-surveys/add-profilesurvey?id=${id}`
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
          {t('manageSurveys.profilingSurvey.loading')}
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
        surveyData={profilingData}
        onDelete={handleDelete}
        editRedirect={handleEditRedirect}
        headerTitle={t('manageSurveys.profilingSurvey.pageTitle')}
        questionHeader={t('manageSurveys.profilingSurvey.questionHeader')}
        descriptionHeader={t('manageSurveys.profilingSurvey.descriptionHeader')}
        statusHeader={t('manageSurveys.profilingSurvey.statusHeader')}
        actionsHeader={t('manageSurveys.profilingSurvey.actionsHeader')}
        editLabel={t('manageSurveys.profilingSurvey.edit')}
        deleteLabel={t('manageSurveys.profilingSurvey.delete')}
        noSurveysLabel={t('manageSurveys.profilingSurvey.noSurveys')}
      />

      {/* Enhanced Pagination Controls */}
      <div className='flex justify-center mt-8'>
        <nav className='inline-flex -space-x-px'>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className='px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50'
          >
            <span aria-hidden='true'>
              {t('manageSurveys.profilingSurvey.previousPage')}
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
              {t('manageSurveys.profilingSurvey.nextPage')}
            </span>
          </button>
        </nav>
      </div>
    </div>
  )
}

export default AdminRoutes(ProfileSurvey)

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'admin'])),
    },
  }
}