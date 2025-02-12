'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from '@/store/userSlice';
import { useRouter } from 'next/router';
import axios from 'axios';
import Spinner from '@/components/Spinner';

const API_BASE_URL= process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const AppInitializer = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();
  const reduxState = useSelector((state) => state.user);
  const { user } = reduxState;

  // Token verification and initial redirection effect
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);

      const storedToken = localStorage.getItem('user_token');

      if (!storedToken) {
        console.log("No token");
        setIsLoading(false);
        return;
      }

      try {
        // Verify token with the backend
        const response = await axios.get(
          `${API_BASE_URL}/auth/verify-token`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": API_KEY,
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
        console.log(response);

        const { user: userData } = response.data;

        // Update Redux with verified user data
        dispatch(setUser(userData));

        // If the current page is an admin page, bypass onboarding logic.
        if (router.pathname.startsWith('/admin')) {
          setIsLoading(false);
          return;
        }

        // Handle onboarding redirection for non-admin pages
        if (!userData.isOnboardingDone && router.pathname !== '/onboarding') {
          router.replace('/onboarding');
          setIsLoading(false); 
        } else if (userData.isOnboardingDone && router.pathname === '/onboarding') {
          router.replace('/dashboard');
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Token verification failed:", error.response?.data || error.message);
        // Clear invalid token and user data
        localStorage.removeItem('token');
        localStorage.removeItem('user_token');
        dispatch(clearUser());
        router.replace('/');
      }
    };

    initializeApp();
  }, [dispatch, router]);

  // Additional effect to handle user changes (if needed)
  useEffect(() => {
    if (user) {
      // If the current page is an admin page, skip onboarding redirection.
      if (router.pathname.startsWith('/admin')) {
        setIsLoading(false);
        return;
      }

      if (!user.isOnboardingDone && router.pathname !== '/onboarding') {
        router.replace('/onboarding');
        setIsLoading(false); 
      } else if (user.isOnboardingDone && router.pathname === '/onboarding') {
        router.replace('/dashboard');
        setIsLoading(false);
      } else {
        setIsLoading(false); 
      }
    }
  }, [dispatch, router, user]);

  return isLoading ? (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Spinner/>
    </div>
  ) : (
    children
  );
};

export default AppInitializer;