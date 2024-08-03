import React, { useEffect, useState } from "react";
import "../App.css";
import UploadLeads from "./Leads/UploadLeads";
import ViewLeads from "./Leads/ViewLeads";
import UserDashboard from "./userHome";
import SubUserDashboard from "./subUserHome";
import ExecutiveDashboard from "./executiveHome";
import Adminsidebar from "../Sidebar/AdminSidebar";


export default function AdminHome() {
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
    <div>
      { userData && (
        <div>                    
          <table >
            <thead>
            </thead>
            {userData.data.map((secretKey, index) => (
              <tbody key={index}>
                <tr>
                  <td>{secretKey.fname}</td>
                </tr>
              </tbody>
              ))}
          </table>
        </div>
      )

      }
      <Adminsidebar/>
      <div className="main-content" >
        {dashboardComponent}
      <div style={{ marginTop: 20 }}>
        <ViewLeads />
      </div>
      <div style={{ marginTop: 20 }}>
        <UploadLeads />
      </div>
      
    </div>
    </div>
  );
}
