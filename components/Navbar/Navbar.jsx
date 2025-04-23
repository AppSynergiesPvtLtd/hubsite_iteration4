'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { useSelector, useDispatch } from 'react-redux'
import { clearUser } from '@/store/userSlice'
import Modal from '@/components/UI/Modal'
import Login from '@/components/Auth/Login'
import styles from './navbar.module.css'
import { X, Menu } from 'lucide-react'
import { useRouter } from 'next/router'
import SignUp from '@/components/Auth/SignUp'
import ForgotPassword from '@/components/Auth/ForgotPassword'
import { signOut } from 'next-auth/react'

export default function Navbar() {
  const { t } = useTranslation('common')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)

  const userDropdownRef = useRef(null)
  const languageDropdownRef = useRef(null)

  const router = useRouter()
  const { modal } = router.query
  const { pathname, asPath, query } = router

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'th', name: 'Thai' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'nl', name: 'Dutch' },
    { code: 'no', name: 'Norwegian' },
    { code: 'ar', name: 'Arabic' },
  ]

  const user = useSelector((state) => state.user.user)
  const dispatch = useDispatch()

  // Once the component is mounted, setIsMounted -> true
  useEffect(() => {
    // dispatch(clearUser())
    setIsMounted(true)
  }, [])

  // If modal query exists on page load, open the modal
  useEffect(() => {
    if (modal) {
      setIsOpen(true)
    }
  }, [modal])

  // Close dropdowns if click outside them
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setUserDropdownOpen(false)
      }
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target)
      ) {
        setLanguageDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    dispatch(clearUser())
    localStorage.removeItem('user_token')
    sessionStorage.clear()
    setUserDropdownOpen(false)
    await signOut({ redirect: false })
  }

  const closeModal = () => {
    setIsOpen(false)
    router.push(router.pathname, undefined, { shallow: true })
  }

  const openModal = (type) => {
    setIsOpen(true)
    router.push(
      { pathname: router.pathname, query: { modal: type } },
      undefined,
      { shallow: true }
    )
  }

  const languageSelect = (lang) => {
    localStorage.setItem('preferredLanguage', lang)
    setLanguageDropdownOpen(false)
  }

  const isActiveLink = (path) => router.pathname === path

  if (!isMounted) {
    // While isMounted is false, just render a simplified navbar
    return (
      <nav className='sticky top-0 z-50 w-full bg-white border-b border-gray-200'>
        <div className='max-w-[1400px] mx-auto px-6 h-16 flex items-center'>
          <Link href='/'>
            <Image
              src='/navbar_logo.png'
              alt='HubSite Social Logo'
              width={150}
              height={40}
              priority
            />
          </Link>
        </div>
      </nav>
    )
  }

  let ModalContent
  switch (modal) {
    case 'forgotpassword':
      ModalContent = <ForgotPassword onSwitchTab={(tab) => openModal(tab)} />
      break
    case 'signUp':
      ModalContent = <SignUp onSwitchTab={(tab) => openModal(tab)} />
      break
    default:
      // Default to login if ?modal=login or anything unrecognized
      ModalContent = <Login onSwitchTab={(tab) => openModal(tab)} />
      break
  }

  return (
    <nav className='sticky top-0 z-[9999999999999999] bg-white border-b border-gray-200'>
      <div className='max-w-[1400px] mx-auto px-6'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <Link href='/' className='flex-shrink-0'>
            <Image
              src='/navbar_logo.png'
              alt='HubSite Social Logo'
              width={150}
              height={40}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex md:items-center md:justify-end md:flex-1 space-x-6'>
            <div className='flex items-center space-x-6'>
              <Link
                href='/about'
                className={`${styles.navLink} ${
                  isActiveLink('/about') ? styles.activeNavLink : ''
                }`}
              >
                {t('navbar.about')}
              </Link>
              <Link
                href='/features'
                className={`${styles.navLink} ${
                  isActiveLink('/features') ? styles.activeNavLink : ''
                }`}
              >
                {t('navbar.features')}
              </Link>
              <Link
                href='/works'
                className={`${styles.navLink} ${
                  isActiveLink('/works') ? styles.activeNavLink : ''
                }`}
              >
                {t('navbar.works')}
              </Link>
              <Link
                href='/contact-us'
                className={`${styles.navLink} ${
                  isActiveLink('/contact-us') ? styles.activeNavLink : ''
                }`}
              >
                {t('navbar.contact')}
              </Link>
              <Link
                href='/faq'
                className={`${styles.navLink} ${
                  isActiveLink('/faq') ? styles.activeNavLink : ''
                }`}
              >
                {t('navbar.faq')}
              </Link>
            </div>

            {/* User Profile / Login */}
            <div ref={userDropdownRef} className='relative'>
              {user ? (
                <div
                  className='relative flex items-center space-x-2 cursor-pointer'
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  <Image
                    src={user.userDp || '/dummyProfile.png'}
                    alt='User Avatar'
                    width={32}
                    height={32}
                    className='rounded-full'
                  />
                  {userDropdownOpen && (
                    <div className='absolute right-0 top-[30px] w-65 overflow-hidden bg-white border border-gray-200 rounded-md shadow-lg z-50'>
                      <div className='px-4 py-2 text-sm text-gray-700'>
                        <p>{user.email || 'user@example.com'}</p>
                      </div>
                      <Link
                        href='/dashboard'
                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                      >
                        {t('navbar.dashboard')}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                      >
                        {t('navbar.logout')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => openModal('login')}
                  className='bg-[#0066b2] text-white px-6 py-2 rounded-md hover:bg-[#005291]'
                >
                  {t('navbar.login')}
                </button>
              )}
            </div>

            {/* Language Dropdown */}
            <div ref={languageDropdownRef} className='relative'>
              <Image
                src='/Language.png'
                alt='Language Selector'
                width={23}
                height={23}
                className='cursor-pointer md:ml-5'
                onClick={() =>
                  setLanguageDropdownOpen((prevState) => !prevState)
                }
              />
              {languageDropdownOpen && (
                <div className='absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50'>
                  {languages.map((lang) => (
                    <Link
                      href={{ pathname, query }}
                      as={asPath}
                      locale={lang.code}
                      key={lang.code}
                      onClick={() => languageSelect(lang.code)}
                      className='block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100'
                    >
                      {lang.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className='md:hidden'>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='inline-flex items-center justify-center p-2 text-gray-700'
            >
              <Menu className='w-6 h-6' />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className='fixed inset-y-0 right-0 z-50 w-2/4 bg-white shadow-lg md:hidden poppins-semibolds '>
          <div className='flex flex-col h-full'>
            <div className='flex items-center justify-between p-4'>
              <Link href='/' onClick={() => setMobileMenuOpen(false)}>
                <Image
                  src='/navbar_logo.png'
                  alt='HubSite Social Logo'
                  width={120}
                  height={32}
                  priority
                />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className='p-2 text-gray-700'
              >
                <X className='w-6 h-6' />
              </button>
            </div>

            <div className='flex flex-col items-center flex-1 px-4 space-y-6'>
              <Link
                href='/about'
                onClick={() => setMobileMenuOpen(false)}
                className={`${styles.mobileNavLink} ${
                  isActiveLink('/about') ? styles.activeNavLink : ''
                }`}
              >
                {t('navbar.about')}
              </Link>
              <Link
                href='/features'
                onClick={() => setMobileMenuOpen(false)}
                className={`${styles.mobileNavLink} ${
                  isActiveLink('/features') ? styles.activeNavLink : ''
                }`}
              >
                {t('navbar.features')}
              </Link>
              <Link
                href='/works'
                onClick={() => setMobileMenuOpen(false)}
                className={`${styles.mobileNavLink} ${
                  isActiveLink('/works') ? styles.activeNavLink : ''
                }`}
              >
                {t('navbar.works')}
              </Link>
              <Link
                href='/contact-us'
                onClick={() => setMobileMenuOpen(false)}
                className={`${styles.mobileNavLink} ${
                  isActiveLink('/contact-us') ? styles.activeNavLink : ''
                }`}
              >
                {t('navbar.contact')}
              </Link>
              <Link
                href='/faq'
                onClick={() => setMobileMenuOpen(false)}
                className={`${styles.mobileNavLink} ${
                  isActiveLink('/faq') ? styles.activeNavLink : ''
                }`}
              >
                {t('navbar.faq')}
              </Link>
              {user ? (
                <Link
                  href='/dashboard'
                  onClick={() => setMobileMenuOpen(false)}
                  className='bg-[#0066b2] text-white px-12 py-2 rounded-full hover:bg-[#005291]'
                >
                  {t('navbar.dashboard')}
                </Link>
              ) : (
                <button
                  onClick={() => openModal('login')}
                  className='bg-[#0066b2] text-white px-12 py-2 rounded-full hover:bg-[#005291]'
                >
                  {t('navbar.login')}
                </button>
              )}

              <div className='relative'>
                <button
                  onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                  className='flex items-center space-x-2'
                >
                  <Image
                    src='/Language.png'
                    alt='Language Selector'
                    width={23}
                    height={23}
                  />
                </button>
                {languageDropdownOpen && (
                  <div className='absolute mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg'>
                    {languages.map((lang) => (
                      <Link
                        href={{ pathname, query }}
                        as={asPath}
                        locale={lang.code}
                        key={lang.code}
                        onClick={() => languageSelect(lang.code)}
                        className='block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100'
                      >
                        {lang.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Login/SignUp/Forgot Password */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        {ModalContent}
      </Modal>
    </nav>
  )
}
