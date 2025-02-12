import React from "react";
import Image from "next/image";

const OnboardingSection = () => {
    return (
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between md:w-[90%] md:h-[450px] m-auto p-4 md:p-6 gap-10 md:gap-32">
            <div className="w-full md:w-1/2 md:h-[250px] flex justify-center md:justify-start">
                <Image
                    src="/OnboadringSection.png"
                    alt="Sign Up Illustration"
                    width={600} // Adjust width to fit layout
                    height={300} // Adjust height as needed
                    className="w-full h-auto max-h-[300px] sm:max-h-[350px] object-contain"
                />
            </div>

            <div className="w-full md:w-[75%] md:text-left">
                <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-bold text-[#303F9E] mb-4">
                    3. Finish Your Onboarding Questionnaire
                </h2>
                <p className="text-[16px] sm:text-[18px] md:text-[18px] text-[#001627] leading-relaxed md:w-[600px] mx-auto md:mx-0">
                    Take a few moments to finish your onboarding questionnaire, allowing us to better understand your
                    interests and preferences. This will help us connect you with relevant surveys that align with your
                    experiences, ensuring your participation is both enjoyable and impactful!
                </p>
            </div>
        </div>
    );
};

export default OnboardingSection;
