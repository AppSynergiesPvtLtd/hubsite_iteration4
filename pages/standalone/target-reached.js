"use client";

import StandAloneTemplate from "@/components/StandAlone.template";

const TargetReached = () => {
  return (
    <StandAloneTemplate
      heading="Target Reached"
      message={
        "Oops! This survey filled up quickly. But dont worry—more surveys are coming your way soon!"
      }
    />
  );
};

export default TargetReached;
