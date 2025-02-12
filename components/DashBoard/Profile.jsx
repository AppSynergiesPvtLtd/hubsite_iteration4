import React, { useState } from "react";
import Image from "next/image"; // Ensure you're using Next.js
import { SlCalender } from "react-icons/sl";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector, useDispatch } from "react-redux";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { setUser } from "@/store/userSlice";

const API_BASE_URL= process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const countryCodeToFlagUrl = (countryCode) =>
  `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;

const phoneToCountryCode = {
  "91": "in", // India
  "1": "us", // USA
  "44": "gb", // United Kingdom
  "49": "de", // Germany
  "81": "jp", // Japan
};

const getCountryFlagUrl = (phoneNumber) => {
  if (!phoneNumber || !phoneNumber.startsWith("+")) return "/Group.png";
  const countryCode = phoneNumber.match(/^\+?(\d+)/)?.[1];
  const country = phoneToCountryCode[countryCode];
  return country ? countryCodeToFlagUrl(country) : "/default-flag.png";
};


const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user); // Redux state for user data

  const [userInfo, setUserInfo] = useState({
    fullName: user?.name || "-",
    phoneNumber: user?.phone || "",
    email: user?.email || "-",
    dob: user?.dob ? new Date(user.dob) : null,
  });

  const [profileImage, setProfileImage] = useState(user?.userDp || "/dummyProfile.png");
  const [profileImageFile, setProfileImageFile] = useState(null); // Store the selected file
  const [isEditing, setIsEditing] = useState({
    fullName: false,
    phoneNumber: false,
    dob: false,
  });
  const [loading, setLoading] = useState(false);

  // UI alert state
  const [alert, setAlert] = useState({ type: "", message: "" });

  const handleEditToggle = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleFieldChange = (e, field) => {
    const value = e.target.value;
    setUserInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (date) => {
    setUserInfo((prev) => ({ ...prev, dob: date }));
    setIsEditing((prev) => ({ ...prev, dob: false }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setProfileImageFile(file); // Store file for upload
    }
  };

  const handleSave = async () => {
    if (!user?.id) {
      setAlert({ type: "error", message: "User ID is missing" });
      return;
    }

    const body = new FormData();

    // Always include required fields (like name)
    body.append("name", userInfo.fullName || user?.name || "-");

    // Append optional fields only if they exist
    if (userInfo.dob) {
      body.append("dob", userInfo.dob?.toISOString());
    }

    if (userInfo.phoneNumber) {
      body.append("phone", userInfo.phoneNumber);
    }

    // Append the profile image only if it's updated
    if (profileImageFile) {
      body.append("userDp", profileImageFile);
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/user/${user.id}`, {
        method: "PUT",
        headers: {
          "x-api-key": API_KEY, // API key
          Authorization: `Bearer ${localStorage.getItem("user_token")}`, // Bearer token
        },
        body, // Pass FormData directly
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData); // Log server response for debugging
        throw new Error("Failed to update profile");
      }

      const updatedUser = await response.json();
      dispatch(setUser(updatedUser)); // Update Redux state with the updated user
      setAlert({ type: "success", message: "Profile updated successfully!" });
    } catch (error) {
      console.error("Error updating profile:", error);
      setAlert({ type: "error", message: "Failed to update profile. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start bg-white shadow-md rounded-lg p-6 m-4 md:ml-8">
      {/* Alert message */}
     

      {/* User Information Section */}
      <div className="w-full md:w-2/3 space-y-6">
      {alert.message && (
        <div
          className={`p-4 mb-4 rounded text-sm ${
            alert.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {alert.message}
        </div>
      )}
        <h2 className="text-[#0057A1] text-2xl font-semibold">Profile</h2>
        <p className="text-gray-500 text-sm">See your account information in here!</p>

        <div className="space-y-6">
          {/* Full Name */}
          <div className="flex justify-between items-center border-b pb-2">
            <div>
              <p className="text-gray-400 text-sm">Full Name</p>
              {isEditing.fullName ? (
                <input
                  type="text"
                  value={userInfo.fullName}
                  onChange={(e) => handleFieldChange(e, "fullName")}
                  className="border rounded p-1 text-gray-800"
                />
              ) : (
                <p className="text-gray-800 font-medium">{userInfo.fullName}</p>
              )}
            </div>
            <span
              className="text-[#0057A1] text-sm cursor-pointer"
              onClick={() => handleEditToggle("fullName")}
            >
              {isEditing.fullName ? "Cancel" : "Edit"}
            </span>
          </div>

          {/* Phone Number */}
          <div className="flex justify-between items-center border-b pb-2">
            <div>
              <p className="text-gray-400 text-sm">Phone Number</p>
              {isEditing.phoneNumber ? (
                <PhoneInput
                  country={"us"}
                  value={userInfo.phoneNumber}
                  onChange={(phone) =>
                    setUserInfo((prev) => ({ ...prev, phoneNumber: phone }))
                  }
                  inputStyle={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    color: "black",
                    paddingLeft: "50px",
                  }}
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Image
                    src={getCountryFlagUrl(userInfo.phoneNumber)}
                    alt="Country Flag"
                    width={24}
                    height={16}
                    className="rounded"
                  />
                  <p className="text-gray-800 font-medium">{userInfo.phoneNumber || "-"}</p>
                </div>
              )}
            </div>
            <span
              className="text-[#0057A1] text-sm cursor-pointer"
              onClick={() => handleEditToggle("phoneNumber")}
            >
              {isEditing.phoneNumber ? "Cancel" : "Edit"}
            </span>
          </div>

          {/* Email Address */}
          <div className="flex justify-between items-center border-b pb-2">
            <div>
              <p className="text-gray-400 text-sm">Email Address</p>
              <p className="text-gray-800 font-medium">{userInfo.email}</p>
            </div>
          </div>

          {/* Date of Birth */}
          <div className="flex justify-between items-center border-b pb-2">
            <div>
              <p className="text-gray-400 text-sm">Date of Birth</p>
              {isEditing.dob ? (
                <DatePicker
                  selected={userInfo.dob}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  className="border rounded p-1 text-gray-800"
                />
              ) : (
                <p className="text-gray-800 font-medium">
                  {userInfo.dob ? userInfo.dob.toLocaleDateString("en-GB") : "-"}
                </p>
              )}
            </div>
            <span
              className="text-[#0057A1] text-sm cursor-pointer"
              onClick={() => handleEditToggle("dob")}
            >
              {isEditing.dob ? "Cancel" : <SlCalender />}
            </span>
          </div>
        </div>

        {/* Save and Logout Buttons */}
        <div className="flex flex-col space-y-4 mt-6 m-auto items-center">
          <button
            onClick={handleSave}
            className={`w-4/6 md:w-2/6 bg-[#0057A1] text-white font-semibold py-2 rounded ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button className="w-4/6 md:w-2/6 bg-red-500 text-white font-semibold py-2 rounded">
            Logout
          </button>
        </div>
      </div>

      {/* Desktop Profile Picture Section */}
      <div className="hidden md:flex w-full md:w-1/3 flex-col items-center mt-6 md:mt-0">
        <h3 className="text-[#0057A1] text-lg font-semibold mb-4">Display Picture</h3>
        <div className="relative">
          <Image
            src={profileImage}
            alt="Profile Picture"
            width={200}
            height={220}
            className="rounded-full"
          />
          <label
            htmlFor="profileImageDesktop"
            className="absolute bottom-2 right-2 bg-[#0057A1] text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
          >
            +
          </label>
          <input
            type="file"
            id="profileImageDesktop"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
