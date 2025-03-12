import React from "react";
import Image from "next/image";
import { useSelector } from "react-redux";

const StepTwo = ({ navigate }) => {
  const user = useSelector((state) => state.user?.user);
  console.log(user)
  return (
    <section className="flex flex-col items-center gap-5 md:gap-7 min-h-[80vh] justify-center  p-4">
      <div className="w-[150px] h-[60px] md:w-[180px] md:h-[70px] relative">
        <Image
          src="/navbar_logo.png"
          alt="Hubsite Social Logo"
          layout="fill"
          objectFit="contain"
        />
      </div>
      <div className="text-center">
        <h2 className="text-[#0057A1] text-[24px] md:text-[35px] font-bold">
          Hey, {user.name}
        </h2>
        <p className="text-[#333] text-[20px] md:text-[25px] font-medium mt-2">
          Welcome to Hubsite Social?
        </p>
      </div>
      
      <button
        className="w-full max-w-[200px] md:max-w-[250px] bg-[#0057A1] text-white py-3 rounded-[25px] text-[16px] md:text-[18px] font-bold hover:bg-[#003f73] transition"
        onClick={() => navigate(3)}
      >
        Next
      </button>
    </section>
  );
};

export default StepTwo;
