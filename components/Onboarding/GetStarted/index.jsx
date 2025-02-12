import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";

const GetStarted = ({ onComplete }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(null); // Initialize as null to avoid flicker

  // Update currentStep when router.query.step changes
  useEffect(() => {
    const step = parseInt(router.query.step) || 1;
    setCurrentStep(step);
  }, [router.query.step]);

  const navigateToStep = (step) => {
    if (step > 1) {
      onComplete(); // Trigger moving to Questions
    } else {
      router.push(`/onboarding?stage=getStarted&step=${step}`, undefined, {
        shallow: true,
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne navigate={navigateToStep} />;
      // case 2:
      //   return <StepThree navigate={navigateToStep} />;
      // case 3:
      //   return <StepThree navigate={navigateToStep} />;
      // case 4:
      //   return <StepFour navigate={navigateToStep} />;
      default:
        return null; // Prevent flicker if currentStep is null
    }
  };

  // Don't render until currentStep is defined
  if (currentStep === null) return null;

  return <div>{renderStep()}</div>;
};

export default GetStarted;
