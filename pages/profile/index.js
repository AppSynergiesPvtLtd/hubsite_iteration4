import React, { useState } from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";
import Icon4 from '../../public/verified.svg'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const UserProfile = () => {
  const { t } = useTranslation('common')
  const [profileImage, setProfileImage] = useState(null)
  const [userData, setUserData] = useState({
    fullName: 'Sam Jordan',
    phoneNumber: '4561397913',
    email: 'user@gmail.com',
    dateOfBirth: '2001-10-13',
  })
  const [editingField, setEditingField] = useState(null)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImage(URL.createObjectURL(file))
    }
  }

  const handleFieldChange = (e) => {
    const { name, value } = e.target
    setUserData({ ...userData, [name]: value })
  }

  const getTranslatedDate = (dateString) => {
    const date = new Date(dateString)
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return date.toLocaleDateString(undefined, options) // Uses the current locale
  }

  return (
    <div className='poppins flex flex-wrap justify-center items-center min-h-screen bg-gray-100 p-4'>
      <div className='flex bg-white shadow-lg rounded-lg '>
        <div className='w-2/3 p-8'>
          {/* Full Name */}
          <div className='flex justify-between items-center mb-6'>
            <div>
              <h2 className='text-[18px] text-gray-700 '>
                {t('profile.fullName')}
              </h2>
              {editingField === 'fullName' ? (
                <input
                  type='text'
                  name='fullName'
                  value={userData.fullName}
                  onChange={handleFieldChange}
                  className='w-full border rounded p-2 mt-1'
                />
              ) : (
                <p className='text-gray-800 mt-1'>{userData.fullName}</p>
              )}
            </div>
            <button
              onClick={() =>
                setEditingField(editingField === 'fullName' ? null : 'fullName')
              }
              className='text-blue-600 font-medium hover:underline'
            >
              {editingField === 'fullName'
                ? t('profile.set')
                : t('profile.edit')}
            </button>
          </div>
          <hr className='mb-6' />

          <div className='flex justify-between items-center mb-6'>
            <div>
              <h2 className=' text-gray-700 text-[18px]'>
                {t('profile.phoneNumber')}
              </h2>
              {editingField === 'phoneNumber' ? (
                <input
                  type='text'
                  name='phoneNumber'
                  value={userData.phoneNumber}
                  onChange={handleFieldChange}
                  className='w-full border rounded p-2 mt-1'
                />
              ) : (
                <div className='flex items-center mt-1'>
                  <span className='mr-2'>🇮🇳</span>
                  <p className='text-gray-800'>{userData.phoneNumber}</p>
                </div>
              )}
            </div>
            <button
              onClick={() =>
                setEditingField(
                  editingField === 'phoneNumber' ? null : 'phoneNumber'
                )
              }
              className='text-[#0057A1] font-medium hover:underline'
            >
              {editingField === 'phoneNumber'
                ? t('profile.set')
                : t('profile.edit')}
            </button>
          </div>
          <hr className='mb-6' />

          <div className='flex justify-between items-center mb-6'>
            <div>
              <h2 className='text-[18px] text-gray-700 '>
                {t('profile.emailAddress')}
              </h2>
              <p className='text-gray-800 mt-1'>{userData.email}</p>
            </div>
            <span className='text-green-500 text-2xl font-semibold'>
              <Icon4 />
            </span>
          </div>
          <hr className='mb-6' />

          <div className='flex justify-between items-center mb-8'>
            <div>
              <h2 className='text-sm text-gray-700 '>
                {t('profile.dateOfBirth')}
              </h2>
              {editingField === 'dateOfBirth' ? (
                <input
                  type='date'
                  name='dateOfBirth'
                  value={userData.dateOfBirth}
                  onChange={handleFieldChange}
                  className='w-full border rounded p-2 mt-1'
                />
              ) : (
                <p className='text-gray-800 mt-1'>
                  {getTranslatedDate(userData.dateOfBirth)}
                </p>
              )}
            </div>
            <button
              onClick={() =>
                setEditingField(
                  editingField === 'dateOfBirth' ? null : 'dateOfBirth'
                )
              }
              className='text-gray-500 text-lg cursor-pointer'
            >
              📅
            </button>
          </div>

          {/* Save and Logout */}
          <div className='flex  justify-center m-auto w-fit gap-5 flex-col'>
            <button className='w-[200px] bg-[#0057A1] text-white py-2 rounded-lg hover:bg-[#0056a1ed]'>
              {t('profile.save')}
            </button>
            <button className='w-[200px] bg-[#0057A1] text-white py-2 rounded-lg hover:bg-[#0056a1ed]'>
              {t('profile.logout')}
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className='w-1/3 flex flex-col items-center justify-center p-6 bg-gray-50'>
          <h3 className='text-blue-600 font-semibold mb-4'>
            {t('profile.displayPicture')}
          </h3>
          <div className='relative'>
            <img
              src={profileImage || 'https://via.placeholder.com/120'}
              alt='Profile'
              className='w-32 h-32 rounded-full object-cover shadow-md'
            />
            <label
              htmlFor='imageUpload'
              className='absolute bottom-1 right-1 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer'
            >
              +
            </label>
            <input
              id='imageUpload'
              type='file'
              accept='image/*'
              onChange={handleImageUpload}
              className='hidden'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

export default UserProfile;
