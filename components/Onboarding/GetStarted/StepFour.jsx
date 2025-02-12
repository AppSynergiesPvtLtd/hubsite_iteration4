import React from "react";
import { motion } from "framer-motion";

const StepFour = ({ navigate }) => {
  return (
    <section className="flex flex-col items-center gap-5 md:gap-7 min-h-[80vh] justify-center  p-4">
      {/* Heading */}
      <motion.h2
        className="text-[#0057A1] poppins-bold text-[28px] md:text-[35px] text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Why do we ask these questions?
      </motion.h2>

      {/* Paragraph */}
      <motion.div
        className="text-[#333] text-[16px] md:text-[20px] font-medium text-center w-[90%] md:w-[60%] leading-7 md:leading-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <p>
          This is so we can bring you relevant surveys. It means students won’t
          be asked what it’s like being a teacher or someone in Stockholm isn’t
          asked about public transport in New York.
        </p>
        <p className="mt-4">
          Bear in mind, we can only find you surveys once you have answered
          these questions. And you will also get <b>30 HUBCOINS</b>.
        </p>
      </motion.div>

      {/* Button */}
      <motion.button
        className="capitalize w-[267px] md:w-[569px] py-4 poppins-bold rounded-[35.4px] rounded-br-none bg-[#0057A1] text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        whileHover={{ scale: 1.05, backgroundColor: "#004080" }}
        onClick={() => navigate(5)} // Looping back to StepOne (or handle end behavior)
      >
        Ok, let's continue
      </motion.button>
    </section>
  );
};

export default StepFour;
