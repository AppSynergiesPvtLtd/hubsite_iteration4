import React from "react";
import Admindashboard from "./admindashboard";
import AdminRoutes from "../adminRoutes";

const DashboardPage = () => {
  return (
      <Admindashboard/>
  );
};

export default AdminRoutes(DashboardPage);
