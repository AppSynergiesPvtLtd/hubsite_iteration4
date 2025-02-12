import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const StepOne = ({ navigate }) => {
  return (
    <section className="flex flex-col items-center gap-5 md:gap-7 min-h-[80vh] justify-center">
      <div className="w-[150px] h-[60px] md:w-[180px] md:h-[70px] relative">
        <Image
          src="/navbar_logo.png"
          alt="Hubsite Social Logo"
          layout="fill"
          objectFit="contain"
        />
      </div>
      <motion.div
        className="flex justify-center items-center flex-col gap-2 md:gap-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.h2
          className="text-[#0057A1] poppins-bold text-[25px] md:text-[35px] uppercase"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Almost There!
        </motion.h2>
        <p className="text-[20px] md:text-[30px] poppins-medium text-center w-[80%] md:w-fit">
          Your first 10 Hubcoins are waiting for you!
        </p>
      </motion.div>
      <motion.div
        className="w-[85vw] h-[80vw] sm:w-[60vw] sm:h-[60vw] md:w-[394px] md:h-[300px] relative z-50  p-4"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{ scale: 1.05 }}
      >
        <Image
          src="/Group.png"
          alt="Description of the image"
          layout="fill"
          objectFit="cover"
          className="p-5"
        />
      </motion.div>
      <motion.button
        className="capitalize w-[267px] md:w-[569px] py-4 poppins-bold rounded-[35.4px] rounded-br-none bg-[#0057A1] text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        whileHover={{ scale: 1.05, backgroundColor: "#004080" }}
        onClick={() => navigate(2)}
      >
        Get Started
      </motion.button>
    </section>
  );
};

export default StepOne;
