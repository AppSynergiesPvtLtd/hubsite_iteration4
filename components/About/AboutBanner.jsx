import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next'

const AboutBanner = () => {
  const { t } = useTranslation('about')

  const aboutData = {
    title: t('title'),
    subtitle: t('subtitle'),
    bannerImage: '/Aboutbanner.png',
    whatIsHubsite: {
      heading: t('whatIsHubsite.heading'),
      description: t('whatIsHubsite.description'),
    },
    whyHubsitian: {
      heading: t('whyHubsitian.heading'),
      points: [
        t('whyHubsitian.points.0'),
        t('whyHubsitian.points.1'),
        t('whyHubsitian.points.2'),
        t('whyHubsitian.points.3'),
        t('whyHubsitian.points.4'),
        t('whyHubsitian.points.5'),
      ],
      closingNote: t('whyHubsitian.closingNote'),
    },
  }

  return (
    <div className='bg-gray-50 px-5'>
      <div className='flex justify-center flex-col items-center p-2'>
        <motion.h2
          className='text-3xl mt-2 md:mt-0 md:text-4xl lg:text-5xl font-bold text-center sm:text-center md:text-left'
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {aboutData.title.split(' ')[0]}
          <span className='text-[#0057A1]'>
            {' '}
            {aboutData.title.split(' ')[1]} {aboutData.title.split(' ')[2]}
          </span>
        </motion.h2>
        <motion.p
          className='text-md md:text-2xl text-[#757575] text-center sm:text-center md:text-left font-semibold mt-4 max-w-4xl poppins-extrabold'
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {aboutData.subtitle}
        </motion.p>

        <motion.div
          className='mt-12 w-full'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Image
            src={aboutData.bannerImage}
            alt='Hubsite Social'
            width={1920}
            height={520}
            className='w-full h-auto md:h-[520px] object-contain'
          />
        </motion.div>

        <motion.div
          className='flex flex-col md:flex-row justify-center items-start gap-[100px] mt-12 w-full max-w-screen-xl'
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className='w-full md:w-[35%]'>
            <h2 className='text-2xl md:text-4xl  sm:text-center md:text-left poppins-semibold leading-[55px]'>
              {aboutData.whatIsHubsite.heading}
            </h2>
          </div>
          <div className='w-full md:w-[60%]'>
            <p className='text-md md:text-lg poppins-medium -mt-20 text-[#636363] md:mt-0'>
              {aboutData.whatIsHubsite.description}
            </p>
          </div>
        </motion.div>

        <motion.div
          className='flex flex-col items-center mt-12'
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2 className='text-2xl md:text-4xl text-center sm:text-center md:text-left poppins-bold'>
            {aboutData.whyHubsitian.heading.split(' ')[0]}{' '}
            <span className='text-[#0057A1]'>
              {aboutData.whyHubsitian.heading.split(' ')[4]}
            </span>
          </h2>
          <ol className='list-decimal text-md md:text-xl text-[#636363] mt-6 w-full md:w-4/5 poppins-medium'>
            {aboutData.whyHubsitian.points.map((point, index) => (
              <motion.li key={index} className='mb-7'>
                {point}
              </motion.li>
            ))}
          </ol>
          <motion.p
            className='text-lg md:text-xl mt-6 text-[#636363] md:w-[80%]'
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.2 }}
          >
            {aboutData.whyHubsitian.closingNote}
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}

export default AboutBanner