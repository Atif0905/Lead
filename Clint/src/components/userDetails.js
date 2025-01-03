import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; 
import axios from "axios";
import "../Sidebar/Sidebar.css";
import { CiSearch } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { MdMyLocation } from "react-icons/md";
import { FaEuroSign } from "react-icons/fa";
import { PiHashStraightFill } from "react-icons/pi";
import { BsPersonFillExclamation } from "react-icons/bs";
import { GoOrganization } from "react-icons/go";
import { BiSolidNotepad } from "react-icons/bi";
import { LiaBoxOpenSolid } from "react-icons/lia";
import AdminLead from "./AdminLead";

export default function UserDetails() {
  const [userData, setUserData] = useState(null);
  const [userType, setUserType] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [allUserData, setAllUserData] = useState(null);
  const [isAdminDashboard, setIsAdminDashboard] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const location = useLocation(); 

   // Mapping of paths to titles for navigation display
  const pathTitleMap = {
    "/admin-dashboard": "Admin Dashboard",
    "/adminleads": "Admin Leads",
    "/leads": "Leads Overview",
    "/dir1leads": "Director Leads",
    "/teamlead": "Leads",
    "/executiveleads": "Leads",
    "/adddeals": "Add Deals",
    "/toolsimport": "Import Data",
    "/leadcreatededit": "Edit Lead",
    "/scheduleactivity": "Schedule Activity",
    "/dirlead": "Leads",
    "/directorhome": "Dashboard"
  };

  const getBasePath = (path) => {
    const parts = path.split("/"); 
    return `/${parts[1]}`;
  };

  const currentPath = getBasePath(location.pathname);
  const currentTitle = pathTitleMap[currentPath];

   // Fetch user data and all user data for admin on component mount
  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      alert("Token expired, login again");
      window.localStorage.clear();
      window.location.href = "./login";
      return;
    }
 // Fetch user data using token
    axios
      .post(`${process.env.REACT_APP_PORT}/userData`, { token })
      .then((response) => {
        const data = response.data;
        if (data.data === "token expired") {
          alert("Token expired, login again");
          window.localStorage.clear();
          window.location.href = "./login";
        } else {
          setUserData(data.data);
          setUserType(data.data.userType);
          setIsLoading(false);
 // If user is admin, fetch data for all users
          if (data.data.userType === "Admin") {
            axios
              .get(`${process.env.REACT_APP_PORT}/allUserData`)
              .then((response) => setAllUserData(response.data))
              .catch((error) => console.error("Error fetching all user data:", error));
          }
        }
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  const toggleAdminDashboard = () => setIsAdminDashboard(!isAdminDashboard);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleNavDropdown = () => {
    setShowDropdown(!showDropdown);
  };
// Clear local storage and log out user
  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./login";
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
 // Get initials for the user's avatar
  const initials = userData ? `${userData.fname.charAt(0)}${userData.lname.charAt(0)}` : "";
 // Get background color based on user's initials
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

 // Get text color for contrasting against background color
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

  // Styling for the user dropdown avatar
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
    justifyContent: "center",
  };
  
   // Render navigation dropdown
  const renderDropdown = () => (
    <div className="sidebarabovediv">
      <div className="d-flex justify-content-between">
        <div className="navtitle_div mt-2">
        <h5 className="nav_title">{currentTitle}</h5>
          </div>
        <div className="d-flex mt-2">
          <div className="search_div">
          <CiSearch  className="search_icon ms-2" />
          <input className="searchfield" type="text" placeholder="Search"/>
          </div>
          <div className="plus_div ms-3" onClick={toggleNavDropdown }>
          <FaPlus className="plus_icon"  style={{ transform: showDropdown ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}/>
          {showDropdown && (
          <div className="dropdown_nav">
           <div className="nav_items mt-2">
           <MdMyLocation className="nav_icons"/>
           <p className="navitem_txt mb-1">Lead</p>
           </div>
           <div className="nav_items">
           <FaEuroSign className="nav_icons" />
           <p className="navitem_txt mb-1">Deals</p>
           </div>
           <div className=" nav_items">
           <PiHashStraightFill className="nav_icons"/>
           <p className="navitem_txt mb-1">Activity</p>
           </div>
           <div className=" nav_items">
           <BsPersonFillExclamation className="nav_icons"/>
           <p className="navitem_txt mb-1">Person</p>
           </div>
           <div className=" nav_items">
           <GoOrganization className="nav_icons"/>
           <p className="navitem_txt mb-1">Organization</p>
           </div>
           <div className=" nav_items">
           <BiSolidNotepad className="nav_icons"/>
           <p className="navitem_txt mb-1">Note</p>
           </div>
           <div className=" nav_items">
           <LiaBoxOpenSolid className="nav_icons"/>
           <p className="navitem_txt mb-1">Product</p>
           </div>
           </div>
        
        )}
          </div>
          </div>
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
     
      Leads: <AdminLead/>,
      // User: <UserHome userData={userData} />,
      // SubUser: <SubUserHome userData={userData} />,
      // Executive: <ExecutiveHome userData={userData} />
    };

    return (
      <>
        {renderDropdown()}
        {userHomeComponents[userType] || <div></div>}
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
