import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from 'next-i18next'

const StepThree = ({ navigate }) => {
  const { t } = useTranslation('onboarding')

  return (
    <section className='flex flex-col items-center gap-5 md:gap-7 min-h-[80vh] justify-center  p-4'>
      {/* Heading */}
      <motion.h2
        className='text-[#0057A1] poppins-bold text-[25px] md:text-[30px] text-center'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {t('step3.heading')}
      </motion.h2>

      {/* Paragraph */}
      <motion.p
        className='text-[#333] text-[20px] md:text-[26px] font-medium text-center w-[80%] md:w-[60%]'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {t('step3.paragraph')}
      </motion.p>

      {/* Link */}

      {/* Button */}
      <motion.button
        className='capitalize w-[267px] md:w-[569px] py-4 poppins-bold rounded-[35.4px] rounded-br-none bg-[#0057A1] text-white'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        whileHover={{ scale: 1.05, backgroundColor: '#004080' }}
        onClick={() => navigate(4)}
      >
        {t('step3.getStartedButton')}
      </motion.button>
    </section>
  )
};

export default StepThree