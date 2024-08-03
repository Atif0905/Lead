import React, { useState, useEffect } from "react";
import "../index.css";
import "./Signin.css";

export default function SignUp() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [key, setKey] = useState("");
  const [key1, setKey1] = useState("");
  const [options, setOptions] = useState([]);
  const [options1, setOptions1] = useState([]);
  const [userData, setUserData] = useState("");
  const [keyData, setKeyData] = useState("");
  
  useEffect(() => {
    fetch("http://localhost:5000/getAllUser")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          const subUserData = data.data.filter(user => user.userType === "SubUser");
          setUserData(subUserData)
          setOptions(subUserData); 
          const UserData = data.data.filter(user => user.userType === "User");
          setKeyData(UserData)
          setOptions1(UserData);
        }
      })
      .catch((error) => console.error("Error fetching options:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userType === "Admin" && secretKey !== "Atif") {
      alert("Invalid Admin");
      return;
    }
    console.log(fname, lname, email, password, key1);
    fetch("http://localhost:5000/register", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        fname,
        email,
        lname,
        password,
        userType,
        key,
        key1,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userRegister");
        if (data.status === "ok") {
          alert("Registration Successful");
        } else {
          alert("Something went wrong");
        }
      });
  };
  return (
    <div className="">
      <img src="./Signinimg.webp" loading="lazy" className="signinimg" alt="" />
      <img
        src="./mobilesigninimg.webp"
        loading="lazy"
        className="mobilesigninimg"
        alt="img"
      />
      <div className="logindiv">
        <form onSubmit={handleSubmit}>
          <h3 className="Signinhead">SIGN UP</h3>
          {userType === "Admin" && (
            <div className="mb-3">
              <label className="labeltext">Secret Key</label>
              <input
                type="text"
                className="form-control"
                placeholder="Secret Key"
                onChange={(e) => setSecretKey(e.target.value)}
              />
            </div>
          )}
          <div className="mb-3">
            <label className="labeltext">First name</label>
            <input
              type="text"
              className="formcontrol"
              placeholder="First name"
              onChange={(e) => setFname(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="labeltext">Last name</label>
            <input
              type="text"
              className="formcontrol"
              placeholder="Last name"
              onChange={(e) => setLname(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="labeltext">Email address</label>
            <input
              type="email"
              className="formcontrol"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="labeltext">Password</label>
            <input
              type="password"
              className="formcontrol"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {(userType === "User" ) && (
            <div className="mb-3">
              <label>Enter Your Key</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter key"
                onChange={(e) => setKey(e.target.value)}
              />
            </div>
          )}
          {userType === "SubUser" && (
            <div className="mb-3">
              {keyData && (
              <div>
              <select
                type="text"
                className="form-control"
                placeholder="Select Key1"
                onChange={(e) => setKey(e.target.value)}
              >
                <option>Select Option</option>
                {keyData.map((secretKey, index) => (
                  <option key={index} value={secretKey.key}>
                    {secretKey.key}
                  </option>
                ))}
              </select>
            </div>
            )}
              <label>Enter Your Private Key to Add Team</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Key1"
                onChange={(e) => setKey1(e.target.value)}
              />
            </div>
          )}
          {userType === "Executive" && (
            <div className="mb-3">
              <label>Enter</label>
              {userData && (
                <div>
                  <select
                    type="text"
                    className="form-control"
                    placeholder="Select Key1"
                    onChange={(e) => setKey(e.target.value)}
                  >
                    <option>Select Option</option>
                    {userData.map((secretKey, index) => (
                      <option key={index} value={secretKey.key1}>
                        {secretKey.key1}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
          <div className="d-flex justify-content-between">
            <h5>Register As:</h5>
            <div>
              <input
                type="radio"
                name="UserType"
                value="User"
                onChange={(e) => setUserType(e.target.value)}
              />
              User
            </div>
            <div>
              <input
                type="radio"
                name="UserType"
                value="Admin"
                onChange={(e) => setUserType(e.target.value)}
              />
              Admin
            </div>
            <div>
              <input
                type="radio"
                name="UserType"
                value="SubUser"
                onChange={(e) => setUserType(e.target.value)}
              />
              SubUser
            </div>
            <div>
              <input
                type="radio"
                name="UserType"
                value="Executive"
                onChange={(e) => setUserType(e.target.value)}
              />
              Executive
            </div>
          </div>
          <div className="d-grid">
            <button type="submit" className="login-button">
              Register
            </button>
          </div>
          <p className="forgot-password text-right">
            Already registered <a href="/login">Login?</a>
          </p>
        </form>
      </div>
    </div>
  );
}