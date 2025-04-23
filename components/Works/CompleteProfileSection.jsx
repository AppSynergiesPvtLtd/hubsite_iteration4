import React from "react";
import Image from "next/image";
import { useTranslation } from 'react-i18next'

const CompleteProfileSection = () => {
  const { t } = useTranslation('works')
  return (
    <div className='flex flex-col md:gap-x-[60px] lg:flex-row items-center justify-center p-6 bg-gray-100'>
      <div className='text-center lg:text-left max-w-md lg:max-w-lg'>
        <h2 className='text-2xl lg:text-3xl font-bold text-[#303F9E] mb-4'>
          {t('profile.heading')}
        </h2>
        <p className='text-[#001627]'>{t('profile.description')}</p>
      </div>

      <div className=''>
        <div className=''>
          <div className='flex items-center space-x-4 mb-4'>
            <Image
              src='/CompleteProfileSection.png'
              alt={t('profile.img')}
              width={350}
              height={350}
              className='md:h-[350px]'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompleteProfileSection;
