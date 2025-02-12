import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "@/store/userSlice";
import Layout from "./dashboard/layout";
import { signOut } from "next-auth/react";
import Spinner from "@/components/Spinner";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

const PrivateRoute = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const router = useRouter();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // dispatch(clearUser())
      const verifyToken = async () => {
        setLoading(true);

        const token = localStorage.getItem("user_token");

        if (!token) {
          console.log("no token!!")
          router.replace("/");
          return;
        }

        try {
          // Make an API call to verify the token
          const response = await axios.get(
            `${API_BASE_URL}/auth/verify-token`,
            {
              headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY,
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const { user } = response.data;

          if (user) {
            // Update Redux store with user data
            dispatch(
              setUser(response.data.user)
            );

            // If onboarding is not done, redirect to onboarding
            if (!user.isOnboardingDone) {
              setLoading(false)

            } else {
              setLoading(false); // Stop loading if everything is fine
            }
          }
        } catch (error) {
          console.log(error)
          // console.error("Token verification failed:", error.response?.data || error.message);

          // // Clear any existing user data and redirect to login
          // dispatch(clearUser());
          // localStorage.removeItem("token");
          // router.replace("/");
          dispatch(clearUser());
              localStorage.clear();
              sessionStorage.clear();
              setUserDropdownOpen(false);
              await signOut({ redirect: false });
        }
      };

      // Ensure token verification runs on the client side
      if (typeof window !== "undefined") {
        verifyToken();
      }
    }, [dispatch]);

   

    // Render the wrapped component after successful authentication
    return (
    <Layout>
      {loading?( <div className="flex justify-center items-center min-h-screen">
          <Spinner/>
        </div>):(<><WrappedComponent {...props} /></>)}
    </Layout>);
  };

  return AuthenticatedComponent;
};

export default PrivateRoute;
