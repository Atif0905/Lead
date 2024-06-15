import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AdminHome from "./adminHome";
import UserHome from "./userHome";
import SubUserHome from "./subUserHome";
import ExecutiveHome from "./executiveHome";
import "../App.css"; 

export default function UserDetails() {
  const [userData, setUserData] = useState(null);
  const [userType, setUserType] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
        }
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  switch (userType) {
    case "Admin":
      return <AdminHome />;
    case "User":
      return <UserHome userData={userData} />;
    case "SubUser":
      return <SubUserHome userData={userData} />;
    case "Executive":
      return <ExecutiveHome userData={userData} />;
    default:
      console.error("Invalid user type");
      return null;
  }
}
