import React, { useEffect, useState } from "react";
import "../App.css";
import UploadLeads from "./Leads/UploadLeads";
import ViewLeads from "./Leads/ViewLeads";
import UserDashboard from "./userHome";
import SubUserDashboard from "./subUserHome";
import ExecutiveDashboard from "./executiveHome";
import Adminsidebar from "../Sidebar/AdminSidebar";
import Deals from "./Deals/Deals";
import ImportData from "./Tools/ImportData";


export default function AdminHome() {
  const [selectedUserType, setSelectedUserType] = useState("");
  let dashboardComponent;
  switch (selectedUserType) {
    case "User":
      dashboardComponent = <UserDashboard />;
      break;
    case "SubUser":
      dashboardComponent = <SubUserDashboard />;
      break;
    case "Executive":
      dashboardComponent = <ExecutiveDashboard />;
      break;
    default:
      dashboardComponent = null;
      break;
  }

  return (
    <div  >
      <Adminsidebar/>
      <div className="main-content" >
        {dashboardComponent}
      {/* <div style={{ marginTop: 20 }}>
        <ViewLeads />
      </div> */}
      {/* <div style={{ marginTop: 20 }}>
        <UploadLeads />
      </div> */}
      <div style={{ marginTop: 20 }}>
     <Deals />
      </div>
        {/* <div style={{ }}>
    <ImportData />
      </div> */}
      
    </div>
    </div>
  );
}
