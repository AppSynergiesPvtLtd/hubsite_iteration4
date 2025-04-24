import React, { useState } from 'react';
import Link from 'next/link';
import { FaLocationDot } from "react-icons/fa6";
import { MdOutlineMail } from "react-icons/md";
import { FaLinkedin, FaPhoneAlt } from "react-icons/fa";
import { FaThreads } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaMeta } from "react-icons/fa6";
import { FaXTwitter } from 'react-icons/fa6'
import Image from 'next/image';
import { useRouter } from 'next/router';
import Modal from '../UI/Modal';
import ForgotPassword from '../Auth/ForgotPassword';
import SignUp from '../Auth/SignUp';
import Login from '../Auth/Login';
import { useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next'

const Footer = () => {
  const { t } = useTranslation('common')
  const user = useSelector((state) => state.user.user)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { modal } = router.query

  let ModalContent
  switch (modal) {
    case 'forgotPassword':
      ModalContent = <ForgotPassword onSwitchTab={(tab) => openModal(tab)} />
      break
    case 'signUp':
      ModalContent = <SignUp onSwitchTab={(tab) => openModal(tab)} />
      break
    default:
      ModalContent = <Login onSwitchTab={(tab) => openModal(tab)} />
      break
  }

  const openModal = (type) => {
    setIsOpen(true)
    router.push(
      {
        query: { modal: 'login' },
      },
      undefined
    )
  }

  const closeModal = () => {
    setIsOpen(false)
    router.push(router.pathname, undefined, { shallow: true })
  }

  return (
    <div className='bg-[#0057A1] text-white mt-12 py-10'>
      <div className='flex flex-col lg:flex-row justify-center items-start lg:justify-between lg:gap-12 px-4 '>
        <div className='flex flex-col items-start md:items-center w-full lg:w-1/3 mb-8 lg:mb-0'>
          <div className='w-[100px] h-[80px] md:w-[159.82px] md:h-[70.27px] bg-white relative rounded-lg z-1'>
            <Image
              src='/footerImg.png'
              alt='Description of the image'
              layout='fill'
              objectFit='contain'
            />
          </div>
          <p className='text-[18px] mt-4 text-center'>
            {t('footer.ready_to_start')}
          </p>
          <>
            {user ? null : (
              <button
                onClick={() => {
                  router.push(
                    {
                      query: { modal: 'login' },
                    },
                    undefined
                  )
                }}
                className=' rounded-full text-[#0057A1] bg-white px-12 font-bold py-2 mt-4 hover:bg-gray-100'
              >
                {t('footer.login_button')}
              </button>
            )}
          </>
          <ul className='flex flex-col md:flex-row flex-wrap justify-center gap-4 mt-6 text-start text-sm'>
            <li>
              <Link href='/termsofuse'>{t('footer.terms_conditions')}</Link>
            </li>
            <li>
              <Link href='/privacypolicy'>{t('footer.privacy_policy')}</Link>
            </li>
            <li>
              <Link href='/rewardpolicy'>{t('footer.reward_policy')}</Link>
            </li>
          </ul>
        </div>
        <div className='flex justify-center flex-wrap gap-4 md:gap-24 w-full lg:w-2/3'>
          <ul className='w-full flex flex-col items-start lg:w-auto leading-[40px] text-center lg:text-left'>
            <h2 className='font-bold text-xl'>{t('footer.company')}</h2>
            <li>
              <Link href='/about'>{t('footer.about_us')}</Link>
            </li>
            <li>
              <Link href='/features'>{t('footer.key_benefits')}</Link>
            </li>
            <li>
              <Link href='/works'>{t('footer.how_it_works')}</Link>
            </li>
          </ul>
          <ul className='w-full lg:w-auto leading-[40px] items-start lg:text-left'>
            <h2 className='font-bold text-xl'>{t('footer.help')}</h2>
            <li>
              <Link href='/faq'>{t('footer.faqs')}</Link>
            </li>
            <li>
              <Link href='/contact-us'>{t('footer.contact_us')}</Link>
            </li>
          </ul>
          <ul className='w-full lg:w-auto leading-[40px] items-start lg:text-left'>
            <h2 className='font-bold text-xl'>{t('footer.contact')}</h2>
            <li className='flex gap-2 items-center justify-start lg:justify-start'>
              <FaPhoneAlt />
              {t('footer.phone')}
            </li>
            <li className='flex gap-2 items-center justify-start lg:justify-start'>
              <MdOutlineMail />
              <a href='mailto:hello@hubsitesocial.com'>{t('footer.email')}</a>
            </li>
            <li className='flex gap-2 items-center justify-start lg:justify-start'>
              <FaLocationDot />
              {t('footer.address')}
            </li>
            <div className='flex gap-6 mt-8 justify-center items-start lg:justify-start'>
              <a
                href='https://www.linkedin.com/company/hubsitesocial/'
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaLinkedin className='text-[24px]' />
              </a>
              <a
                href='https://www.instagram.com/hubsitesocial/'
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaInstagram className='text-[24px]' />
              </a>
              <a
                href='https://www.facebook.com/share/1FGtL2pkX7/'
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaMeta className='text-[24px]' />
              </a>
              <a
                href='https://x.com/hubsitesocial?t=0qqC_VhDcmVExHAYTMbgxg&s=08'
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaXTwitter className='text-[24px]' />
              </a>
            </div>
          </ul>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal}>
        {ModalContent}
      </Modal>
    </div>
  )
}

export default Footer