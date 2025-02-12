"use client";

import StandAloneTemplate from "@/components/StandAlone.template";

const QualityIssue = () => {
  return (
    <StandAloneTemplate
      heading="Quality Issue"
      message={
        "For security reasons, we are unable to process your response. Please contact support if you believe this is an error."
      }
    />
  );
};

export default QualityIssue;
