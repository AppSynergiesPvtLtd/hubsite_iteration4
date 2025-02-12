import React from "react";
import Layout from "./layout";
import Surveys from "@/components/DashBoard/Surveys";
import PrivateRoute from "../PrivateRoute";

const SurveyPage = () => {
  return (
      <Surveys />
  );
};

export default PrivateRoute(SurveyPage);
