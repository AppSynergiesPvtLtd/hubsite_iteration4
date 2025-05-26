import React, { useState, useRef, useMemo, useEffect } from "react";
import Image from "next/image";
import { SlCalender } from "react-icons/sl";
import { useSelector, useDispatch } from "react-redux";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { setUser } from "@/store/userSlice";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import Calendar from "../Calendar";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useTranslation } from 'next-i18next';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

/**
 * Improved getCountryFlagUrl function:
 * - Properly handles international phone numbers
 * - Ensures the country code is correctly parsed
 * - Falls back to default flag if parsing fails
 */
const getCountryFlagUrl = (phoneNumber) => {
  if (!phoneNumber || phoneNumber.length < 4) {
    return "/default-flag.png";
  }

  try {
    // Ensure the phone number has a "+" prefix for proper parsing
    const formattedPhone = phoneNumber.startsWith('+') 
      ? phoneNumber 
      : `+${phoneNumber}`;
    
    // Parse the phone number
    const phoneNumberObj = parsePhoneNumberFromString(formattedPhone);
    
    if (phoneNumberObj && phoneNumberObj.country) {
      return `https://flagcdn.com/w40/${phoneNumberObj.country.toLowerCase()}.png`;
    }
  } catch (error) {
    console.error("Error parsing phone number:", error);
  }

  return "/default-flag.png";
};

/**
 * Format a phone number for display with proper country code
 */
const formatPhoneNumberForDisplay = (phoneNumber) => {
  if (!phoneNumber) return "-";
  
  try {
    // Ensure the phone number has a "+" prefix
    const formattedPhone = phoneNumber.startsWith('+') 
      ? phoneNumber 
      : `+${phoneNumber}`;
    
    const phoneNumberObj = parsePhoneNumberFromString(formattedPhone);
    
    if (phoneNumberObj) {
      return phoneNumberObj.formatInternational();
    }
    
    // If parsing fails, at least ensure it has a "+" for display
    return formattedPhone;
  } catch (error) {
    // If parsing fails completely, return the original with a "+" prefix
    return phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
  }
};

const Profile = () => {
  const { t } = useTranslation('dashboard');
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

  // Update local state if user changes
  useEffect(() => {
    if (user) {
      setUserInfo({
        fullName: user.name || "-",
        phoneNumber: user.phone || "",
        email: user.email || "-",
        dob: user.dob ? new Date(user.dob) : null,
      });
      setProfileImage(user.userDp || "/dummyProfile.png");
      
      // Update the initial ref as well
      initialUserInfo.current = {
        fullName: user.name || "-",
        phoneNumber: user.phone || "",
        email: user.email || "-",
        dob: user.dob ? new Date(user.dob) : null,
        userDp: user.userDp || "/dummyProfile.png",
      };
    }
  }, [user]);

  const handleEditToggle = (field) => {
    // Reset to original value if canceling edit
    if (isEditing[field]) {
      setUserInfo((prev) => ({ 
        ...prev, 
        [field]: initialUserInfo.current[field] 
      }));
    }
    
    // Toggle editing state
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleFieldChange = (e, field) => {
    const value = e.target.value;
    setUserInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setAlert({ 
          type: 'error', 
          message: t('profile.alerts.imageTooLarge', { maxSize: '5MB' }) 
        });
        return;
      }
      
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setProfileImageFile(file);
    }
  };

  const handleSave = async () => {
    if (!user?.id) {
      setAlert({ type: 'error', message: t('profile.alerts.missingUserId') });
      return;
    }

    const body = new FormData();
    body.append("name", userInfo.fullName || user?.name || "-");

    if (userInfo.dob) {
      body.append("dob", userInfo.dob.toISOString());
    }

    if (userInfo.phoneNumber) {
      // Ensure phone number is properly formatted for storage
      // If it doesn't start with +, add it
      const phoneToStore = userInfo.phoneNumber.startsWith('+') 
        ? userInfo.phoneNumber 
        : `+${userInfo.phoneNumber}`;
        
      body.append("phone", phoneToStore);
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
      });

      // Reset editing states
      setIsEditing({
        fullName: false,
        phoneNumber: false,
      });

      // Reset the profileImageFile and update the initial ref
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
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("user_token");
      localStorage.clear()
      await signOut({ redirect: false });
      router.push('/login');
    } catch (error) {
      console.error("Error during logout:", error);
      router.reload();
    }
  };

  // Compute if there are changes compared to the initial state
  const hasChanges = useMemo(() => {
    // Compare full name and phone number
    if (userInfo.fullName !== initialUserInfo.current.fullName) return true;
    if (userInfo.phoneNumber !== initialUserInfo.current.phoneNumber) return true;
    
    // Compare dates
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
            <button 
              className="float-right font-bold"
              onClick={() => setAlert({ type: "", message: "" })}
            >
              &times;
            </button>
          </div>
        )}
        <h2 className='text-[#0057A1] text-2xl font-semibold'>
          {t('profile.title')}
        </h2>
        <p className='text-gray-500 text-sm'>{t('profile.subtitle')}</p>

        <div className='space-y-6'>
          {/* Full Name */}
          <div className='flex justify-between items-center border-b pb-2'>
            <div className="w-full">
              <p className='text-gray-400 text-sm'>
                {t('profile.fields.fullName.label')}
              </p>
              <input
                type='text'
                value={userInfo.fullName}
                onChange={(e) => isEditing.fullName && handleFieldChange(e, 'fullName')}
                className={`rounded p-2 text-gray-800 w-full md:w-4/5 ${
                  isEditing.fullName 
                    ? 'border border-blue-300 bg-white' 
                    : 'border-none bg-transparent font-medium'
                }`}
                placeholder={t('profile.fields.fullName.placeholder')}
                disabled={!isEditing.fullName}
              />
            </div>
            <span
              className='text-[#0057A1] text-sm cursor-pointer whitespace-nowrap'
              onClick={() => handleEditToggle('fullName')}
            >
              {isEditing.fullName
                ? t('profile.buttons.cancel')
                : t('profile.buttons.edit')}
            </span>
          </div>

          {/* Phone Number */}
          <div className='flex justify-between items-center border-b pb-2'>
            <div className="w-full">
              <p className='text-gray-400 text-sm'>
                {t('profile.fields.phoneNumber.label')}
              </p>
              <div className="relative">
                {/* Always show PhoneInput, but disable it when not editing */}
                <PhoneInput
                  country={'us'}
                  value={userInfo.phoneNumber}
                  onChange={(phone) => 
                    isEditing.phoneNumber && setUserInfo((prev) => ({ ...prev, phoneNumber: phone }))
                  }
                  inputStyle={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: isEditing.phoneNumber ? '1px solid #ccc' : 'none',
                    backgroundColor: isEditing.phoneNumber ? 'white' : 'transparent',
                    color: 'black',
                    paddingLeft: '50px',
                    pointerEvents: isEditing.phoneNumber ? 'auto' : 'none',
                    opacity: isEditing.phoneNumber ? '1' : '1',
                    fontWeight: isEditing.phoneNumber ? 'normal' : 'medium'
                  }}
                  containerStyle={{
                    opacity: isEditing.phoneNumber ? '1' : '0.99',
                  }}
                  buttonStyle={{
                    border: isEditing.phoneNumber ? '1px solid #ccc' : 'none',
                    backgroundColor: isEditing.phoneNumber ? 'white' : 'transparent',
                    pointerEvents: isEditing.phoneNumber ? 'auto' : 'none',
                  }}
                  placeholder={t('profile.fields.phoneNumber.placeholder')}
                  enableSearch={isEditing.phoneNumber}
                  searchPlaceholder={t('profile.fields.phoneNumber.searchPlaceholder')}
                  disabled={!isEditing.phoneNumber}
                  disableDropdown={!isEditing.phoneNumber}
                />
              </div>
            </div>
            <span
              className='text-[#0057A1] text-sm cursor-pointer whitespace-nowrap'
              onClick={() => handleEditToggle('phoneNumber')}
            >
              {isEditing.phoneNumber
                ? t('profile.buttons.cancel')
                : t('profile.buttons.edit')}
            </span>
          </div>

          {/* Email Address */}
          <div className='flex justify-between items-center border-b pb-2'>
            <div className="w-full">
              <p className='text-gray-400 text-sm'>
                {t('profile.fields.emailAddress.label')}
              </p>
              <input
                type='email'
                value={userInfo.email}
                className='rounded p-2 text-gray-800 w-full md:w-4/5 border-none bg-transparent font-medium'
                disabled={true}
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div className='flex justify-between items-center border-b pb-2 relative'>
            <div className="w-full">
              <p className='text-gray-400 text-sm'>
                {t('profile.fields.dateOfBirth.label')}
              </p>
              <div className="flex items-center">
                <input
                  type='text'
                  value={userInfo.dob 
                    ? userInfo.dob.toLocaleDateString(
                        navigator.language || 'en-US',
                        { year: 'numeric', month: '2-digit', day: '2-digit' }
                      ) 
                    : '-'
                  }
                  className='rounded p-2 text-gray-800 w-full md:w-4/5 border-none bg-transparent font-medium'
                  disabled={true}
                  readOnly={true}
                />
                <span
                  className='text-[#0057A1] text-lg cursor-pointer ml-2'
                  onClick={() => setShowCalendar(true)}
                >
                  <SlCalender />
                </span>
              </div>
            </div>
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
              ? `${t('profile.buttons.saving')}...`
              : t('profile.buttons.saveChanges')}
          </button>
          <button
            onClick={handleLogout}
            className='w-4/6 md:w-2/6 bg-[#0057A1] text-white font-semibold py-2 rounded hover:bg-blue-600'
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
            height={200}
            className='rounded-full object-cover'
          />
          <label
            htmlFor='profileImageDesktop'
            className='absolute bottom-2 right-2 bg-[#0057A1] text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-blue-600'
          >
            <span className="text-lg">+</span>
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

      {/* Mobile Profile Picture Section - Shown only on small screens */}
      <div className='flex md:hidden w-full flex-col items-center mt-6'>
        <h3 className='text-[#0057A1] text-lg font-semibold mb-4'>
          {t('profile.displayPicture')}
        </h3>
        <div className='relative'>
          <Image
            src={profileImage}
            alt='Profile Picture'
            width={120}
            height={120}
            className='rounded-full object-cover'
          />
          <label
            htmlFor='profileImageMobile'
            className='absolute bottom-1 right-1 bg-[#0057A1] text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer'
          >
            +
          </label>
          <input
            type='file'
            id='profileImageMobile'
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
          <div className='relative bg-white rounded-lg p-1'>
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