import React, { Component, useState } from "react";
import "../App.css";
import { Navigate } from "react-router-dom";
import './Signin.css'
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    console.log(email, password);
    fetch("http://localhost:5000/login-user", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userRegister");
        if (data.status == "ok") {
          console.log(data.userType);
          alert("login successful");
          window.localStorage.setItem("token", data.data);
          window.localStorage.setItem("userType", data.userType);
          window.localStorage.setItem("loggedIn", true);
          
          if (data.userType == "Admin") {
            
            return (window.location.href = "./admin-dashboard");
          } else {
            window.location.href = "./userDetails";
          }
        }
      });
  }

  return (
    <div className="">
    <img src="./Signinimg.webp" loading="lazy" className="signinimg" alt=""/>
    <img src="./mobilesigninimg.webp" loading="lazy" className="mobilesigninimg" alt="img"/>
    <div className="logindiv">
        <form onSubmit={handleSubmit}>
          <h3 className="Signinhead">LOGIN</h3>

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

          <div className="mb-3">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customCheck1"
              />
              <label className="custom-control-label" htmlFor="customCheck1">
                Remember me
              </label>
            </div>
          </div>

          <div className="d-grid">
            <button type="submit" className="login-button">
              Submit
            </button>
          </div>
          <p className="forgot-password text-right">
            <a href="/register">Register</a>
          </p>
        </form>
      </div>
    </div>
  );
}
