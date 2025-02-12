import React from "react";
import Image from "next/image";

const CompleteProfileSection = () => {
    return (
        <div className="flex flex-col md:gap-x-[60px] lg:flex-row items-center justify-center p-6 bg-gray-100">
            <div className="text-center lg:text-left max-w-md lg:max-w-lg">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#303F9E] mb-4">2. Complete Your Profile</h2>
                <p className="text-[#001627]">
                    Fill out your profile to enhance your experience and ensure you receive personalized survey
                    opportunities tailored to your interests. This information helps us connect you with surveys
                    that truly resonate with you, making your feedback even more impactful!
                </p>
            </div>

            <div className="">
                <div className="">
                    <div className="flex items-center space-x-4 mb-4">
                        <Image
                            src="/CompleteProfileSection.png"
                            alt="User Avatar"
                            width={350} 
                            height={350} 
                            className="md:h-[350px]" 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompleteProfileSection;
