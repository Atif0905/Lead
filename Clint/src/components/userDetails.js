import React, { useEffect, useState } from "react";
import AdminHome from "./adminHome";
import UserHome from "./userHome";
import SubUserHome from "./subUserHome";
import ExecutiveHome from "./executiveHome";
import "../App.css";

export default function UserDetails() {
  const [userData, setUserData] = useState(null);
  const [userType, setUserType] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [allUserData, setAllUserData] = useState(null); // State to store all users, subusers, executives data
  const [isAdminDashboard, setIsAdminDashboard] = useState(false); // State to toggle between admin dashboard and user/subuser/executive homes

  useEffect(() => {
    fetch("http://localhost:5000/userData", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        if (data.data === "token expired") {
          alert("Token expired, login again");
          window.localStorage.clear();
          window.location.href = "./login";
        } else {
          setUserData(data.data);
          setUserType(data.data.userType);
          setIsLoading(false);
  
          // Fetch all users, subusers, executives data if user is Admin
          if (data.data.userType === "Admin") {
            fetch("http://localhost:5000/allUserData", {
              method: "GET",
              crossDomain: true,
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            })
              .then((res) => res.json())
              .then((data) => {
                setAllUserData(data);
              })
              .catch((error) => {
                console.error("Error fetching all user data:", error);
              });
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);
  
  const toggleAdminDashboard = () => {
    setIsAdminDashboard(!isAdminDashboard);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-details-container">
      {isAdminDashboard && userType === "Admin" ? (
        <div>
          <h1>Admin Dashboard</h1>
          {/* Display all users, subusers, executives data */}
          {allUserData && (
            <ul>
              {allUserData.users.map((user) => (
                <li key={user.id}>{user.name} - {user.type}</li>
              ))}
              {allUserData.subusers.map((subuser) => (
                <li key={subuser.id}>{subuser.name} - {subuser.type}</li>
              ))}
              {allUserData.executives.map((executive) => (
                <li key={executive.id}>{executive.name} - {executive.type}</li>
              ))}
            </ul>
          )}
          <button onClick={toggleAdminDashboard}>Back to My Dashboard</button>
        </div>
      ) : (
        <>
          {userType === "Admin" && (
            <AdminHome />
          )}
          {userType === "User" && (
            <UserHome userData={userData} />
          )}
          {userType === "SubUser" && (
            <SubUserHome userData={userData} />
          )}
          {userType === "Executive" && (
            <ExecutiveHome userData={userData} />
          )}
          {userType === "" && (
            <div>Error: Invalid user type</div>
          )}
         
        </>
      )}
    </div>
  );
}
