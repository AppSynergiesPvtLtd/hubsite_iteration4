import Image from "next/image";
import React from "react";
import { poppinsextrabold, poppinsregular, gradient, smScreen } from "./styles/StepTwo.module.css";
import { useTranslation } from 'next-i18next'

const StepTwo = () => {
    const { t } = useTranslation('common')

    return (
      <section
        className={`relative w-[100%] min-h-[550px] ${gradient} flex flex-col md:flex-row justify-center overflow-hidden`}
      >
        <div className='hidden w-[50%] md:flex justify-center items-center m-auto z-50'>
          <div className='flex gap-0 md:gap-3 text-white z-35 w-fit'>
            <div className={`${poppinsextrabold} text-[36px] z-35`}>
              <div className='flex items-center gap-4 transition-transform duration-300 hover:scale-105 '>
                <h2 className='text-[3rem]'>02</h2>
                <h2
                  className={`${poppinsextrabold} text-[26px] lg:text-[36px] z-35`}
                >
                  {t('stepTwo.title')}
                </h2>
              </div>

              <p
                className={`${poppinsregular} leading-1 md:w-[450px] z-35 text-[1.4rem] md:mt-5 md:ml-20`}
              >
                {t('stepTwo.description')}
              </p>
            </div>
          </div>
        </div>

        <div className='hidden md:block bg-white w-[400px] h-[100px] absolute left-[80px] md:left-[-120px] bottom-[-50px] rotate-[30deg]'></div>
        <div className='md:hidden bg-white w-[80vw] h-[200px] absolute top-[-100px] right-[-200px] md:left-[-120px] rotate-[45deg]'></div>
        <div className='md:hidden bg-white w-[80vw] h-[200px] absolute bottom-[-100px] left-[-200px] md:left-[-120px] rotate-[45deg]'></div>

        <div className='w-[50%] flex items-center z-35 mx-12 my-auto md:m-start'>
          <div className='relative flex justify-start md:justify-center items-center w-full md:w-fit md:p-10'>
            <div className='relative'>
              <div className='w-[45vw] h-[45vw] sm:w-[40vw] sm:h-[40vw] md:w-[190px] md:h-[190px] lg:w-[280px] lg:h-[280px] relative z-50 transition-transform duration-300 hover:scale-105 hover:shadow-2xl'>
                <Image
                  src='/image_80.jpg'
                  alt='Description of the image'
                  layout='fill'
                  objectFit='cover'
                  className='border-white border-[10px] rounded-lg shadow-lg shadow-black'
                />
              </div>

              <div className='p-3 rounded-lg z-1 absolute top-[20%] left-[60%] transition-transform duration-300 hover:scale-105 hover:shadow-2xl'>
                <div className='w-[46vw] h-[45vw] sm:w-[40vw] sm:h-[40vw] md:w-[190px] md:h-[190px] lg:w-[288px] lg:h-[280px] relative'>
                  <Image
                    src='/image_81.jpg'
                    alt='Description of the image'
                    layout='fill'
                    objectFit='cover'
                    className='border-white border-[10px] rounded-lg shadow-lg shadow-black'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='flex md:hidden justify-end items-center content-end md:m-auto z-50'>
          <div
            className={`flex w-[90vw] sm:w-fit gap-x-2 md:gap-3 text-white z-35 text-center ${smScreen}`}
          >
            <div className={`${poppinsextrabold} text-[26px] z-35 mt-0`}>
              <h2 className='text-[3rem]'>02</h2>
            </div>
            <div className='flex flex-col gap-y-2 w-[60vw]'>
              <h2
                className={`${poppinsextrabold} mt-2 text-[1.5rem] z-35 w-fit whitespace-nowrap`}
              >
                {t('stepTwo.title')}
              </h2>
              <p
                className={`${poppinsregular} leading-1 w-[250px] sm:w-[300px] md:w-[350px] z-35 text-white text-start`}
              >
                {t('stepTwo.description')}
              </p>
            </div>
          </div>
        </div>
      </section>
    )
};

export default StepTwo