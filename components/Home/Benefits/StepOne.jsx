import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  poppinsextrabold,
  poppinsregular,
  gradient,
  smScreen,
} from "./styles/StepTwo.module.css";
import { useTranslation } from 'next-i18next'

const StepOne = () => {
  const { t } = useTranslation('common')

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeInOut',
        staggerChildren: 0.3,
      },
    },
  };

  return (
    <motion.div
      className='flex flex-wrap flex-col md:flex-row justify-center items-center gap-8 w-[92%]  p-4 m-auto h-auto'
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className='relative flex justify-center items-center w-[95%] md:w-auto my-0 md:p-6'>
        <div className='flex justify-center'>
          <div className='w-[140px] h-[148px] sm:w-[220px] sm:h-[220px] md:w-[259.82px] md:h-[250.27px] relative sm:right-[-25px] md:right-0 z-10 transition-transform duration-300 hover:scale-105 hover:shadow-lg'>
            <Image
              src='/HubsiteSocial2.png'
              alt='Description of the image'
              layout='fill'
              objectFit='cover'
            />
          </div>
        </div>

        <div className='p-3 bg-gray-100 rounded-lg z-20 transition-transform duration-300 hover:scale-105 hover:shadow-lg'>
          <div className='w-[140px] h-[226px] sm:w-[230px] sm:h-[280px] md:w-[300px] md:h-[400px] relative'>
            <Image
              src='/hubsiteSocial.jpeg'
              alt='Description of the image'
              layout='fill'
              objectFit='cover'
            />
          </div>
        </div>
      </div>

      <div className='w-full sm:w-[400px] md:w-[500px] mt-4 ml-8lag md:mt-0'>
        <div className='text-center md:text-left'>
          <h1 className='poppins-bold text-[35px] md:text-[45px] text-[#0057A1] font-bold flex justify-start md:justify-start items-center transition-all duration-300 hover:text-[#0057A1] hover:scale-105'>
            01
            <span className='poppins-bold text-[24px] md:text-[40px] ml-4'>
              {t('stepOne.title')}
            </span>
          </h1>
        </div>

        <div className='mt-4 md:mt-1 sm:text-left'>
          <p
            className={`${poppinsextrabold}text-[18px] sm:text-[20px] md:ml-20 md:text-[24px] text-[#0057A1] px-4 sm:px-0`}
          >
            {t('stepOne.description')}
          </p>
        </div>
      </div>
    </motion.div>
  )
};

export default StepOne