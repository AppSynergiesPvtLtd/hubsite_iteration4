import React from "react";
import Image from "next/image";

const SurveysSection = () => {
    return (
        <div className="flex flex-col md:gap-x-[60px] lg:flex-row items-center justify-center p-6 bg-gray-100">
            <div className="text-center lg:text-left max-w-md lg:max-w-lg">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#303F9E] mb-4">4. Start Taking Surveys</h2>
                <p className="text-[#001627]">
                    Jump into a variety of engaging surveys where your opinions matter. By sharing your insights, 
                    you’ll not only influence the products and services that interest you but also earn exciting
                    rewards with every survey you complete!
                </p>
            </div>

            <div>
                <div>
                    <div className="flex items-center space-x-4 mb-4">
                        <Image
                            src="/SurveysSection.png"
                            alt="User Avatar"
                            width={350} // Specify appropriate width
                            height={350} // Specify appropriate height
                            className="md:h-[350px]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SurveysSection;
