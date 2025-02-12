import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 w-full max-w-sm mx-auto text-center shadow-md transition-transform transform m-3"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
     <div className='flex justify-center items-center mx-auto mb-4  rounded-full h-16 w-16 text-white bg-[#FF7900]'>
            {icon}
            </div>
      <h3 className="text-lg sm:text-xl font-semibold text-[#0057A1] mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

export default FeatureCard;
