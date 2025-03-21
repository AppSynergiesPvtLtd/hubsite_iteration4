import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router'; // Import useRouter from Next.js

const Accumulate = () => {
    const router = useRouter(); // Initialize the router

    const cardData = [
        {
            image: '/AccumulateIcon1.png',
            heading: 'Sign Up',
            btn: 'STEP 1',
            paragraph: 'Join our community and discover how your opinion can matter. We’ve paid over  1.2million rupees to our members in the last year alone!'
        },
        {
            image: '/AccumulateIcon2.png',
            heading: 'Take Surveys',
            btn: 'STEP 2',
            paragraph: 'Take a survey and get paid for sharing your feedback on the products and brands we all know and love. It’s a win-win for everyone!',
        },
        {
            image: '/AccumulateIcon3.png',
            heading: 'Get Rewarded',
            btn: 'STEP 3',
            paragraph: 'Get rewarded in virtual points (LPs) that can be redeemed as e-gift cards, PayPal, and much more. You choose how you get rewarded, so you choose how taking surveys benefits you!',
        },
    ];

    return (
        <motion.div
            className="bg-gray-100 p-8 flex justify-center flex-col items-center min-h-[60vh] relative z-10 poppins" 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }} 
            variants={{
                hidden: { opacity: 0, y: 50 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.8, ease: 'easeInOut' },
                },
            }}
        >
            <h2 className="text-[28px] md:text-[40px] text-center font-bold my-6 text-[#0057A1] ">
                Accumulate HUBCOINS with Hubsite Social
            </h2>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
                {cardData.map((card, index) => (
                    <motion.div
                        key={index}
                        className="bg-white rounded-lg shadow-md px-2 md:w-[387px] md:h-[310px]"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }} 
                        variants={{
                            hidden: { opacity: 0, scale: 0.9 },
                            visible: {
                                opacity: 1,
                                scale: 1,
                                transition: { duration: 0.6, ease: 'easeInOut' },
                            },
                        }}
                    >
                        <div className="p-6">
                            <button className="bg-orange-500 rounded-lg w-full text-white text-[12px] font-semibold">
                                {card.btn}
                            </button>
                            <div className="flex justify-between md:h-8">
                                <h4 className="text-[24px] font-bold mb-2 w-[220px] md:w-24 text-[#0057A1]">
                                    {card.heading}
                                </h4>
                                <img
                                    src={card.image}
                                    alt={card.heading}
                                    
                                    className="w-[130px] h-fit object-cover -mt-12 ml-12"
                                />
                            </div>
                            <p className="text-gray-700 text-[16px] mt-16">{card.paragraph}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
            <motion.button
                className="bg-[#0057A1] text-white px-6 py-3 rounded-md w-fit mt-8 font-semibold"
                whileHover={{ scale: 1.05 }} // Hover effect for the button
                transition={{ duration: 0.3 }}
                onClick={() => router.push('/works')} // Redirect to /works
            >
                How it works
            </motion.button>
        </motion.div>
    );
};

export default Accumulate;
