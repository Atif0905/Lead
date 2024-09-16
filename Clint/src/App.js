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
import UserHome from "./components/userHome";
import DirectorDashboard from "./components/Dashboard/DirectorDashboard";
import DirectorLead1 from "./components/DirectorLeads/DirectorLead1";
import SubUserHome from "./components/subUserHome";
import Teamlead1 from "./components/TeamLeads/Teamlead1";
import ExecutiveHome from "./components/executiveHome";
import ExecutiveLead1 from "./components/ExecutiveLead/ExecutiveLead1";
import Adminsidebar from "./Sidebar/AdminSidebar";
import DirectorSidebar from "./Sidebar/DirectorSidebar";
import TeamleadSidebar from "./Sidebar/TeamleadSidebar";
import Excecutivesidebar from "./Sidebar/ExcecutiveSidebar";
import AdminLead from "./components/AdminLead";
import Deals from "./components/Deals/Deals";
import ImportData from "./components/Tools/ImportData";
import Leads from "./components/Leads/Leads";
import DirectorLead from "./components/DirectorLead";




function App() {
  const isLoggedIn = window.localStorage.getItem("loggedIn") === "true";
  const userType = window.localStorage.getItem("userType");
  const userId = window.localStorage.getItem("userId");
 

  return (
    <Router>
      <div className="App">
      {userType === "Admin" && (
          <>
            <Adminsidebar /> 
            <UserDetails /> 
            
          </>
        )}
          {userType === "User" && (
          <>
            <DirectorSidebar /> 
            <UserDetails /> 
          </>
        )}
  {userType === "SubUser" && (
          <>
            <TeamleadSidebar/> 
            <UserDetails /> 
          </>
        )}
          {userType === "Executive" && (
          <>
            <Excecutivesidebar/> 
            <UserDetails /> 
          </>
        )}

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
            
              <Route element={<ProtectedRoute />}>
                {userType === "Admin" && (
                  <>
                  <Route path="/" element={<Navigate to={`/admin-dashboard/${userId}`} />} />
                    <Route path="/admin-dashboard/:userId" element={<AdminHome />} />
                    <Route path="/adminleads/:userId" element={<AdminLead/>} />
                    <Route path="/leads/:userId" element={<Leads/>}/>
                    <Route path="/dir1leads/:userId" element={<DirectorLead1 />} />
                    <Route path="/adddeals" element={<Deals/>} />
                    <Route path="/toolsimport" element={<ImportData/>} />
                  
                  </>
                )}
                
                {userType === "User" && (
                  <>
                    <Route path="/" element={<Navigate to={`/directorhome/${userId}`} />} />
                    <Route path="/directorhome/:userId" element={<UserHome />} />
                    <Route path="/dir-dashboard" element={<DirectorDashboard />} />
                    <Route path="/dir1leads/:userId" element={<DirectorLead1 />} />
                    <Route path="/dirlead/:userId" element={<DirectorLead/>}/>
                  </>
                )}

                {userType === "SubUser" && (
                  <>
                    <Route path="/" element={<Navigate to={`/subuserhome/${userId}`} />} />
                    <Route path="/subuserhome/:userId" element={<SubUserHome />} />
                    <Route path="/teamlead1/:userId" element={<Teamlead1 />} />
                  </>
                )}

                {userType === "Executive" && (
                  <>
                    <Route path="/" element={<Navigate to={`/executivehome/${userId}`} />} />
                    <Route path="/executivehome/:userId" element={<ExecutiveHome />} />
                    <Route path="/executivelead1/:userId" element={<ExecutiveLead1 />} />
                  </>
                )}

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
