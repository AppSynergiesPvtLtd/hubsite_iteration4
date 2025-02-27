import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { PiEye } from "react-icons/pi";
import { FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export default function AdminLogin() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const validateEmail = () => email.includes("@");
  const validatePassword = () => password.length >= 6;

  const handleLogin = async () => {
    setEmailError(!validateEmail());
    setPasswordError(!validatePassword());

    if (!validateEmail() || !validatePassword()) return;

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/login-email`,
        { email, password },
        {
          headers: {
            "x-api-key": API_KEY,
          },
        }
      );
      const userData = response.data;
      if (userData.role === "USER") {
        console.log("Normal user not allowed on admin portal!");
        setLoading(false);
        return;
      }
      dispatch(setUser(userData));
      // Save admin token under a different key:
      localStorage.setItem("token", userData.token.split(" ")[1]);
      router.push("/admin");
    } catch (error) {
      console.error("Admin login failed:", error);
      setLoading(false);
    } finally {
      // setLoading(false);
    }
  };

  const handleForgotPassword = () => setIsForgotPassword(true);
  const handleBackToLogin = () => setIsForgotPassword(false);

  const handleResetPassword = () => {
    setEmailError(!validateEmail());
    if (!validateEmail()) return;
    alert("Password reset instructions sent to your email.");
    setIsForgotPassword(false);
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (isForgotPassword) {
        handleResetPassword();
      } else {
        handleLogin();
      }
    }
  };

  return (
    <div className="poppins text-gray-500 flex justify-center items-center min-h-screen px-4">
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-80 z-10">
          <div className="flex flex-col items-center">
            <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
            <p className="mt-2 text-gray-700">Loading...</p>
          </div>
        </div>
      )}

      <div
        className={`flex flex-col items-center w-full max-w-md md:max-w-lg lg:max-w-xl bg-white p-6 md:p-8 lg:p-10 border-2 border-gray-200 rounded-md transition-opacity ${
          loading ? "opacity-50" : ""
        }`}
      >
        <div className="relative mb-4">
          <Image
            src="/navbar_logo.png"
            width={200}
            height={200}
            className="rounded-lg"
            alt="Logo"
          />
        </div>

        <div className="flex flex-col w-full space-y-4">
          <div className="w-full">
            <label htmlFor="email" className="block mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`w-full px-4 py-2 border ${
                emailError ? "border-red-500" : "border-gray-300"
              } rounded-md focus:ring-0 focus:outline-none`}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">
                Please enter a valid email address.
              </p>
            )}
          </div>

          {!isForgotPassword && (
            <div className="w-full">
              <label htmlFor="password" className="block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={`w-full px-4 py-2 border ${
                    passwordError ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-0 focus:outline-none`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 text-gray-500"
                >
                  {showPassword ? <PiEye /> : <FaRegEyeSlash />}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">
                  Password must be at least 6 characters long.
                </p>
              )}
            </div>
          )}

          <div className="text-right w-full">
            {!isForgotPassword ? (
              <button
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </button>
            ) : (
              <button
                onClick={handleBackToLogin}
                className="text-sm text-blue-600 hover:underline"
              >
                Back to Login
              </button>
            )}
          </div>

          <button
            onClick={isForgotPassword ? handleResetPassword : handleLogin}
            className={`w-full py-2 rounded-md text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {isForgotPassword ? "Continue" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
