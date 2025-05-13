import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/router"
import axios from "axios"
import { useSelector } from "react-redux"
import { useTranslation } from 'next-i18next'
import { CircularProgress } from "./CircularProgress"

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const Surveys = () => {
  const { t } = useTranslation('dashboard')
  const router = useRouter()
  const [surveys, setSurveys] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const user = useSelector((state) => state.user?.user)

  useEffect(() => {
    const fetchSurveys = async () => {
      setLoading(true)
      try {
         const response = await axios.get(
          `${API_BASE_URL}/profile-survey/progress/${user.id}`,
          {
            params: {
              page: 1,
              limit: 10,
              isActive: true,
            },
            headers: {
              "Content-Type": "application/json",
              "x-api-key": API_KEY,
              Authorization: `Bearer ${localStorage.getItem("user_token")}`,
            },
          }
        )
        const surveysData = response.data.data || []
        const filteredSurveys = surveysData.filter(
          (survey) => survey.progress?.totalQuestions > 0
        )
        setSurveys(filteredSurveys)
        setTotalPages(response.data.totalPages || 1)
      } catch (error) {
        console.error("Error fetching surveys:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) {
      fetchSurveys()
    }
  }, [user?.id, page])

  const handleSurveyClick = (id) => {
    router.push(`/surveys/${id}`)
  }

  const renderPagination = () => {
    const pages = []
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`px-3 py-1 border rounded ${page === i ? 'bg-[#0057A1] text-white' : 'bg-white text-[#0057A1]'} border-[#0057A1] hover:bg-[#0057A1] hover:text-white transition`}
        >
          {i}
        </button>
      )
    }

    return (
      <div className='flex justify-center gap-2 mt-8'>
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className='px-3 py-1 border rounded bg-white text-[#0057A1] border-[#0057A1] disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {t('<')}
        </button>
        {pages}
        <button
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className='px-3 py-1 border rounded bg-white text-[#0057A1] border-[#0057A1] disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {t('>')}
        </button>
      </div>
    )
  }

  if (loading) {
    return <div className='text-center py-10'>{t('survey.loading')}</div>
  }

  if (surveys.length === 0) {
    return <div className='text-center py-10'>{t('survey.noSurveys')}</div>
  }

  return (
    <div className="p-1 sm:p-4 poppins-semibold">
      <div className="w-[98%] xl:w-[98%] m-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {surveys.map((survey) => {
          const { id, title, hubCoins, progress = {} } = survey
          const {
            totalQuestions = 0,
            answeredQuestions,
            requiredQuestions,
            percentageCompleted = 0,
            isCompleted = false,
          } = progress

          const completed = isCompleted || percentageCompleted === 100

          let topRightContent = null
          let bottomContent = null

          if (completed) {
            topRightContent = (
              <div className='flex flex-col items-end'>
                <span className='text-[#4CAF50] text-lg font-[600] m-auto'>
                  {hubCoins || 20}
                </span>
                <span className='text-[#4CAF50] text-[0.8rem] whitespace-nowrap sm:whitespace-normal md:text-[1rem] font-light '>
                  {t('survey.coins.received')}
                </span>
              </div>
            )
            bottomContent = (
              <div className='text-[#4CAF50] font-semibold'>
                {t('survey.actions.completed')}
              </div>
            )
          } else if (percentageCompleted > 0) {
            topRightContent = <CircularProgress percentage={percentageCompleted} />
            bottomContent = (
              <div className='text-[#0057A1] font-semibold'>
                {t('survey.actions.takeSurvey')}
              </div>
            )
          } else {
            topRightContent = (
              <div className='flex flex-col items-end'>
                <span className='text-lg font-[600] m-auto'>
                  {hubCoins || 20}
                </span>
                <span className='md:text-lg font-[300]'>
                  {t('survey.coins.label')}
                </span>
              </div>
            )
            bottomContent = (
              <div className='text-[#0057A1] font-semibold'>
                {t('survey.actions.takeSurvey')}
              </div>
            )
          }

          return (
            <div
              key={id}
              className='bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col'
            >
              <div className='p-4 flex-grow'>
                <div className='flex justify-between items-start mb-4'>
                  <div className='flex gap-4'>
                    <span className='bg-[#0057A1] text-white px-3 py-1 rounded-full text-sm'>
                      {t('survey.status.active')}
                    </span>
                  </div>
                </div>
                <div className='flex gap-3 items-center justify-between'>
                  <div className='flex gap-4 items-start'>
                    <Image
                      src='/book.png'
                      alt='Survey Icon'
                      width={36}
                      height={44}
                      className='mt-1'
                    />
                    <div>
                      <h3 className='text-[1rem] md:text-lg w-[100%] !font-[500] mb-1 capitalize'>
                        {title}
                      </h3>
                      <p className='text-gray-500'>
                        {2} {t('survey.time.minutes')}
                      </p>
                    </div>
                  </div>
                  <div className='text-center'>{topRightContent}</div>
                </div>
              </div>
              <div
                className={`border-t py-4 text-center ${
                  !completed ? 'cursor-pointer' : 'cursor-not-allowed'
                }`}
                onClick={!completed ? () => handleSurveyClick(id) : undefined}
              >
                {bottomContent}
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination UI */}
      {totalPages > 1 && renderPagination()}
    </div>
  )
}

export default Surveys
