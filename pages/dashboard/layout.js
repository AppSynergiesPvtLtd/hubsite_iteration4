import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from 'next-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { signOut } from 'next-auth/react'
import { LayoutDashboard, ClipboardList, Award } from 'lucide-react'
import Spinner from '@/components/Spinner'
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const Layout = ({ children }) => {
  const { t } = useTranslation('dashboard')
  const dispatch = useDispatch()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const router = useRouter()
  const dropdownRef = useRef(null)
  const user = useSelector((state) => state.user.user)
  const [isHovered, setIsHovered] = useState(false)

  // Redirect to "/" if user is not available
  useEffect(() => {
    if (!user) {
      router.push('/')
    }
  }, [user, router])

  if (!user) {
    return <Spinner />
  }

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev)
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev)

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const sidebarItems = [
    {
      name: 'dashboard',
      label: t('layout.sidebar.dashboard'),
      path: '/dashboard',
      icon: <LayoutDashboard size={20} className='mr-2' />,
    },
    {
      name: 'survey',
      label: t('layout.sidebar.surveys'),
      path: '/dashboard/survey',
      icon: <ClipboardList size={20} className='mr-2' />,
    },
    {
      name: 'rewards',
      label: t('layout.sidebar.rewards'),
      path: '/dashboard/rewards',
      icon: <Award size={20} className='mr-2' />,
    },
  ]

  // Function to get the page title based on the current route
  const getPageTitle = () => {
    // Try to match the current route with a sidebar item
    const currentItem = sidebarItems.find(
      (item) => item.path === router.pathname
    )
    if (currentItem) {
      return currentItem.label
    }
    // Additional routes can be added here
    if (router.pathname === '/dashboard/profile') {
      return t('layout.pageTitle.profile')
    }
    // Fallback: format the last segment of the path
    const pathSegments = router.pathname.split('layout./').filter(Boolean)
    if (pathSegments.length > 0) {
      const lastSegment = pathSegments[pathSegments.length - 1]
      return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
    }
    return t('layout.pageTitle.dashboard')
  }

  const handleLogout = async () => {
    localStorage.removeItem('user_token')
    localStorage.clear()
    sessionStorage.clear()
    await signOut({ callbackUrl: '/' })
  }

  return (
    <div className='poppins flex'>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out bg-gray-50 w-[250px] h-screen md:relative border-r`}
      >
        <div className='p-5 flex flex-col justify-between h-full'>
          <div>
            <div className='flex justify-between items-center mb-6'>
              <a href={'/'}>
                <Image
                  src='/navbar_logo.png'
                  alt='Logo'
                  width={120}
                  height={24}
                />
              </a>
              <button
                onClick={toggleSidebar}
                className='text-2xl md:hidden focus:outline-none'
              >
                ✕
              </button>
            </div>
            <ul className='space-y-4'>
              {sidebarItems.map((item) => (
                <li
                  key={item.name}
                  className={`flex rounded-lg p-2 items-center cursor-pointer ${
                    router.pathname === item.path
                      ? 'text-white bg-[#0057A1]'
                      : 'text-gray-700 hover:text-[#0057A1]'
                  }`}
                  onClick={() => router.push(item.path)}
                >
                  {item.icon}
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className='flex-1'>
        <div className='bg-[#0057A1] text-white p-3 flex justify-between items-center'>
          <button
            onClick={toggleSidebar}
            className='text-2xl md:hidden focus:outline-none'
          >
            ☰
          </button>
          <h1 className='text-[24px] font-semibold capitalize'>
            {getPageTitle()}
          </h1>
          <div className='flex gap-2 md:gap-5 relative items-center'>
            <div className='relative group inline-block'>
              <div
                className='w-12 h-12 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold text-lg transition-transform duration-300 hover:scale-110 hover:shadow-xl cursor-pointer'
                aria-label={`${user?.hubCoins} Hubcoins`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {user?.hubCoins >= 1000
                  ? `${(user?.hubCoins / 1000).toFixed(1).replace('.0', '')}K`
                  : user?.hubCoins}
              </div>

              {/* Floating tooltip */}
              {isHovered && (
                <div className='absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap'>
                  {t('layout.hubcoins.tooltip', { count: user?.hubCoins })}
                </div>
              )}
            </div>

            <div className='relative' ref={dropdownRef}>
              <Image
                className='w-12 h-12 cursor-pointer rounded-full'
                src={user.userDp || '/dummyProfile.png'}
                alt='Account Image'
                width={48}
                height={48}
                onClick={toggleDropdown}
              />
              {isDropdownOpen && (
                <div className='absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50'>
                  <ul className='py-2'>
                    <li className='px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer max-w-xs break-words'>
                      {user.email}
                    </li>
                    <li className='text-gray-700 hover:bg-gray-100 cursor-pointer w-full'>
                      <div
                        className='w-full px-4'
                        onClick={() => router.push('/dashboard/profile')}
                      >
                        {t('layout.profile.editProfile')}
                      </div>
                    </li>
                    <li
                      className='px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer'
                      onClick={handleLogout}
                    >
                      <button>{t('layout.profile.logout')}</button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='mt-6'>{children}</div>
      </div>
    </div>
  )
}

export default Layout