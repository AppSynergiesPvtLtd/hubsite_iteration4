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
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'


const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const Userinformation = () => {
  const router = useRouter();
  const dispatch = useDispatch()
  const { slug } = router.query; // Get the slug (user id) from the URL
  const { t } = useTranslation('admin')

  // Local state for API response, loading and error
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    dispatch(setTitle(t('userInformation.title')))
    // dispatch(showAdd({ label: "Add", redirectTo: "/admin/manage-surveys/addquestion-livesurvey" }));
    dispatch(
      showRefresh({
        label: t('userInformation.refresh'),
        redirectTo: router.asPath,
      })
    )
    // dispatch(showExcel({ label: "Generate Excel", redirectTo: "/admin/export-excel" }));

    // Clean up on unmount
    return () => {
      dispatch(hideAdd())
      dispatch(hideRefresh())
      dispatch(hideExcel())
      dispatch(clearTitle())
    }
  }, [dispatch, router.asPath, t])

  // Fetch user data when the id is available
  useEffect(() => {
    if (!slug) return // Wait until id is defined
    const fetchUserData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axios.get(`${API_BASE_URL}/user/${slug}`, {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        setUserData(response.data)
      } catch (err) {
        // Check if there's a response from the server
        setError(
          err.response?.data?.message ||
            err.message ||
            t('userInformation.fetchError')
        )
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [slug, t])

  if (loading) {
    return (
      <div className='p-4'>
        <Spinner />
      </div>
    )
  }

  if (error) {
    return <div className='p-4 text-red-600'>Error: {error}</div>
  }
  return (
    <div className='p-4'>
      <img
        src={userData.userDp || '/dummyProfile.png'}
        alt={t('userInformation.userInfo')}
        className='w-[200px] h-[200px] max-w-sm rounded-full'
      />
      <div className='leading-[40px] mt-4'>
        <p>
          <b>{t('userInformation.name')} :</b> {userData.name || '-'}
        </p>
        <p>
          <b>{t('userInformation.email')} :</b> {userData.email || '-'}
        </p>
        <p>
          <b>{t('userInformation.mobileNumber')} :</b> {userData.phone || '-'}
        </p>
        <p>
          <b>{t('userInformation.dateOfBirth')} :</b>{' '}
          {userData.dob ? new Date(userData.dob).toLocaleDateString() : '-'}
        </p>
        {/* Since the API response doesn’t provide a Country Code, display a placeholder */}
        <p>
          <b>{t('userInformation.countryCode')} : </b>
          {userData.phone ? <>+{userData.phone.slice(0, 2)}</> : <>-</>}
        </p>
        <p>
          <b>{t('userInformation.date')} :</b>{' '}
          {userData.createdAt
            ? new Date(userData.createdAt).toLocaleDateString()
            : '-'}
        </p>
      </div>
    </div>
  )
};

export default AdminRoutes(Userinformation);

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'admin'])),
    },
  }
}
