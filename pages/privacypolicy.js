import React from "react";
import { motion } from "framer-motion";
import MainLayout from "@/layouts/MainLayout";

const PrivacyPolicy = () => {

  const fadeIn = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    initial: {},
    animate: { transition: { staggerChildren: 0.2 } },
  };

  return (
    <motion.div
      className="poppins w-[95%] md:w-[80%] mx-auto py-8 text-gray-800"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.h1
        className="text-3xl font-bold text-center mb-6"
        {...fadeIn}
        transition={{ duration: 0.8 }}
      >
        Privacy Policy
      </motion.h1>

      <motion.div className="space-y-6" variants={staggerContainer}>
        <motion.section {...fadeIn}>
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p>
            Hubsite Social ("the Panel") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our services. By accessing or using the Panel, you consent to the practices described in this Privacy Policy.
          </p>
        </motion.section>

        <motion.section {...fadeIn}>
          <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
          <p className="mb-2">We collect personal information that you provide directly, such as:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Name</li>
            <li>Email address</li>
            <li>Postal address</li>
            <li>Phone number</li>
            <li>Demographic information (e.g., age, gender, occupation)</li>
          </ul>
          <p className="mt-4">
            We also collect responses to surveys and other activities conducted through the Panel, including your opinions, preferences, and other data related to the surveys.
          </p>
          <p>
            Additionally, we collect usage data, such as your IP address, browser type and version, device information, pages visited, time spent on the Panel, and referring website. Cookies and similar tracking technologies are used to enhance your experience and collect data about your usage of the Panel.
          </p>
        </motion.section>

        <motion.section {...fadeIn}>
          <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>To provide and manage the Panel and its services.</li>
            <li>To process your survey responses and reward earnings.</li>
            <li>To communicate with you about your account and surveys.</li>
            <li>To tailor survey invitations and content to your interests and preferences.</li>
            <li>To conduct research and analytics to improve our services.</li>
          </ul>
          <p className="mt-4">
            With your consent, we may use your contact information to send promotional materials, updates, and newsletters about Hubsite Social and our partners. You can opt-out of these communications at any time.
          </p>
        </motion.section>

        <motion.section {...fadeIn}>
          <h2 className="text-xl font-semibold mb-2">4. Data Sharing and Disclosure</h2>
          <p>
            We may share your data with trusted third-party service providers who assist us in operating the Panel, conducting surveys, and providing rewards. These third parties are contractually obligated to protect your data and use it only for the purposes agreed upon.
          </p>
          <p>
            We may also disclose your information if required by law or in response to valid requests by public authorities (e.g., subpoenas or court orders). In the event of a merger, acquisition, or any other form of business transfer, your personal information may be transferred to the acquiring entity. We will notify you of such changes.
          </p>
        </motion.section>

        <motion.section {...fadeIn}>
          <h2 className="text-xl font-semibold mb-2">5. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction. This includes encryption, access controls, and secure servers.
          </p>
          <p>
            While we strive to protect your information, no method of transmission over the internet or electronic storage is completely secure. We cannot guarantee absolute security but will take all reasonable measures to protect your data.
          </p>
        </motion.section>

        <motion.section {...fadeIn}>
          <h2 className="text-xl font-semibold mb-2">6. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to fulfill the purposes for which it was collected, to comply with legal obligations, or to resolve disputes. We may also retain anonymized data for research and analytical purposes.
          </p>
        </motion.section>

        <motion.section {...fadeIn}>
          <h2 className="text-xl font-semibold mb-2">7. Your Rights</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>You have the right to access, update, or correct your personal information held by Hubsite Social.</li>
            <li>You may request the deletion of your personal information. We will process such requests in accordance with applicable laws and regulations.</li>
            <li>You can opt-out of receiving promotional communications by following the instructions provided in those communications or by updating your communication preferences in your account settings.</li>
          </ul>
        </motion.section>

        <motion.section {...fadeIn}>
          <h2 className="text-xl font-semibold mb-2">8. Changes to the Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of significant changes by posting the updated policy on the Panel website or through other appropriate means.
          </p>
          <p>
            Your continued use of the Panel following any changes to this Privacy Policy constitutes your acceptance of the revised terms.
          </p>
        </motion.section>

        <motion.section {...fadeIn}>
          <h2 className="text-xl font-semibold mb-2">9. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
          </p>
          <p className="mt-2">
            <strong>Hubsite Social</strong>
            <br />
            Email: <a href="mailto:support@hubsitesocial.com" className="text-blue-600 underline">hello@hubsitesocial.com</a>
            <br />
            Phone: +260974314084
            <br/>
            A-46, Noida, Sector 2, Uttar Pradesh, India

          </p>
        </motion.section>
      </motion.div>
    </motion.div>
  );
};
PrivacyPolicy.Layout = MainLayout; 
export default PrivacyPolicy;
