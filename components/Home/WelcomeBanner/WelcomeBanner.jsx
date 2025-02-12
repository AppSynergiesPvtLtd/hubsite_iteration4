import Head from 'next/head';
import { motion } from 'framer-motion'; 
import { btnBanner,mainHeading, banner, paraBanner } from "./WelcomeBanner.module.css"
import { useRouter } from 'next/router';
import { useState } from 'react';
import Modal from '@/components/UI/Modal';
import ForgotPassword from '@/components/Auth/ForgotPassword';
import SignUp from '@/components/Auth/SignUp';
import Login from '@/components/Auth/Login';
import { useSelector } from 'react-redux';

const Welcome = ({heading}) => {
  const user = useSelector((state) => state.user.user);
   const [isOpen, setIsOpen] = useState(false);
      const router = useRouter();
    const { modal } = router.query;
  
       let ModalContent;
        switch (modal) {
          case 'forgotPassword':
            ModalContent = <ForgotPassword onSwitchTab={(tab) => openModal(tab)} />;
            break;
          case 'signUp':
            ModalContent = <SignUp onSwitchTab={(tab) => openModal(tab)} />;
            break;
          default:
            ModalContent = <Login onSwitchTab={(tab) => openModal(tab)} />;
            break;
        }
  
     
  
      const openModal = (type) => {
          setIsOpen(true);
          router.push({ pathname: router.pathname, query: { modal: type } }, undefined    );
      };
  
      const closeModal = () => {
          setIsOpen(false);
          router.push(router.pathname, undefined, { shallow: true });
        };
  return (
    <>
      <div
        className={`flex flex-col justify-center items-center w-full h-[90vh] bg-cover bg-center bg-no-repeat p-8 relative ${banner}`}
      >
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-50 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1 }}
        />

        <motion.h2
          className={`z-20 sm:text-[40px] ${mainHeading}`}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {heading || "Welcome to Hubsite Social" }
        </motion.h2>

        <motion.p
          className={`text-center text-white mb-6 bg-opacity-50 px-6 py-4 rounded z-20 max-w-full lg:max-w-2xl xl:max-w-[955px] mx-auto ${paraBanner}`}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Join Hubsite Social platform where your opinions matter! Earn coins for each completed
          survey and easily convert them into real money. Enjoy a seamless experience, tailored
          surveys, and the chance to share your insights while getting rewarded for your time.
          Start earning today!
        </motion.p>

        {
          user?(<>
          <motion.button
            className={`font-medium py-3 bg-[#0057A1] px-[50px] text-xl text-white rounded-full hover:bg-[#265987] transition duration-300 z-20 ${btnBanner}`}
            whileHover={{
              scale: 1.1,
              backgroundColor: "#265987",
              transition: { duration: 0.3 }
            }}
            whileTap={{
              scale: 0.95,
              transition: { duration: 0.2 }
            }}
            onClick={()=>router.push("/dashboard")}
          >
            Dashboard
          </motion.button>
          </>):(
            <motion.button
            className={`font-medium py-3 bg-[#0057A1] px-[50px] text-xl text-white rounded-full hover:bg-[#265987] transition duration-300 z-20 ${btnBanner}`}
            whileHover={{
              scale: 1.1,
              backgroundColor: "#265987",
              transition: { duration: 0.3 }
            }}
            whileTap={{
              scale: 0.95,
              transition: { duration: 0.2 }
            }}
            onClick={openModal}
          >
            Get Started
          </motion.button>
          )
        }
       
      </div>
      <Modal  isOpen={isOpen} onClose={closeModal}>
                          {ModalContent}
               </Modal>
    </>
  );
};

export default Welcome;
