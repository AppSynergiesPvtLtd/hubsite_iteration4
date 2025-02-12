import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/router"
import axios from "axios"
import { useSelector } from "react-redux"
import { CircularProgress } from "./CircularProgress"

const API_BASE_URL= process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const Surveys = () => {
  const router = useRouter()
  const [surveys, setSurveys] = useState([])
  const [loading, setLoading] = useState(true)
  const user = useSelector((state) => state.user?.user)
  useEffect(() => {
    const fetchSurveys = async () => {
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
        console.log("Res", response)
        const surveysData = response.data.data || []
        // Filter out surveys where totalQuestions is not greater than 0
        const filteredSurveys = surveysData.filter(
          (survey) => survey.progress?.totalQuestions > 0
        )
        setSurveys(filteredSurveys)
      } catch (error) {
        console.error("Error fetching surveys:", error)
      } finally {
        setLoading(false)
      }
    }
  
    if (user?.id) {
      fetchSurveys()
    }
  }, [user?.id])
  

  const handleSurveyClick = (id) => {
    router.push(`/surveys/${id}`)
  }

  if (loading) {
    return <div className="text-center py-10">Loading surveys...</div>
  }

  if (surveys.length === 0) {
    return <div className="text-center py-10">No surveys available.</div>
  }

  return (
    <div className="p-4 poppins-semibold">
      <div className="w-[95%] xl:w-[80%] m-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6">
        {surveys.map((survey) => {
          const { id, title, hubCoins, progress = {} } = survey
          // Destructure progress values
          const {
            totalQuestions = 0,
            answeredQuestions,
            requiredQuestions,
            percentageCompleted = 0,
            isCompleted = false,
          } = progress

          // Determine if the survey is completed
          const completed = isCompleted || percentageCompleted === 100

          let topRightContent = null
          let bottomContent = null

          if (completed) {
            topRightContent = (
              <div className="flex flex-col items-end">
                <span className="text-[#4CAF50] text-2xl md:text-3xl font-bold m-auto">
                  {hubCoins || 20}
                </span>
                <span className="text-[#4CAF50] md:text-lg font-light">
                  HUBCOINS RECEIVED
                </span>
              </div>
            )
            bottomContent = <div className="text-[#4CAF50] font-semibold">Completed</div>
          } else if (percentageCompleted > 0) {
            topRightContent = <CircularProgress percentage={percentageCompleted} />
            bottomContent = <div className="text-[#0057A1] font-semibold">TAKE SURVEY</div>
          } else {
            topRightContent = (
              <div className="flex flex-col items-end">
                <span className="text-2xl font-[600] m-auto">{hubCoins || 20}</span>
                <span className="sm:text-lg font-[300]">HUBCOINS</span>
              </div>
            )
            bottomContent = <div className="text-[#0057A1] font-semibold">TAKE SURVEY</div>
          }

          return (
            <div key={id} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
              <div className="p-4 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    <span className="bg-[#0057A1] text-white px-3 py-1 rounded-full text-sm">
                      Active
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 items-center justify-between">
                  <div className="flex gap-4 items-start">
                    <Image
                      src="/book.png"
                      alt="Survey Icon"
                      width={36}
                      height={44}
                      className="mt-1"
                    />
                    <div>
                      <h3 className="md:text-xl w-[100%] font-semibold mb-1 capitalize">{title}</h3>
                      <p className="text-gray-500">{2} min</p>
                    </div>
                  </div>
                  <div className="text-center">{topRightContent}</div>
                </div>
              
              </div>
              <div
                className={`border-t py-4 text-center ${!completed ? "cursor-pointer" : "cursor-not-allowed"}`}
                onClick={!completed ? () => handleSurveyClick(id) : undefined}
              >
                {bottomContent}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Surveys
