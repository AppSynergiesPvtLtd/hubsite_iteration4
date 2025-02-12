"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import axios from "axios";
import Image from "next/image";
import { useState, useEffect } from "react";
import { PiEye } from "react-icons/pi";
import { FaRegEyeSlash } from "react-icons/fa";
import { setUser } from "@/store/userSlice";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export default function SignUp() {
  const [currentStep, setCurrentStep] = useState(1);
  const { data: session, status } = useSession();
  const [resendLoading, setResendLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: true,
    rememberMe: true,
    otp: "",
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const userData = {
        name: session.name,
        email: session.email,
        image: session.image,
        id: session.id,
        accessToken: session.accessToken,
      };
      localStorage.setItem("user_token", session.accessToken);
      dispatch(setUser(userData));
    }
  }, [status, session, dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setErrors({ ...errors, [name]: "" });
    setAlert({ message: "", type: "" });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleNext = async () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm password is required";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.agreeTerms)
      newErrors.agreeTerms = "You must agree to the terms and conditions";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const signupResp = await axios.post(
        `${API_BASE_URL}/auth/register-email`,
        {
          email: formData.email,
          password: formData.confirmPassword,
          name: `${formData.firstName} ${formData.lastName}`,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
          },
        }
      );

      setAlert({ message: "OTP sent successfully!", type: "success" });
      setErrors({});
      setCurrentStep(2);
    } catch (error) {
      setAlert({
        message:
          error.response?.data?.message ||
          "Failed to send OTP. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    setErrors({});
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!formData.otp) {
      setErrors({ otp: "OTP is required" });
      return;
    }

    setLoading(true);
    try {
      const OtpResp = await axios.post(
        `${API_BASE_URL}/auth/verify-email`,
        {
          email: formData.email,
          otp: formData.otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
          },
        }
      );
      localStorage.setItem("user_token", OtpResp.data.token.split(" ")[1]);
      dispatch(setUser(OtpResp.data));
      setAlert({ message: "OTP verified successfully!", type: "success" });
      setCurrentStep(3);
    } catch (error) {
      setAlert({
        message:
          error.response?.data?.message ||
          "OTP verification failed. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    router.push("/?modal=login", undefined, { shallow: true });
  };

  const handleGoogleSignUp = async () => {
    router.push("/google-auth");
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setAlert({ message: "", type: "" });
    try {
      await axios.post(
        `${API_BASE_URL}/auth/resend-email-verification`,
        { email: formData.email },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
          },
        }
      );
      setAlert({
        message: "OTP has been resent to your email.",
        type: "info",
      });
    } catch (error) {
      setAlert({
        message:
          error.response?.data?.message ||
          "Failed to resend OTP. Please try again.",
        type: "error",
      });
    } finally {
      setResendLoading(false);
    }
  };

  const [googleTriggered, setGoogleTriggered] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.idToken && !googleTriggered) {
      setGoogleTriggered(true);
      setLoading(true);
      (async () => {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/auth/google`,
            { idToken: session.idToken },
            {
              headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY,
              },
            }
          );
          const userData = response.data;
          localStorage.setItem("user_token", userData.token.split(" ")[1]);
          dispatch(setUser(userData));
        } catch (err) {
          setError(
            err.response?.data?.message ||
              "Google login failed. Please try again."
          );
          setLoading(false);
        }
      })();
    }
  }, [status, session, googleTriggered, dispatch, router]);

  const handleGoogleLogin = async () => {
    setError("");
    await signIn("google");
  };

  return (
    <div className="poppins flex flex-col md:flex-row justify-center items-center min-fit text-black">
      <div className="w-full max-w-md bg-white rounded-lg space-y-6 p-6 shadow-lg z-50">
        {alert.message && (
          <div
            className={`p-4 text-center z-50 ${
              alert.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            } rounded`}
          >
            {alert.message}
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-center mb-4">
              Sign Up
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="firstName" className="block font-medium">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-0"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <label htmlFor="lastName" className="block font-medium">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-0"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-0"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <div className="relative">
                <label htmlFor="password" className="block font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    name="password"
                    className="w-full border rounded px-4 py-2 pr-10 focus:outline-none focus:ring-0"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                    onClick={togglePasswordVisibility}
                  >
                    {passwordVisible ? (
                      <PiEye className="h-5 w-5" />
                    ) : (
                      <FaRegEyeSlash className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password}
                  </p>
                )}
              </div>
              <div className="relative">
                <label htmlFor="confirmPassword" className="block font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    className="w-full border rounded px-4 py-2 pr-10 focus:outline-none focus:ring-0"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {confirmPasswordVisible ? (
                      <PiEye className="h-5 w-5" />
                    ) : (
                      <FaRegEyeSlash className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="mr-2 focus:ring-0"
                />
                Remember Me
              </label>
              <label className="flex items-center flex-wrap">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="mr-2 focus:ring-0"
                />
                I agree to the&nbsp;
                <a href="/termsofuse" className="text-[#0057A1]">
                  terms
                </a>
                &nbsp;and&nbsp;
                <a href="/privacypolicy" className="text-[#0057A1]">
                  Privacy Policy
                </a>.
              </label>
              {errors.agreeTerms && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.agreeTerms}
                </p>
              )}
            </div>
            <div className="text-center">
              <button
                type="button"
                className="bg-[#0057A1] text-white w-full py-2 rounded hover:bg-[#0056a1ef] transition"
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? "Processing..." : "Sign Up"}
              </button>
            </div>
            <p className="text-sm w-[80%] m-auto text-center text-black">
              Already have an account?{" "}
              <button
                onClick={handleSignUp}
                className="text-[#0057A1] hover:underline font-semibold"
              >
                Login
              </button>
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleGoogleLogin}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 shadow hover:bg-gray-200"
                >
                  <Image
                    src="/google.svg"
                    alt="Google"
                    width={24}
                    height={24}
                  />
                </button>
              </div>
            </p>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h1 className="text-xl font-semibold">Verify Email</h1>
            <p>Enter the code sent to your email</p>
            <input
              type="text"
              placeholder="Enter OTP Code"
              className="border border-gray-200 p-2 w-full focus:outline-none focus:ring-0"
              name="otp"
              value={formData.otp}
              onChange={handleInputChange}
            />
            {errors.otp && (
              <p className="text-red-500 text-sm mt-1">
                {errors.otp}
              </p>
            )}
            <div className="flex flex-col space-y-2">
              <button
                type="button"
                className="bg-[#0057A1] text-white py-2 px-4 rounded hover:bg-[#0056a1ef] transition"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
              <button
                type="button"
                className="bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition"
                onClick={handleResendOtp}
                disabled={resendLoading}
              >
                {resendLoading ? "Resending..." : "Resend OTP"}
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="flex flex-col justify-center items-center space-y-6 text-center h-[30rem]">
            <Image
              src="/login.jpg"
              alt="Profile Completion"
              width={350}
              height={200}
              objectFit="contain"
            />
            <h1 className="text-xl font-semibold">
              You're all set! Finish your profile to get started
            </h1>
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="bg-[#0057A1] text-white py-2 px-6 rounded-lg hover:bg-[#0056a1ef] transition"
            >
              Create Profile
            </button>
          </div>
        )}
      </div>

      {currentStep !== 3 && (
        <div className="hidden md:flex items-center justify-center relative h-[76vh] w-[100%]">
          <Image
            src="/login.jpg"
            alt="Step Illustration"
            layout="fill"
            objectFit="contain"
            className="rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
