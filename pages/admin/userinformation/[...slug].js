"use client";
import React, { useState, useEffect } from "react";
import Layout from "../layout";
import Link from "next/link";
import AdminRoutes from "../../adminRoutes";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { useDispatch } from "react-redux";
import { clearTitle, hideAdd, hideExcel, hideRefresh, setTitle, showRefresh } from "@/store/adminbtnSlice";


const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const Userinformation = () => {
  const router = useRouter();
  const dispatch = useDispatch()
  const { slug } = router.query; // Get the slug (user id) from the URL

  // Local state for API response, loading and error
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 useEffect(() => {
    dispatch(setTitle("User Info"));
    // dispatch(showAdd({ label: "Add", redirectTo: "/admin/manage-surveys/addquestion-livesurvey" }));
    dispatch(showRefresh({ label: "Refresh", redirectTo: router.asPath }));
    // dispatch(showExcel({ label: "Generate Excel", redirectTo: "/admin/export-excel" }));

    // Clean up on unmount
    return () => {
      dispatch(hideAdd());
      dispatch(hideRefresh());
      dispatch(hideExcel());
      dispatch(clearTitle());
    };
  }, [dispatch, router.asPath]);
  
  // Fetch user data when the id is available
  useEffect(() => {
    if (!slug) return; // Wait until id is defined
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/user/${slug}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": API_KEY,
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUserData(response.data);
      } catch (err) {
        // Check if there's a response from the server
        setError(
          err.response?.data?.message ||
            err.message ||
            "Something went wrong while fetching the user data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [slug]);

  if (loading) {
    return (
        <div className="p-4"><Spinner/></div>
    );
  }

  if (error) {
    return (
        <div className="p-4 text-red-600">Error: {error}</div>
    );
  }
  console.log("data",userData.userDp)
  return (
      <div className="p-4">
        <img src={userData.userDp||"/dummyProfile.png"} alt="User Info" className="w-[200px] h-[200px] max-w-sm rounded-full" />
        <div className="leading-[40px] mt-4">
          <p>
            <b>Name :</b> {userData.name || "-"}
          </p>
          <p>
            <b>Email :</b> {userData.email || "-"}
          </p>
          <p>
            <b>Mobile Number :</b> {userData.phone || "-"}
          </p>
          <p>
            <b>Date Of Birth :</b> {userData.dob ? new Date(userData.dob).toLocaleDateString() : "-"}
          </p>
          {/* Since the API response doesn’t provide a Country Code, display a placeholder */}
          <p>
            <b>Country Code :</b> -
          </p>
          <p>
            <b>Date:</b> {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "-"}
          </p>
          <Link href="/admin/usermanagement">
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Back
            </button>
          </Link>
        </div>
      </div>
  );
};

export default AdminRoutes(Userinformation);
