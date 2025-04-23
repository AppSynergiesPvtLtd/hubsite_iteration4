import Image from "next/image";
import React from "react";
import { motion } from 'framer-motion'
import {
  poppinsextrabold,
  poppinsregular,
  gradient,
  smScreen,
} from "./styles/StepTwo.module.css";
import { useTranslation } from 'next-i18next'

const StepFour = () => {
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
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
  };

  const imageHover = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.section
      className={`relative w-[100%] min-h-[550px] ${gradient} flex flex-col md:flex-row justify-center overflow-hidden`}
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <motion.div
        className='hidden w-[50%] md:flex justify-center items-center m-auto z-50 text-[#0057A1]'
        variants={itemVariants}
      >
        <div className='flex gap-0 md:gap-3 z-35 text-center w-fit'>
          <div className={`${poppinsextrabold} text-[36px] z-35`}></div>
          <div>
            <div
              className={`${poppinsextrabold} flex items-center gap-4 transition-all duration-300 hover:text-[#0057A1] hover:scale-105`}
            >
              <h2 className='text-[3rem]'>04</h2>

              <h2
                className={`${poppinsextrabold} text-[26px] lg:text-[36px] z-35`}
              >
                {t('stepFour.title')}
              </h2>
            </div>

            <p
              className={`${poppinsregular} w-[430px] leading-1 md:w-[430px] md:text-[24px] md:ml-16 z-35 text-start`}
            >
              {t('stepFour.description')}
            </p>
          </div>
        </div>
      </motion.div>

      <div className='md:block bg-white w-[120vw] h-[45rem] md:w-[70vw] rounded-[60px] top-[10rem] md:top-[10%] md:h-[45rem] absolute left-[-80px] md:left-[-300px] rotate-[120deg] md:rotate-[30deg] z-1'></div>

      <motion.div
        className='w-[50%] flex items-center z-35 mx-12 my-auto md:m-start'
        variants={itemVariants}
      >
        <div className='relative flex justify-start md:justify-center items-center w-full md:w-fit md:p-10'>
          <motion.div className='relative'>
            <div className='w-[45vw] h-[45vw] sm:w-[40vw] sm:h-[40vw] md:w-[190px] md:h-[190px] lg:w-[300px] lg:h-[300px] relative z-50 bg-white rounded-lg'>
              <Image
                src='/image_84.png'
                alt='Description of the image'
                layout='fill'
                objectFit='cover'
                className='border-white border-[10px] rounded-lg shadow-lg shadow-black transition-transform duration-300 hover:scale-105 hover:shadow-2xl'
              />
            </div>
          </motion.div>
          <motion.div className='p-3 rounded-lg z-1 absolute top-[20%] left-[60%]'>
            <div className='w-[46vw] h-[45vw] sm:w-[40vw] rounded-lg sm:h-[40vw] md:w-[190px] md:h-[190px] lg:w-[300px] lg:h-[300px] relative'>
              <Image
                src='/image_82.png'
                alt='Description of the image'
                layout='fill'
                objectFit='cover'
                className=' rounded-lg shadow-lg shadow-black transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:border-white focus:outline-none'
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className='flex md:hidden justify-start items-center md:m-auto z-50'
        variants={itemVariants}
      >
        <div
          className={`flex ms-2 w-[90vw] sm:w-fit gap-x-2 md:gap-3 text-[#0057A1] z-35 text-center ${smScreen}`}
        >
          <div className={`${poppinsextrabold} text-[26px] z-35 gap-0 mt-0`}>
            <h2 className='text-[3rem]'>04</h2>
          </div>
          <div className='flex flex-col gap-y-2 w-[60vw]'>
            <h2
              className={`${poppinsextrabold} mt-2 text-start text-[1.5rem] z-35 w-fit`}
            >
              {t('stepFour.title')}
            </h2>
            <p
              className={`${poppinsregular} leading-1 w-[55vw]  sm:w-[300px] md:w-[350px] z-35 text-[#0057A1] text-start`}
            >
              {t('stepFour.description')}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.section>
  )
};

export default StepFour