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
  const [allUserData, setAllUserData] = useState(null);
  const [isAdminDashboard, setIsAdminDashboard] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      alert("Token expired, login again");
      window.localStorage.clear();
      window.location.href = "./login";
      return;
    }

    fetch("http://localhost:5000/userData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data === "token expired") {
          alert("Token expired, login again");
          window.localStorage.clear();
          window.location.href = "./login";
        } else {
          setUserData(data.data);
          setUserType(data.data.userType);
          setIsLoading(false);

          if (data.data.userType === "Admin") {
            fetch("http://localhost:5000/allUserData", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            })
              .then((res) => res.json())
              .then((data) => setAllUserData(data))
              .catch((error) => console.error("Error fetching all user data:", error));
          }
        }
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  const toggleAdminDashboard = () => setIsAdminDashboard(!isAdminDashboard);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./login";
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const initials = userData ? `${userData.fname.charAt(0)}${userData.lname.charAt(0)}` : "";

  const getBackgroundColor = (initials) => {
    const colors = [
      "#FF5733", "#33FF57", "#3357FF", "#F333FF", "#FF33A1", "#A1FF33", "#FF8333"
    ];
    let sum = 0;
    for (let i = 0; i < initials.length; i++) {
      sum += initials.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  const getContrastingTextColor = (bgColor) => {
    const color = bgColor.substring(1); // strip #
    const rgb = parseInt(color, 16); // convert rrggbb to decimal
    const r = (rgb >> 16) & 0xff; // extract red
    const g = (rgb >>  8) & 0xff; // extract green
    const b = (rgb >>  0) & 0xff; // extract blue
    const luma = 0.299 * r + 0.587 * g + 0.114 * b; // per ITU-R BT.709
    return luma > 128 ? 'black' : 'white';
  };

  const bgColor = getBackgroundColor(initials);
  const textColor = getContrastingTextColor(bgColor);

  const dropdownStyle = {
    backgroundColor: bgColor,
    color: textColor,
    cursor: "pointer",
    position: "absolute", 
    right: "40px",
    top: "10px",
    padding: "12px",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center", // Center the content vertically and horizontally
  };
  
  const renderDropdown = () => (
    <div className="sidebarabovediv">
      <div className="d-flex justify-content-end">
        <div className="dropdown" onClick={toggleDropdown}>
          <p className="sidebarusername" style={dropdownStyle}>{initials.toUpperCase()}</p>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-item1">
                <button onClick={logOut} className="btn btn-primary">
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderUserHome = () => {
    const userHomeComponents = {
      Admin: <AdminHome />,
      User: <UserHome userData={userData} />,
      SubUser: <SubUserHome userData={userData} />,
      Executive: <ExecutiveHome userData={userData} />
    };

    return (
      <>
        {renderDropdown()}
        {userHomeComponents[userType] || <div>Error: Invalid user type</div>}
      </>
    );
  };

  return (
    <div className="user-details-container">
      {isAdminDashboard && userType === "Admin" ? (
        <div>
          <h1>Admin Dashboard</h1>
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
        renderUserHome()
      )}
    </div>
  );
}
