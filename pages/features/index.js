import React from 'react';
import { motion } from 'framer-motion';
import FeatureCard from '@/components/Key_Benefits/FeatureCard';
import { features } from '@/constants/benifits.constants';
import MainLayout from '@/layouts/MainLayout';

const Features = () => {
  return (
    <div className="p-6 bg-gray-50 text-center">
      {/* Title Section */}
      <motion.h1
        className="text-4xl font-bold text-[#0057A1] poppins"
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Key Benefits
      </motion.h1>
      <motion.h2
        className="text-2xl font-semibold text-[#0057A1] mt-8 poppins"
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Share Your Insights, Earn Rewards, and Make an Impact
      </motion.h2>
      <motion.p
        className="mt-6 text-lg text-[#828282] leading-snug mx-auto max-w-2xl poppins"
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        Join Hubsite Social to participate in engaging surveys that allow your
        voice to be heard. Earn exciting rewards while helping businesses
        understand consumer needs and shape the future of products and
        services. Your opinions matter—make a difference today!
      </motion.p>

      {/* Features Section */}
      <motion.div
        className="flex flex-wrap justify-center mt-10 md:w-[90%] m-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        {features?.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </motion.div>
    </div>
  );
};

Features.Layout = MainLayout; 
export default Features;
