import React, { useEffect, useState } from "react";
import { faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../App.css";

export default function AdminHome() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    getAllUser();
  }, [searchQuery]);
  const getAllUser = () => {
    fetch(`http://localhost:5000/getAllUser?search=${searchQuery}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        setData(data.data);
      });
  };
  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./login";
  };
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
          getAllUser(); 
        });
    }
  };
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="auth-wrapper" style={{ height: "auto", marginTop: 50 }}>
      <div className="auth-inner" style={{ width: "fit-content" }}>
        <h3>Welcome Admin</h3>
        <div style={{ position: "relative", marginBottom: 10 }}>
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
        <table style={{ width: 900 }}>
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
                <td>{user.fname}</td>
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
  );
}
