import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useDispatch } from "react-redux";
import { clearTitle, hideAdd, hideExcel, hideRefresh, setTitle, showRefresh } from "@/store/adminbtnSlice";
import { useRouter } from "next/router";
// If you need the AdminRoutes import for route protection, uncomment the next line
// import AdminRoutes from "../adminRoutes";
import Group from "../../public/group.svg";
import House from "../../public/h-dashboard.svg";



ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Base configuration
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const Admindashboard = () => {
  const dispatch = useDispatch()
  const router = useRouter()
   useEffect(() => {
      dispatch(setTitle("Dashboard"))
      dispatch(showRefresh({ label: "Refresh", redirectTo: router.asPath }));
      
      
  
      return () => {
        dispatch(hideAdd())
        dispatch(hideRefresh())
        dispatch(hideExcel())
        dispatch(clearTitle())
      }
    }, [dispatch, router.asPath])

  // State for stats (/user/stats)
  const [stats, setStats] = useState({
    userCount: 0,
    surveyCount: 0,
    serveyCompletedCount: 0,
    profileSurvey: 0,
    profileSurveyCompletion: 0,
  });

  // State for weekly new users (/user/weekly-new-users)
  const [weeklyNewUsers, setWeeklyNewUsers] = useState({
    labels: [],
    values: [],
  });

  // State for weekly survey completions (/live-survey/weekly-completions)
  const [weeklySurveyCompletions, setWeeklySurveyCompletions] = useState({
    labels: [],
    values: [],
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchStats();
    fetchWeeklyNewUsers();
    fetchWeeklySurveyCompletions();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${baseUrl}/user/stats`, {
        headers: {
          "x-api-key": API_KEY,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching /user/stats:", error);
    }
  };

  const fetchWeeklyNewUsers = async () => {
    try {
      const response = await fetch(`${baseUrl}/user/weekly-new-users`, {
        headers: {
          "x-api-key": API_KEY,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setWeeklyNewUsers(data);
    } catch (error) {
      console.error("Error fetching /user/weekly-new-users:", error);
    }
  };

  const fetchWeeklySurveyCompletions = async () => {
    try {
      const response = await fetch(`${baseUrl}/live-survey/weekly-completions`, {
        headers: {
          "x-api-key": API_KEY,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setWeeklySurveyCompletions(data);
    } catch (error) {
      console.error("Error fetching /live-survey/weekly-completions:", error);
    }
  };

  // Build chart data for "New Users"
  const newUsersData = {
    labels: weeklyNewUsers.labels,
    datasets: [
      {
        label: "New Users",
        data: weeklyNewUsers.values,
        backgroundColor: "#0057A1",
        borderRadius: 4,
      },
    ],
  };

  // Build chart data for "Surveys Completed"
  const surveysCompletedData = {
    labels: weeklySurveyCompletions.labels,
    datasets: [
      {
        label: "Surveys Completed",
        data: weeklySurveyCompletions.values,
        backgroundColor: "#0057A1",
        borderRadius: 6,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 14,
          },
        },
      },
      y: {
        grid: {
          color: "#e5e7eb",
        },
        ticks: {
          font: {
            size: 14,
          },
          stepSize: 1, // Adjust to suit your data range
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-6  min-h-screen">
      {/* Top Stats */}
      <div className="flex flex-wrap ml-6 gap-1 md:gap-6 mb-6">
        <div className="bg-white shadow-lg w-[200px] md:w-[230px] rounded-lg p-6 flex items-center gap-6 border-l-4 border-[#0057A1]">
        <div className="bg-blue-200 w-12 h-12 flex items-center justify-center rounded-full">
          <Group />
        </div>

          <div>
            <h3 className="text-lg">Users</h3>
            <p className="text-2xl">{stats.userCount}</p>
          </div>
        </div>
        <div className="bg-white shadow-lg w-[200px] md:w-[230px] rounded-lg p-6 flex items-center gap-6 border-l-4 border-[#0057A1]">
        <div className="bg-blue-200 w-12 h-12 flex items-center justify-center rounded-full">
          <House />
        </div>
          <div>
            <h3 className="text-lg">Surveys</h3>
            <p className="text-2xl">{stats.surveyCount}</p>
          </div>
        </div>
        <div className="bg-white shadow-lg w-[270px] sm:w-[200px] md:w-[300px] rounded-lg p-6 flex items-center gap-6 border-l-4 border-[#0057A1]">
        <div className="bg-blue-200 w-12 h-12 flex items-center justify-center rounded-full">
          <House />
        </div>
          <div>
            <h3 className="text-lg">Surveys Completed</h3>
            <p className="text-2xl">{stats.serveyCompletedCount}</p>
          </div>
        </div>
      </div>

      {/* Google Analytics Button */}
      {/* <div className="text-center mt-12">
        <button className="bg-[#0057A1] text-white text-lg py-4 px-8 rounded-lg shadow-lg hover:bg-[#0056a1e9]">
          Visit Google Analytics
        </button>
      </div> */}

      {/* Charts */}
      <div className="flex flex-wrap justify-center gap-24 mt-16">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full md:w-[35%]">
          <h3 className="text-lg mb-4 text-center">New Users</h3>
          <Bar data={newUsersData} options={chartOptions} />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 w-full md:w-[35%]">
          <h3 className="text-lg mb-4 text-center">Survey Completed</h3>
          <Bar data={surveysCompletedData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Admindashboard;
