import React, { useState } from "react";
import { motion } from "framer-motion";
import MainLayout from "@/layouts/MainLayout";

const faqs = [
  {
    question: "What is Hubsite Social?",
    answer:
      "Hubsite Social is a market research panel that connects businesses with individuals to gather opinions and insights through surveys. Participants can earn rewards for their participation.",
  },
  {
    question: "How do I join Hubsite Social?",
    answer:
      "You can join by signing up on our website, providing the required information, and confirming your email address.",
  },
  {
    question: "What are the eligibility requirements for joining?",
    answer:
      "Eligibility requirements include being at least 18 years old and residing in a region where Hubsite Social operates.",
  },
  {
    question: "How can I participate in surveys?",
    answer:
      "Once you're a member, you'll receive survey invitations via email or through your dashboard. Simply click the link to start the survey.",
  },
  {
    question: "How are survey participants selected?",
    answer:
      "Participants are selected based on their profiles and the requirements of each survey. This ensures that responses are relevant and valuable.",
  },
  {
    question: "How do I earn rewards?",
    answer:
      "You can earn rewards by completing surveys. Each survey will indicate the number of points or rewards you'll receive upon completion.",
  },
  {
    question: "How can I redeem my rewards?",
    answer:
      "Rewards can be redeemed for gift cards, cash, or other options available in your account dashboard.",
  },
  {
    question: "Is there a minimum threshold for redeeming rewards?",
    answer:
      "Yes, there is a minimum threshold that must be reached before you can redeem your rewards. Check your dashboard for details.",
  },
];

const FAQWithMotion = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-[95%] md:w-[80%] mx-auto md:p-6 poppins"
    >
      <h1 className="text-3xl font-bold text-center mb-6">FAQ's</h1>
      <p className="text-center text-gray-600 md:w-[800px] md:leading-[35px] m-auto md:mt-10 mb-4 md:text-[20px]">
        Find answers to the most frequently asked questions about Hubsite Social. 
        If you need assistance, contact us at{" "}
        <a href="mailto:support@hubsitesocial.com" className="text-blue-600 underline">
          support@hubsitesocial.com
        </a>{" "}
        or fill out our contact form. We're here to help 24/7.
      </p>
      <div className="border border-gray-300 rounded-2xl">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b last:border-none">
            {/* Toggle Button */}
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center px-4 py-3 text-left focus:outline-none"
            >
              <span className="font-medium text-gray-800">{faq.question}</span>
              <span className="text-orange-500 text-2xl font-semibold">
                {openIndex === index ? "–" : "+"}
              </span>
            </button>

            {/* Answer Section with Animation */}
            <motion.div
              initial={false}
              animate={openIndex === index ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-4 py-3 border-t border-gray-300 text-gray-700">
                {faq.answer}
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
FAQWithMotion.Layout = MainLayout; 

export default FAQWithMotion;
