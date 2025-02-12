import React from "react";
import { motion } from "framer-motion";
import MainLayout from "@/layouts/MainLayout";

const RewardPolicy = () => {
  // Animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.2 } },
    exit: { opacity: 0 },
  };

  const fadeInVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      className="poppins md:w-[75%] mx-auto my-8 p-4 text-gray-800"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Title */}
      <motion.h1
        className="text-2xl md:text-4xl font-bold mb-6 text-center text-gray-900"
        variants={fadeInVariants}
      >
        Reward Policy
      </motion.h1>

      {/* Sections */}
      <motion.div className="space-y-6" variants={containerVariants}>
        {/* Section 1 */}
        <motion.section variants={fadeInVariants}>
          <h2 className="text-xl font-bold mb-4 text-gray-900">1. Introduction</h2>
          <p className="mb-6">
            This Reward Policy outlines the terms and conditions under which rewards are earned, redeemed, 
            and managed for participants of Hubsite Social ("the Panel"). By participating in the Panel, 
            you agree to comply with this Reward Policy.
          </p>
        </motion.section>

        {/* Section 2 */}
        <motion.section variants={fadeInVariants}>
          <h2 className="text-xl font-bold mb-4 text-gray-900">2. Earning Rewards</h2>
          <p className="mb-4">
            <span>2.1 Reward Eligibility:</span> Rewards are earned by participating in surveys and other activities 
            as specified by Hubsite Social. Eligibility for rewards is determined based on your active participation 
            and adherence to the Panel's Terms and Conditions.
          </p>
          <p className="mb-4">
            <span>2.2 Types of Rewards:</span> Hubsite Social offers various types of rewards, which may include 
            points, gift cards, cash equivalents, or other incentives. The specific rewards available and their 
            corresponding values will be detailed in individual survey invitations or account notifications.
          </p>
          <p className="mb-4">
            <span>2.3 Reward Accumulation:</span> Rewards are accumulated based on the completion of surveys and 
            other qualifying activities. The rate at which rewards are earned will be specified in each survey invitation. 
            Accumulated rewards are reflected in your account balance.
          </p>
        </motion.section>

        {/* Section 3 */}
        <motion.section variants={fadeInVariants}>
          <h2 className="text-xl font-bold mb-4 text-gray-900">3. Redemption of Rewards</h2>
          <p className="mb-4">
            <span>3.1 Redemption Process:</span> Rewards can be redeemed through the Panel’s designated reward redemption system. 
            The process for redeeming rewards, including any applicable terms and conditions, will be provided in your account details.
          </p>
          <p className="mb-4">
            <span>3.2 Minimum Redemption Threshold:</span> A minimum threshold may apply for redeeming rewards. You must meet this 
            threshold before rewards can be redeemed. The minimum redemption threshold will be specified in your account information.
          </p>
          <p className="mb-4">
            <span>3.3 Redemption Methods:</span> Hubsite Social may offer various redemption options, such as gift cards, direct bank 
            transfers, or other methods. The available redemption options and their respective terms will be outlined in your account details.
          </p>
          <p className="mb-4">
            <span>3.4 Processing Time:</span> The processing time for reward redemption may vary depending on the redemption method chosen. 
            Hubsite Social will provide an estimated processing time for each redemption option.
          </p>
        </motion.section>

        {/* Additional Sections */}
        <motion.section variants={fadeInVariants}>
          <h2 className="text-xl font-bold mb-4 text-gray-900">4. Reward Expiration and Forfeiture</h2>
          <p className="mb-4">
            <span>4.1 Expiration of Rewards:</span> Rewards have a validity period, after which they will expire if not redeemed. 
            The expiration period for rewards will be specified in your account details. It is your responsibility to redeem rewards 
            within this period to avoid forfeiture.
          </p>
          <p className="mb-4">
            <span>4.2 Forfeiture of Rewards:</span> Rewards may be forfeited under certain conditions, including but not limited to:
          </p>
          <ul className="list-disc ml-8 mb-4 text-left">
            <li>Termination or suspension of your account due to a breach of the Panel's Terms and Conditions.</li>
            <li>Inactivity for a specified period as outlined in our Inactivity Policy.</li>
            <li>Failure to redeem rewards within the specified validity period.</li>
          </ul>
        </motion.section>

        {/* Repeat similar structure for remaining sections */}
        {/* Section 5 */}
        <motion.section variants={fadeInVariants}>
          <h2 className="text-xl font-bold mb-4 text-gray-900">5. Account Status and Rewards</h2>
          <p className="mb-4">
            <span>5.1 Active Accounts:</span> To maintain eligibility for rewards, your account must be active and in good standing. 
            An active account is one where you are regularly participating in surveys and adhering to the Panel's Terms and Conditions.
          </p>
          <p className="mb-4">
            <span>5.2 Inactive Accounts:</span> Accounts that remain inactive for a period specified in our Inactivity Policy may 
            have accumulated rewards forfeited.
          </p>
        </motion.section>

        {/* Add remaining sections in similar fashion */}
      </motion.div>
    </motion.div>
  );
};

RewardPolicy.Layout = MainLayout; 

export default RewardPolicy;
