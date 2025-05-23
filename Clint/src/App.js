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
import DirectorLead1 from "./components/DirectorLeads/DirectorLead1";
import SubUserHome from "./components/subUserHome";
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
import LeadCreatedEdit from "./components/Dashboard/AdminDashboard/LeadCreatedEdit";
import DirectorDashboard from "./components/Dashboard/DirectorDashboard/DirectorDashboard";
import LeadCreated1 from "./components/Dashboard/DirectorDashboard/LeadCreated1";
import LeadCreated2 from "./components/Dashboard/SubuserDashboard/LeadCreated2";
import AdminActivity from "./components/adminActivity";
import LeadCreated3 from "./components/Dashboard/ExecutiveDashboard/LeadCreated3";
import TeamLead from "./components/TeamLead";
import Teamlead1 from "./components/TeamLeads/Teamlead1";
import ExecutiveLead from "./components/ExecutiveLead";
import PopupNotification from "./components/ExecutiveLead/PopupNotification";

function App() {
  const isLoggedIn = window.localStorage.getItem("loggedIn") === "true";
  const userType = window.localStorage.getItem("userType");
  const userId = window.localStorage.getItem("userId");

  return (
    <Router>
      <div className="App">
      {userType === "Admin" && (
          <>
           <UserDetails /> 
            <Adminsidebar /> 
          </>
        )}
          {userType === "User" && (
          <>
            <UserDetails /> 
            <DirectorSidebar /> 
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
            <UserDetails /> 
            <Excecutivesidebar/> 
       
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
                    <Route path="/teamlead/:userId" element={<Teamlead1/>} />
                    <Route path="/executiveleads/:userId" element={<ExecutiveLead1/>}/>
                    <Route path="/adddeals" element={<Deals/>} />
                    <Route path="/toolsimport" element={<ImportData/>} />
                  <Route path="/leadcreatededit" element={<LeadCreatedEdit/>} />
                  <Route path="/scheduleactivity" element={<AdminActivity/>} />
                  </>
                )}
                
                {userType === "User" && (
                  <>
                    <Route path="/" element={<Navigate to={`/directorhome/${userId}`} />} />
                    <Route path="/directorhome/:userId" element={<UserHome />} />
                    <Route path="/dir-dashboard" element={<DirectorDashboard/>} />
                    <Route path="/dir1leads/:userId" element={<DirectorLead1 />} />
                    <Route path="/teamlead/:userId" element={<Teamlead1/>} />
                    <Route path="/executiveleads/:userId" element={<ExecutiveLead1/>}/>
                    <Route path="/dirlead/:userId" element={<DirectorLead/>}/>
                    <Route path="/leadcreatededit1/:userId" element={<LeadCreated1/>} />
                  </>
                )}
                
                {userType === "SubUser" && (
                  <>
                    <Route path="/" element={<Navigate to={`/subuserhome/${userId}`} />} />
                    <Route path="/subuserhome/:userId" element={<SubUserHome />} />
                    <Route path="/teamlead1/:userId" element={<TeamLead />} />
                    <Route path="/teamlead/:userId" element={<Teamlead1/>} />
                    <Route path="/dir1leads/:userId" element={<DirectorLead1 />} />
                     <Route path="/executiveleads/:userId" element={<ExecutiveLead1/>}/>
                    <Route path="/leadcreatededit2/:userId" element={<LeadCreated2 />} />
                  </>
                )}

                {userType === "Executive" && (
                  <>
                    <Route path="/" element={<Navigate to={`/executivehome/${userId}`} />} />
                    <Route path="/executivehome/:userId" element={<ExecutiveHome />} />
                    <Route path="/executivelead1/:userId" element={<ExecutiveLead/>} />
                    <Route path="/teamlead/:userId" element={<Teamlead1/>} />
                    <Route path="/executiveleads/:userId" element={<ExecutiveLead1/>}/>
                    <Route path="/leadcreatededit3/:userId" element={<LeadCreated3 />} />
                    <Route path="/dir1leads/:userId" element={<DirectorLead1 />} />
                  
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
