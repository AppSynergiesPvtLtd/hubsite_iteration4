import React from "react";

const RewardSection = () => {
    return (
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between md:w-[90%] md:h-[450px]  m-auto p-4 md:p-6 gap-10 
            md:gap-32 ">
            <div className="w-full md:w-1/2 md:h-[350px] flex justify-center md:justify-start">
                <img
                    src="/RewardSection.png"
                    alt="Sign Up Illustration"
                    className="w-full h-auto max-h-[350px] sm:max-h-[350px] object-contain"
                />
            </div>

            <div className="w-full md:w-[75%] md:text-left">
                <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-bold text-[#303F9E] mb-4">
                   5. Claim Your Rewards
                </h2>
                <p className="text-[16px] sm:text-[18px] md:text-[18px] text-[#001627] leading-relaxed md:w-[600px] mx-auto md:mx-0">
                Enjoy the rewards you’ve earned by sharing your valuable insights! From gift cards to exclusive discounts, 
                your participation brings tangible benefits. Explore your options and celebrate your impact on the marketplace!
                </p>
            </div>
        </div>
    );
};

export default RewardSection;
