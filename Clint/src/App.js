import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Login from "./components/login_component";
import SignUp from "./components/signup_component";
import UserDetails from "./components/userDetails";
import AdminHome from "./components/adminHome";
import Product from "./components/products";
import About from "./components/about";
import ProtectedRoute from "./components/ProtectedRoute";
import Leads from "./components/Leads";
import UserHome from "./components/userHome";
import DirectorDashboard from "./components/Dashboard/DirectorDashboard";
import DirectorLead1 from "./components/DirectorLeads/DirectorLead1";
import SubUserHome from "./components/subUserHome";
import Teamlead1 from "./components/TeamLeads/Teamlead1";
import ExecutiveHome from "./components/executiveHome";
import ExecutiveLead1 from "./components/ExecutiveLead/ExecutiveLead1";

function App() {
  const isLoggedIn = window.localStorage.getItem("loggedIn") === "true";
  const userType = window.localStorage.getItem("userType");
  const userId = window.localStorage.getItem("userId");
 

  return (
    <Router>
      <div className="App">
        <Routes>
          {!isLoggedIn ? (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/" element={<Login />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                {/* Admin Routes */}
                {userType === "Admin" && (
                  <>
                  <Route path="/" element={<Navigate to={`/admin-dashboard/${userId}`} />} />
                    <Route path="/admin-dashboard/:userId" element={<AdminHome />} />
                    <Route path="/adminleads" element={<Leads />} />
                  </>
                )}
                
                {/* User Routes */}
                {userType === "User" && (
                  <>
                    <Route path="/" element={<Navigate to={`/directorhome/${userId}`} />} />
                    <Route path="/directorhome/:userId" element={<UserHome />} />
                    <Route path="/dir-dashboard" element={<DirectorDashboard />} />
                    <Route path="/dir1leads" element={<DirectorLead1 />} />
                  </>
                )}

                {/* SubUser Routes */}
                {userType === "SubUser" && (
                  <>
                    <Route path="/" element={<Navigate to={`/subuserhome/${userId}`} />} />
                    <Route path="/subuserhome/:userId" element={<SubUserHome />} />
                    <Route path="/teamlead1" element={<Teamlead1 />} />
                  </>
                )}

                {/* Executive Routes */}
                {userType === "Executive" && (
                  <>
                    <Route path="/" element={<Navigate to={`/executivehome/${userId}`} />} />
                    <Route path="/executivehome/:userId" element={<ExecutiveHome />} />
                    <Route path="/executivelead1" element={<ExecutiveLead1 />} />
                  </>
                )}

                {/* Common Routes */}
                <Route path="/userDetails" element={<UserDetails />} />
                <Route path="/products" element={<Product />} />
              </Route>
            </>
          )}

          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
