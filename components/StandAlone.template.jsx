"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

const SurveySuccess = ({
  heading = "Survey Successfully Finished",
  message = "Awesome! Your responses have been submitted.\nThanks for sharing your thoughts!"
}) => {
  const router = useRouter()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      <motion.div
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
      >
        <Image src="/background.png" alt="Survey Background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative text-center text-white flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 gap-8 sm:gap-12"
      >
        <motion.div variants={itemVariants} className="h-36">
          <div className="bg-white rounded-lg inline-block p-3 sm:p-4 shadow-lg">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center">
              <Image src="/footerImg.png" alt="Footer Logo" width={186} height={60} priority />
            </motion.div>
          </div>
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight poppins-bold tracking-tight"
        >
          {heading}
        </motion.h2>

        <motion.div variants={itemVariants} className="text-center">
          <p className="font-poppins text-xl sm:text-2xl leading-relaxed font-medium">
            {message.split("\n").map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 w-full max-w-md"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-8 py-3 bg-[#0057A1] text-white rounded-full hover:bg-[#0056a1ef] transition-colors text-lg font-medium shadow-lg"
            onClick={() => router.push("/")}
          >
            Go to Dashboard
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-8 py-3 bg-white text-[#0057A1] rounded-full hover:bg-gray-100 transition-colors text-lg font-medium shadow-lg"
            onClick={() => router.push("/contact-us")}
          >
            Give Feedback
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default SurveySuccess
