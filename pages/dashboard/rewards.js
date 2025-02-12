import React from "react";
import Layout from "./layout";
import Rewards from "@/components/DashBoard/Rewards";
import PrivateRoute from "../PrivateRoute";

const RewardsPage = () => {
  return (
      <Rewards />
  );
};

export default PrivateRoute(RewardsPage);
