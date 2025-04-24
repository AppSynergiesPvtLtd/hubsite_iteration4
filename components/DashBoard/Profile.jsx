import React, { useState, useRef, useMemo, useEffect } from "react";
import Image from "next/image";
import { SlCalender } from "react-icons/sl";
import { useSelector, useDispatch } from "react-redux";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { clearUser, setUser } from "@/store/userSlice";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import metadata from "libphonenumber-js/metadata.min.json";
import Calendar from "../Calendar";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useTranslation } from 'next-i18next'

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

/**
 * Updated getCountryFlagUrl function:
 * - Trims the input.
 * - If the phone number does not start with a "+", prepends one.
 * - Parses the phone number without a default country so that the embedded country code is used.
 */
const getCountryFlagUrl = (phoneNumber) => {
  if (!phoneNumber) return "/Group.png";

  // Remove extra whitespace.
  let formattedPhone = phoneNumber.trim();

  // If the number doesn't start with a "+", add it.
  if (!formattedPhone.startsWith("+")) {
    formattedPhone = `+${formattedPhone}`;
  }

  // Parse without a default country.
  const phoneNumberObj = parsePhoneNumberFromString(formattedPhone, undefined, metadata);
  console.log("Parsed phone number:", formattedPhone, phoneNumberObj);

  if (phoneNumberObj && phoneNumberObj.country) {
    return `https://flagcdn.com/w40/${phoneNumberObj.country.toLowerCase()}.png`;
  }

  return "/default-flag.png";
};

const Profile = () => {
  const { t } = useTranslation('dashboard')
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);
  const router = useRouter();

  // Store the initial values to compare later for changes
  const initialUserInfo = useRef({
    fullName: user?.name || "-",
    phoneNumber: user?.phone || "",
    email: user?.email || "-",
    dob: user?.dob ? new Date(user.dob) : null,
    userDp: user?.userDp || "/dummyProfile.png",
  });

  const [userInfo, setUserInfo] = useState({
    fullName: user?.name || "-",
    phoneNumber: user?.phone || "",
    email: user?.email || "-",
    dob: user?.dob ? new Date(user.dob) : null,
  });

  const [profileImage, setProfileImage] = useState(user?.userDp || "/dummyProfile.png");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState({
    fullName: false,
    phoneNumber: false,
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [showCalendar, setShowCalendar] = useState(false);

  // Update local state if user changes (optional)
  useEffect(() => {
    setUserInfo({
      fullName: user?.name || "-",
      phoneNumber: user?.phone || "",
      email: user?.email || "-",
      dob: user?.dob ? new Date(user.dob) : null,
    });
    setProfileImage(user?.userDp || "/dummyProfile.png");
    // Update the initial ref as well
    initialUserInfo.current = {
      fullName: user?.name || "-",
      phoneNumber: user?.phone || "",
      email: user?.email || "-",
      dob: user?.dob ? new Date(user.dob) : null,
      userDp: user?.userDp || "/dummyProfile.png",
    };
  }, [user]);

  const handleEditToggle = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleFieldChange = (e, field) => {
    const value = e.target.value;
    setUserInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setProfileImageFile(file);
    }
  };

  const handleSave = async () => {
    if (!user?.id) {
      setAlert({ type: 'error', message: t('profile.alerts.missingUserId') })
      return;
    }

    const body = new FormData();
    body.append("name", userInfo.fullName || user?.name || "-");

    if (userInfo.dob) {
      body.append("dob", userInfo.dob.toISOString());
    }

    if (userInfo.phoneNumber) {
      body.append("phone", userInfo.phoneNumber);
    }

    if (profileImageFile) {
      body.append("userDp", profileImageFile);
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/user/${user.id}`, {
        method: "PUT",
        headers: {
          "x-api-key": API_KEY,
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
        body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error("Failed to update profile");
      }

      const updatedUser = await response.json();
      dispatch(setUser(updatedUser));
      setAlert({
        type: 'success',
        message: t('profile.alerts.profileUpdateSuccess'),
      })

      // Reset the profileImageFile and update the initial ref so that no changes are pending
      setProfileImageFile(null);
      initialUserInfo.current = {
        fullName: updatedUser.name || "-",
        phoneNumber: updatedUser.phone || "",
        email: updatedUser.email || "-",
        dob: updatedUser.dob ? new Date(updatedUser.dob) : null,
        userDp: updatedUser.userDp || "/dummyProfile.png",
      };
    } catch (error) {
      console.error("Error updating profile:", error);
      setAlert({
        type: 'error',
        message: t('profile.alerts.profileUpdateError'),
      })
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("user_token");
    await signOut({ redirect: false });
    router.reload();
  };

  // Compute if there are changes compared to the initial state
  const hasChanges = useMemo(() => {
    // Compare full name and phone number
    if (userInfo.fullName !== initialUserInfo.current.fullName) return true;
    if (userInfo.phoneNumber !== initialUserInfo.current.phoneNumber) return true;
    // Compare dates (if one exists and the other doesn't, or both exist but are different)
    const initialDob = initialUserInfo.current.dob;
    const currentDob = userInfo.dob;
    if ((initialDob && !currentDob) || (!initialDob && currentDob)) return true;
    if (initialDob && currentDob && initialDob.getTime() !== currentDob.getTime())
      return true;
    // Check if a new profile image has been selected
    if (profileImageFile) return true;
    return false;
  }, [userInfo, profileImageFile]);

  return (
    <div className='flex flex-col md:flex-row items-start bg-white shadow-md rounded-lg p-6 m-4 md:ml-8 relative'>
      {/* User Information Section */}
      <div className='w-full md:w-2/3 space-y-6'>
        {alert.message && (
          <div
            className={`p-4 mb-4 rounded text-sm ${
              alert.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {alert.message}
          </div>
        )}
        <h2 className='text-[#0057A1] text-2xl font-semibold'>
          {t('profile.title')}
        </h2>
        <p className='text-gray-500 text-sm'>{t('profile.subtitle')}</p>

        <div className='space-y-6'>
          {/* Full Name */}
          <div className='flex justify-between items-center border-b pb-2'>
            <div>
              <p className='text-gray-400 text-sm'>
                {t('profile.fields.fullName.label')}
              </p>
              {isEditing.fullName ? (
                <input
                  type='text'
                  value={userInfo.fullName}
                  onChange={(e) => handleFieldChange(e, 'fullName')}
                  className='border rounded p-1 text-gray-800'
                />
              ) : (
                <p className='text-gray-800 font-medium'>{userInfo.fullName}</p>
              )}
            </div>
            <span
              className='text-[#0057A1] text-sm cursor-pointer'
              onClick={() => handleEditToggle('fullName')}
            >
              {isEditing.fullName
                ? t('profile.buttons.cancel')
                : t('profile.buttons.edit')}
            </span>
          </div>

          {/* Phone Number */}
          <div className='flex justify-between items-center border-b pb-2'>
            <div>
              <p className='text-gray-400 text-sm'>
                {t('profile.fields.phoneNumber.label')}
              </p>
              {isEditing.phoneNumber ? (
                <PhoneInput
                  country={'us'}
                  value={userInfo.phoneNumber}
                  onChange={(phone) =>
                    setUserInfo((prev) => ({ ...prev, phoneNumber: phone }))
                  }
                  inputStyle={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    color: 'black',
                    paddingLeft: '50px',
                  }}
                />
              ) : (
                <div className='flex items-center space-x-2'>
                  <Image
                    src={getCountryFlagUrl(userInfo.phoneNumber)}
                    alt='Country Flag'
                    width={24}
                    height={16}
                    className='rounded'
                  />
                  <p className='text-gray-800 font-medium'>
                    {userInfo.phoneNumber || '-'}
                  </p>
                </div>
              )}
            </div>
            <span
              className='text-[#0057A1] text-sm cursor-pointer'
              onClick={() => handleEditToggle('phoneNumber')}
            >
              {isEditing.phoneNumber
                ? t('profile.buttons.cancel')
                : t('profile.buttons.edit')}
            </span>
          </div>

          {/* Email Address */}
          <div className='flex justify-between items-center border-b pb-2'>
            <div>
              <p className='text-gray-400 text-sm'>
                {t('profile.fields.emailAddress.label')}
              </p>
              <p className='text-gray-800 font-medium'>{userInfo.email}</p>
            </div>
          </div>

          {/* Date of Birth */}
          <div className='flex justify-between items-center border-b pb-2 relative'>
            <div>
              <p className='text-gray-400 text-sm'>
                {t('profile.fields.dateOfBirth.label')}
              </p>
              <p className='text-gray-800 font-medium'>
                {userInfo.dob ? userInfo.dob.toLocaleDateString('en-GB') : '-'}
              </p>
            </div>
            <span
              className='text-[#0057A1] text-sm cursor-pointer'
              onClick={() => setShowCalendar(true)}
            >
              <SlCalender />
            </span>
          </div>
        </div>

        {/* Save and Logout Buttons */}
        <div className='flex flex-col space-y-4 mt-6 m-auto items-center'>
          <button
            onClick={handleSave}
            className={`w-4/6 md:w-2/6 bg-[#0057A1] text-white font-semibold py-2 rounded ${
              loading || !hasChanges
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-600'
            }`}
            disabled={loading || !hasChanges}
          >
            {loading
              ? `${t('profile.buttons.saveChanges')}...`
              : t('profile.buttons.saveChanges')}
          </button>
          <button
            onClick={handleLogout}
            className='w-4/6 md:w-2/6 bg-[#0057A1] text-white font-semibold py-2 rounded'
          >
            {t('profile.buttons.logout')}
          </button>
        </div>
      </div>

      {/* Desktop Profile Picture Section */}
      <div className='hidden md:flex w-full md:w-1/3 flex-col items-center mt-6 md:mt-0'>
        <h3 className='text-[#0057A1] text-lg font-semibold mb-4'>
          {t('profile.displayPicture')}
        </h3>
        <div className='relative'>
          <Image
            src={profileImage}
            alt='Profile Picture'
            width={200}
            height={220}
            className='rounded-full'
          />
          <label
            htmlFor='profileImageDesktop'
            className='absolute bottom-2 right-2 bg-[#0057A1] text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer'
          >
            +
          </label>
          <input
            type='file'
            id='profileImageDesktop'
            accept='image/*'
            className='hidden'
            onChange={handleImageChange}
          />
        </div>
      </div>

      {/* Calendar Modal for Date of Birth */}
      {showCalendar && (
        <div className='fixed inset-0 flex items-center justify-center z-50'>
          {/* Backdrop */}
          <div
            className='absolute inset-0 bg-black opacity-50'
            onClick={() => setShowCalendar(false)}
          ></div>
          <div className='relative'>
            <Calendar
              selectedDate={userInfo.dob}
              onDateSelect={(date) =>
                setUserInfo((prev) => ({ ...prev, dob: date }))
              }
              onSave={(date) => {
                setUserInfo((prev) => ({ ...prev, dob: date }))
                setShowCalendar(false)
              }}
              onCancel={() => setShowCalendar(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
};

export default Profile;
