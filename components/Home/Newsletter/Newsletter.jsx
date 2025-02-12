import React, { useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { motion } from "framer-motion";
import SucessNewsLetter from "../../../public/success_newsletter.svg";
import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  

  const handleSubmit = async() => {
    if (validateEmail(email)) {
      try{
        console.log("hit howa mae")
        const resp = await axios.post(`${baseUrl}/newsletter/create`,{email},{
          headers:{
            "x-api-key":API_KEY,
            Authorization:baseUrl
          }
        })
        console.log(resp)
        setError(false);
        setSuccess(true);
      }
      catch(error){
        setError(true);
        setSuccess(false);
      }
    } else {
      setError(true);
      setSuccess(false);
    }
  };

  return (
    <motion.div
      className="bg-[#0057A1] rounded-md md:rounded-3xl px-4 md:px-6 mx-auto h-auto py-6 w-[90%] sm:w-[85%] md:w-[70%] md:min-h-[30vh] lg:w-[60%] xl:w-[50%] flex justify-center items-center flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {!success ? (
        <>
          <motion.h2
            className="text-white text-[22px] sm:text-[28px] md:text-[36px] font-semibold mb-2 text-center"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Sign up to our newsletter
          </motion.h2>

          <motion.p
            className="text-white w-[90%] sm:w-[85%] md:w-[70%] lg:w-[60%] text-center mb-4 text-[12px] sm:text-[14px] md:text-[18px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Receive latest news, updates, and many other news every week.
          </motion.p>

          <motion.div
            className={`flex items-center justify-between mt-6 w-[90%] sm:w-[85%] md:w-[70%] lg:w-[60%] rounded-full px-4 sm:px-6 py-2 ${
              error ? "bg-red-100 border-2 border-red-500" : "bg-white"
            }`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.input
              className={`rounded-full px-4 w-full text-gray-700 focus:outline-none text-[12px] sm:text-[14px] md:text-[16px]`}
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              transition={{ type: "spring", stiffness: 120 }}
            />
            <motion.button
              onClick={handleSubmit}
              className="text-white rounded-full px-4 py-2 bg-[#0057A1] flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <MdArrowForwardIos />
            </motion.button>
          </motion.div>
          {error && (
            <p className="text-red-500 text-[12px] sm:text-[14px] mt-4 text-center">
              Please enter a valid email address.
            </p>
          )}
        </>
      ) : (
        <div className="text-center text-white flex flex-col items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-[30px] md:text-[48px] mb-4">
              <SucessNewsLetter />
            </div>
          </motion.div>
          <motion.h2
            className="text-[22px] sm:text-[28px] md:text-[36px] font-semibold md:w-[70%] text-center"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Thank You for Subscribing! 
          </motion.h2>
          <motion.p
            className="text-[12px] sm:text-[14px] md:text-[18px] mt-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            We've received your email for Newsletter Updates.
          </motion.p>
        </div>
      )}
    </motion.div>
  );
};

export default Newsletter;
