import React from 'react';
import Image from 'next/image'; // Import Image component from next/image
import { motion } from 'framer-motion'; // Import motion from framer-motion

const StepThree = () => {
  // Animation variants for scroll-triggered effects
  const containerVariants = {
    hidden: { opacity: 0, y: 50 }, // Start slightly offscreen and transparent
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeInOut',
        staggerChildren: 0.2, 
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeInOut' },
    },
  };

  const imageHover = {
    hover: {
      scale: 1.05, // Slightly enlarge on hover
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className="flex flex-col md:flex-row justify-center items-center gap-8  p-4 h-auto md:h-[485px]"
      initial="hidden"
      whileInView="visible" // Trigger animation when in view
      viewport={{ once: true, amount: 0.3 }} // Animation triggers when 30% of the component is visible
      variants={containerVariants}
    >
      {/* Left Section with Images */}
      <motion.div
        className="relative flex justify-center items-center w-full md:w-fit my-0 md:p-10"
        variants={itemVariants}
      >
        {/* First image: centered */}
        <motion.div
          className="relative right-[-35px] z-10"
          variants={imageHover}
          whileHover="hover"
        >
          <div className="w-[153px] h-[148px] md:w-[259.82px] md:h-[250.27px]">
            <Image
              src="/image_85.png"
              alt="Description of the image"
              layout="fill"
              objectFit="cover"
              className="shadow-lg shadow-black"
            />
          </div>
        </motion.div>

        {/* Second image */}
        <motion.div
          className="p-3 bg-gray-100 rounded-lg z-40"
          variants={imageHover}
          whileHover="hover"
        >
          <div className="w-[161px] h-[226px] md:w-[250px] md:h-[350px] relative">
            <Image
              src="/image_83.png"
              alt="Description of the image"
              layout="fill"
              objectFit="cover"
              className="shadow-lg shadow-black"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Right Section with Text */}
      <motion.div
        className="w-full md:w-[500px] md:ml-0"
        variants={itemVariants}
      >
        <div className="md:text-left flex justify-center">
          <motion.h1
            className="text-[35px] md:text-[55px] text-white font-bold flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            03
            <span className="text-[24px] md:text-[32px] ml-4 poppins-bold ">Increased Participation</span>
          </motion.h1>
        </div>
        <motion.div
          className="mt-4 md:ml-[75px] md:text-left"
          variants={itemVariants}
        >
          <p className="text-[18px] md:text-[26px] text-white ml-10 md:ml-0 w-auto px-4">
            Offering coins as rewards incentivizes users to take surveys, resulting in higher response rates.
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default StepThree;
