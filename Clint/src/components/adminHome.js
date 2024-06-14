import React, { useEffect, useState } from "react";
import { faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../App.css";
import UploadLeads from "./Leads/UploadLeads";
import ViewLeads from "./Leads/ViewLeads";
// import AdminDashboard from "./"; // Import other dashboards as needed
import UserDashboard from "./userHome";
import SubUserDashboard from "./subUserHome";
import ExecutiveDashboard from "./executiveHome";

export default function AdminHome() {
  // State hooks to manage user data, search query, and selected user type
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUserType, setSelectedUserType] = useState("Admin");

  // Fetch all users whenever the search query or user type changes
  useEffect(() => {
    getAllUser();
  }, [searchQuery, selectedUserType]);

  // Function to fetch all users from the backend
  const getAllUser = () => {
    fetch(`http://localhost:5000/getAllUser?search=${searchQuery}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status === "ok") {
          setData(data.data);
        } else {
          console.error("Failed to fetch users:", data.message);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setIsLoading(false);
      });
  };

  // Function to log out and clear local storage
  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./login";
  };

  // Function to delete a user
  const deleteUser = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      fetch("http://localhost:5000/deleteUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          userid: id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.data);
          getAllUser(); // Refresh the list after deletion
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
    }
  };

  // Function to handle the search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Function to handle dropdown change
  const handleUserTypeChange = (e) => {
    setSelectedUserType(e.target.value);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Render dashboard based on selected user type
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
    <div className="auth-wrapper" style={{ height: "auto", marginTop: 50 }}>
      <div className="auth-inner" style={{ width: "fit-content" }}>
        <h3>Welcome Admin</h3>
        <div style={{ marginBottom: 10 }}>
          <span style={{ marginRight: 10 }}>Select User Type:</span>
          <select value={selectedUserType} onChange={handleUserTypeChange}>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
            <option value="SubUser">SubUser</option>
            <option value="Executive">Executive</option>
          </select>
        </div>
        {dashboardComponent}
        <div style={{ marginTop: 20 }}>
          <h4>User Management</h4>
          <div style={{ position: "relative" }}>
            <FontAwesomeIcon
              icon={faSearch}
              style={{ position: "absolute", left: 10, top: 13, color: "black" }}
            />
            <input
              type="text"
              placeholder="Search..."
              onChange={handleSearch}
              style={{
                padding: "8px 32px 8px 32px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                width: "100%",
                boxSizing: "border-box",
              }}
            />
            <span>
              {searchQuery.length > 0
                ? `Records Found ${data.length}`
                : `Total Records ${data.length}`}
            </span>
          </div>
          <table style={{ width: 900, marginTop: 10 }}>
            <thead>
              <tr style={{ textAlign: "center" }}>
                <th>Name</th>
                <th>Email</th>
                <th>User Type</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <tr key={user._id} style={{ textAlign: "center" }}>
                  <td>{user.fname} {user.lname}</td>
                  <td>{user.email}</td>
                  <td>{user.userType}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={() => deleteUser(user._id, user.fname)}
                      style={{ cursor: "pointer", color: "red" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={logOut}
            className="btn btn-primary"
            style={{ marginTop: 10 }}
          >
            Log Out
          </button>
        </div>
      </div>
      <div style={{ marginTop: 20 }}>
        <UploadLeads />
      </div>
      <div style={{ marginTop: 20 }}>
        <ViewLeads />
      </div>
    </div>
  );
}
