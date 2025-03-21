import React from 'react'
import {
    gradient
  } from "./styles/index.module.css";
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import StepFour from './StepFour';
const Benefits = () => {
  return (
    <div className={`md:mt-[30px] h-fit md:h-[auto] py-2 flex justify-center flex-col  `}>
    <div className='m-auto'>
        <h2 className='text-[#0057A1] text-[23px] font-bold md:text-[52px] poppins'>
            Benefits of Hubsite social
        </h2>
    </div>

    <StepOne/>
    <div className={`clear-both ${gradient} overflow-hidden`}>
        <StepTwo/>
        <StepThree/>
        <StepFour/>
    </div>
</div>
  )
}

export default Benefits