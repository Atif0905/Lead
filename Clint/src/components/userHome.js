import React, { useEffect, useState } from "react";
import "../App.css";
import DirectorSidebar from "../Sidebar/DirectorSidebar";
import Deals from "./Deals/Deals";
import UserDashboard from "./userHome";
import SubUserDashboard from "./subUserHome";
import ExecutiveDashboard from "./executiveHome";

export default function UserHome() {
  const [userData , setUserData] = useState("");
  useEffect(() => {
    fetch("http://localhost:5000/getAllUser")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          setUserData(data)
          console.log(data)
        }
      })
      .catch((error) => console.error("Error fetching options:", error));
  }, []);
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
    <div className="">
      <DirectorSidebar />
      <div className="main-content" >
        {dashboardComponent}
 
      <div>
 <Deals />
   
      </div>
    </div>
    </div>
  );
}