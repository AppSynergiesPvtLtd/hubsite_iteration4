import axios from "axios";
import { useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export default function ForgotPassword({ onSwitchTab }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNextStep = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Call Forgot Password API
      await axios.post(
        `${API_BASE_URL}/auth/forgot-password`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
          },
        }
      );

      setCurrentStep(2);
    } catch (error) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || !password) {
      setError("Please enter the OTP and a new password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Call Reset Password API
      await axios.post(
        `${API_BASE_URL}/auth/reset-password`,
        {
          email,
          otp,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
          },
        }
      );

      setCurrentStep(3); // Success step
    } catch (error) {
      setError("Invalid OTP or failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSignUp = () => {
    onSwitchTab("signup");
  };

  // Handle Enter key press and prevent form submission
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      if (currentStep === 1) {
        handleNextStep();
      } else if (currentStep === 2) {
        handleVerifyOtp();
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100%] ">
      {currentStep === 1 && (
        <div className="max-w-md flex flex-col justify-center w-full bg-white shadow-md p-6 rounded">
          <h2 className="text-2xl font-semibold text-center mb-4">Forgot Password</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full border rounded px-4 py-2 mt-1 focus:outline-none"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown} // Add the key down handler here
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            <button
              type="button" // Make sure the button type is "button" to prevent form submission
              onClick={handleNextStep}
              className="w-full bg-[#0057A1] text-white px-4 py-2 rounded hover:bg-[#0056a1f1]"
              disabled={loading}
            >
              {loading ? "Sending..." : "Continue"}
            </button>
          </form>
          <button
            type="button"
            onClick={handleBackToSignUp}
            className="text-[#0057A1] mt-4 text-sm"
          >
            Back
          </button>
        </div>
      )}

      {currentStep === 2 && (
        <div className="max-w-md w-full bg-white shadow-md p-6 rounded">
          <h2 className="text-2xl font-semibold text-center mb-4">Verify OTP</h2>
          <form className="space-y-4">
            <p className="text-gray-600 text-sm text-center">
              Enter the code sent to your email and set a new password.
            </p>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                OTP
              </label>
              <input
                type="text"
                id="otp"
                className="w-full border rounded px-4 py-2 mt-1 focus:outline-none"
                placeholder="Enter the OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                onKeyDown={handleKeyDown} // Add the key down handler here
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full border rounded px-4 py-2 mt-1 focus:outline-none"
                placeholder="Enter a new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown} // Add the key down handler here
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button
              type="button" // Make sure the button type is "button" to prevent form submission
              onClick={handleVerifyOtp}
              className="w-full bg-[#0057A1] text-white px-4 py-2 rounded hover:bg-[#0056a1f1]"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify & Reset Password"}
            </button>
          </form>
        </div>
      )}

      {currentStep === 3 && (
        <div className="max-w-md w-full bg-white shadow-md p-6 rounded">
          <h2 className="text-2xl font-semibold text-center mb-4">Password Reset Successful</h2>
          <p className="text-gray-600 text-sm text-center">
            Your password has been reset successfully. You can now log in with your new password.
          </p>
          <button
            type="button"
            onClick={() => onSwitchTab("login")}
            className="w-full bg-[#0057A1] text-white px-4 py-2 rounded hover:bg-[#0056a1f1] mt-4"
          >
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
}
