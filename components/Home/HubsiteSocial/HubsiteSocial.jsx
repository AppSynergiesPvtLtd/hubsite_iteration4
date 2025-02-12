import React from 'react';
import { motion } from 'framer-motion';
import "./HubsiteSocial.module.css";
 

import { social_para, heading_social } from "./HubsiteSocial.module.css";
import Link from 'next/link';
import { features } from '@/constants/benifits.constants';
import Image from 'next/image';

const HubsiteSocial = () => {

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const buttonVariants = {
    hover: {
      scale: 1.1,
      backgroundColor: "#265987",
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    tap: { scale: 0.9 }
  };

  return (
    <motion.div
      className='flex justify-center flex-col m-auto w-auto flex-wrap pt-8 bg-gray-50 overflow-x-hidden px-2'
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h2
        className={`text-[40px] md:text-[52px] m-auto ${heading_social} leading-0`}
        variants={itemVariants}
      >
        What’s <span className={`text-[#FF7900] md:text-[#0057A1] w-[667px] ${heading_social}`}>Hubsite Social ?</span>
      </motion.h2>
      <motion.p
        className={`text-[14px] text-center m-auto ${social_para} w-[90%] md:w-[745px]`}
        variants={itemVariants}
      >
        Join Hubsite Social platform where your opinions matter! Earn coins for each completed survey and easily convert them into real money.
        Enjoy a seamless experience, tailored surveys, and the chance to share your insights while getting rewarded for your time.
        Start earning today!
      </motion.p>
      <motion.div
        className='flex justify-center flex-wrap gap-[43px]  w-[95%] m-auto mt-12'
        variants={containerVariants}
      >
        {features?.slice(0, 5).map((section, index) => (
          <motion.div
            key={index}
            className='bg-white rounded-lg ring ring-gray-100 ring-offset-0 w-[95%] min-h-[250px] md:w-[440px] md:h-[250px] p-5 flex flex-col justify-center text-center'
            variants={itemVariants}
            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
          >
            {/* <div className="mb-4">
                   <Image 
                     src={section.icon} 
                   
                     width={48} 
                     height={48} 
                     className="mx-auto" 
                   />
                   </div> */}
                  <div className='flex justify-center items-center mx-auto mb-4  rounded-full h-16 w-16 text-white bg-[#FF7900]'>
            {section.icon}
            </div>
            <p className='text-[20px] mb-4 text-black'>{section?.title}</p>
            <p className='text-black'>{section?.description}</p>
          </motion.div>
        ))}
      </motion.div>
      <Link href={"/features"} className='flex justify-center'>
      <motion.button
        className='font-medium py-3 mb-2 bg-[#0057A1] px-[50px] w-fit m-auto mt-12 text-md text-white rounded-lg hover:bg-[#265987] transition duration-300 z-20'
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        View All
      </motion.button>
      </Link>
    </motion.div>
  );
};

export default HubsiteSocial;
