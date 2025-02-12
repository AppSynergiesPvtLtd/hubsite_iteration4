import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const aboutData = {
  title: "About Hubsite Social",
  subtitle: "Your Voice Matters—Shape the Future and Earn Rewards!",
  bannerImage: "/Aboutbanner.png",
  whatIsHubsite: {
    heading: "What is Hubsite Social?",
    description: `At Hubsite Social, we connect businesses and consumers by facilitating meaningful market research through engaging surveys. Our mission is to empower businesses with real-time feedback that informs decision-making and drives innovation. By joining our dynamic community of participants, you have the opportunity to express your opinions on a wide variety of topics while earning rewards for your valuable insights. From gift cards to exclusive discounts, your contributions not only enhance the platform but also give you a voice in shaping the products and services that matter to you. Become a part of Hubsite Social today and experience a rewarding journey that makes a real difference!`,
  },
  whyHubsitian: {
    heading: "Why to be an Hubsitian?",
    points: [
      "Valuable Insights: By participating in our surveys, you provide businesses with the insights they need to improve products and services, making your voice an essential part of the decision-making process.",
      "Earn Rewards: Your time and opinions are rewarded! Participate in surveys and other activities to earn points, gift cards, and exclusive discounts, turning your feedback into tangible benefits.",
      "User-Friendly Experience: Our platform is designed to be intuitive and accessible, making it easy for you to participate and share your opinions whenever and wherever it suits you.",
      "Diverse Opportunities: With a wide range of topics and survey types, you can choose which surveys to participate in based on your interests, ensuring that your experience is both enjoyable and relevant.",
      "Confidentiality and Security: We prioritize your privacy. Your personal data is handled with the utmost care and in accordance with strict data protection standards, so you can participate with confidence.",
      "Impactful Participation: Your feedback contributes to real change. By sharing your thoughts, you help shape the products and services you use every day, influencing brands to better meet consumer needs.",
    ],
    closingNote:
      "Join Hubsite Social today and be part of a community that values your opinions and rewards your engagement!",
  },
};

const AboutBanner = () => {
  return (
    <div className="bg-gray-50 px-5">
      <div className="flex justify-center flex-col items-center p-2">
        <motion.h2
          className="text-3xl mt-2 md:mt-0 md:text-4xl lg:text-5xl font-bold text-center sm:text-center md:text-left"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          About
          <span className="text-[#0057A1]"> Hubsite Social</span>
        </motion.h2>
        <motion.p
          className="text-md md:text-2xl text-[#757575] text-center sm:text-center md:text-left font-semibold mt-4 max-w-4xl poppins-extrabold"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {aboutData.subtitle}
        </motion.p>

        <motion.div
          className="mt-12 w-full"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Image
            src={aboutData.bannerImage}
            alt="Hubsite Social"
            width={1920}
            height={520}
            className="w-full h-auto md:h-[520px] object-contain"
          />
        </motion.div>

        <motion.div
          className="flex flex-col md:flex-row justify-center items-start gap-[100px] mt-12 w-full max-w-screen-xl"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="w-full md:w-[35%]">
            <h2 className="text-2xl md:text-4xl  sm:text-center md:text-left poppins-semibold leading-[55px]">
              {aboutData.whatIsHubsite.heading}
            </h2>
          </div>
          <div className="w-full md:w-[60%]">
            <p className="text-md md:text-lg poppins-medium -mt-20 text-[#636363] md:mt-0">
              {aboutData.whatIsHubsite.description}
            </p>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col items-center mt-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2 className="text-2xl md:text-4xl text-center sm:text-center md:text-left poppins-bold">
            {aboutData.whyHubsitian.heading.split(" ")[0]}{" "}
            <span className="text-[#0057A1]">
              {aboutData.whyHubsitian.heading.split(" ")[4]}
            </span>
          </h2>
          <ol className="list-decimal text-md md:text-xl text-[#636363] mt-6 w-full md:w-4/5 poppins-medium">
            {aboutData.whyHubsitian.points.map((point, index) => (
              <motion.li
                key={index}
                // initial={{ opacity: 0, y: 50 }}
                // whileInView={{ opacity: 1, y: 0 }}
                // transition={{ duration: 0.8, delay: 1 + index * 0.2 }}
                className="mb-7"
              >
                {point}
              </motion.li>
            ))}
          </ol>
          <motion.p
            className="text-lg md:text-xl mt-6 text-[#636363] md:w-[80%]"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.2 }}
          >
            {aboutData.whyHubsitian.closingNote}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutBanner;
