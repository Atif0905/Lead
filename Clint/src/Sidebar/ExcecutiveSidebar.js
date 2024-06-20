import './Sidebar.css';
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
const Excecutivesidebar = () => {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUserType, setSelectedUserType] = useState("Executive");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
    };
    useEffect(() => {
        getAllUser();
      }, [searchQuery, selectedUserType]);
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
      const logOut = () => {
        window.localStorage.clear();
        window.location.href = "./login";
      };
  return (
    <div>
    <div className="sidebarabovediv">
    <div className='d-flex justify-content-end'>

      <div className='dropdown ' onClick={toggleDropdown}>
        <p className='sidebarusername' >A N </p>
        {isDropdownOpen && (
          <div className='dropdown-menu'>

              <div  className='dropdown-item1'>
                <button onClick={logOut} className="btn btn-primary ">
            Log Out
          </button>
              </div>
          </div>
        )}
      </div>
        </div>
    </div>
    <div className='excecutiveside'>
        <img src='./grouplogo.webp' className='sidebarlogo mb-3' alt=''/>
            <div className="d-flex sideanchor "><img src="./dashboardicon.webp" className="sidebaricon" alt="icon"/><li className=''>Dashboard</li></div>
            <div className="d-flex sideanchor"><img src="./projectsicon.webp" className="sidebaricon" alt="icon"/><li>Project</li></div>
            <div className="d-flex sideanchor"><img src="./dashboardicon.webp" className="sidebaricon" alt="icon"/><li>Dashboard</li></div>
            <div className="d-flex sideanchor"><img src="./projectsicon.webp" className="sidebaricon" alt="icon"/><li>Project</li></div>
            <div className="d-flex sideanchor"><img src="./dashboardicon.webp" className="sidebaricon" alt="icon"/><li>Dashboard</li></div>
            <div className="d-flex sideanchor"><img src="./projectsicon.webp" className="sidebaricon" alt="icon"/><li>Project</li></div>
            <div className="d-flex sideanchor"><img src="./dashboardicon.webp" className="sidebaricon" alt="icon"/><li>Dashboard</li></div>
            <div className="d-flex sideanchor"><img src="./projectsicon.webp" className="sidebaricon" alt="icon"/><li>Project</li></div>
    </div>
    </div>
  )
}

export default Excecutivesidebar