import React from "react";
import Layout from "./layout";
import DashboardLanding from "@/components/DashBoard/DashBoard";
import PrivateRoute from "../PrivateRoute";

const DashboardPage = () => {
  return (
      <DashboardLanding/>
  );
};

export default PrivateRoute(DashboardPage);
