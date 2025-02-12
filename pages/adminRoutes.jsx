import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { clearUser, setUser } from "@/store/userSlice";
import Layout from "./admin/layout";
import Spinner from "@/components/Spinner";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const AdminRoutes = (WrappedComponent) => {
  const WithAdminAuth = (props) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector((state) => state.user.user);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    // Sign out admin: clears token, Redux state, and redirects.
    const signOutAdmin = () => {
      dispatch(clearUser());
      localStorage.removeItem("token");
      router.replace("/admin/auth/login");
    };

    useEffect(() => {
      const tokenInLocalStorage = localStorage.getItem("token");

      // If no token exists, redirect immediately.
      if (!tokenInLocalStorage) {
        router.replace("/admin/auth/login");
        return;
      }

      // If the user is already in Redux and has admin privileges, no need to reverify.
      if (user && user.role === "ADMIN") {
        setIsAuthorized(true);
        setIsLoading(false);
        return;
      }

      // Otherwise, verify the token with the backend.
      const verifyToken = async () => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/auth/verify-token`,
            {
              headers: {
                Authorization: `Bearer ${tokenInLocalStorage}`,
                "x-api-key": API_KEY,
              },
            }
          );
          if (response.data.user.role !== "ADMIN") {
            throw new Error("Admin Access Only");
          }
          dispatch(setUser(response.data.user));
          setIsAuthorized(true);
        } catch (error) {
          console.error("Admin token verification failed:", error);
          signOutAdmin();
        } finally {
          setIsLoading(false);
        }
      };

      verifyToken();
    }, [dispatch, router, user]);

    // While checking the token, show a spinner.
    if (isLoading) {
      return <Spinner />;
    }

    return (
      <Layout>
        {isAuthorized ? <WrappedComponent {...props} /> : null}
      </Layout>
    );
  };

  return WithAdminAuth;
};

export default AdminRoutes;
