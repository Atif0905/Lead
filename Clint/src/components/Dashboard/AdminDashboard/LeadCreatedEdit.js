import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { fetchLeads, fetchUsers } from '../../api/Api'
import '../Dashboard.css';
import {setUsers, setSubUsers, setExecutives, setLeads} from '../../../redux/actions';
import { FaChartSimple } from "react-icons/fa6";
import { RiBarChartHorizontalFill } from "react-icons/ri";
import { RiPieChart2Fill } from "react-icons/ri";
import { PiHashFill } from "react-icons/pi";
import { BiBarChartAlt } from "react-icons/bi";
import { MdOutlineSettings } from "react-icons/md";
import { BsChevronDoubleDown } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";

const LeadCreatedEdit = () => {
  const [leadCountsByUser, setLeadCountsByUser] = useState([]);
  const [matchingSubUsers, setMatchingSubUsers] = useState([]);
  const [matchedExecutives, setMatchedExecutives] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); 
  const [selectedSubUser, setSelectedSubUser] = useState(null);

  const dispatch = useDispatch();
  const {
    subUsers, executives, users, leads
  } = useSelector((state) => state);

   useEffect(() => {
    // Fetch leads data
    const fetchLeadsData = async () => {
      try {
        const leadsData = await fetchLeads(); // Use the API function
        dispatch(setLeads(leadsData));
  // Calculate lead counts for users with `userType` as 'User
        const leadCountsByUser = users.filter(user => user.userType === 'User').map(user => {
          const count = leadsData.filter(lead => lead.assignedto === user.key).length;
          return { user, count };
        });
        setLeadCountsByUser(leadCountsByUser);
      } catch (error) {
        console.error(`Error fetching leads: ${error.message}`);
      }
    };

    // Fetch users data
    const fetchUsersData = async () => {
      try {
        const usersData = await fetchUsers(); // Use the API function
        dispatch(setUsers(usersData));
        // Filter sub-users and executives from the user data and store it in a state.
        const subUsersData = usersData.filter(user => user.userType === 'SubUser');
        const executivesData = usersData.filter(user => user.userType === 'Executive');
        dispatch(setSubUsers(subUsersData));
        dispatch(setExecutives(executivesData));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchLeadsData();
    fetchUsersData();
  }, [dispatch, users]);

  // Handle selection of a user
  const handleClick = (user) => {
    setSelectedUser(user); 
    setSelectedSubUser(null); 
 // Find sub-users whose `key` matches the selected user's `key`
    const matchedSubUsers = Array.isArray(subUsers)
      ? subUsers.filter(subUser => subUser.key === user.key)
      : [];
 // Map sub-users to include their lead counts
    const subUserDetails = matchedSubUsers.map(subUser => {
      const assignedLeads = Array.isArray(leads)
        ? leads.filter(lead => lead.assignedto === subUser.key1)
        : [];

      return {
        fname: subUser.fname,
        lname: subUser.lname,
        leadCount: assignedLeads.length,
        key1: subUser.key1,
      };
    });
    setMatchingSubUsers(subUserDetails); // Update state with sub-user details
  };

  const handleSubUserClick = (subUser) => {
    setSelectedSubUser(subUser);
// Find executives whose `key` matches the selected sub-user's `key1`
    const matchedExecutivesList = executives.filter(exec => exec.key === subUser.key1);
       // Map executives to include their lead count
    const executivesDetails = matchedExecutivesList.map(exec => {
      const assignedLeads = Array.isArray(leads)
        ? leads.filter(lead => lead.assignedto === exec.fname)
        : [];  
      return {
        fname: exec.fname,
        lname: exec.lname,
        leadCount: assignedLeads.length,
      };
    });

    setMatchedExecutives(executivesDetails);
  };

  return (
    <div className="main-content">
      <div className="dashboard_contentdiv ">
        
        <div className='d-flex justify-content-between'>
        <h4 className='create_head'>Leads created by users</h4>
        <div>
        <button className='users_btn_icon'>Discard Change</button>
        <button className='users_btn_icon ms-3'>Save As New</button>
        <button className='save_btn_icon ms-3'>Save</button>
        </div>
        </div>

        <div className='filter_div'>
<div className='lead_chartdiv'>
  <div className='d-flex justify-content-center align-items-center'>
<BsChevronDoubleDown />
<p className='filter_text1 mt-3 ms-2'>Filter Applied</p>
</div>
 <div className='d-flex justify-content-center align-items-center'>

<p className='filter_text1 mt-3'>No Applied</p>
<RxCross2 className='ms-2'/>
</div>
</div>
        </div>
        <div className='leadcreated_box'>
          <div className='d-flex lead_chartdiv'>
          <div className='d-flex'>
          <FaChartSimple className='bar_icons' />
          <RiBarChartHorizontalFill  className='ms-3 bar_icons'/>
          <RiPieChart2Fill  className='ms-3 bar_icons' />
          <PiHashFill  className='ms-3 bar_icons'/>
          <BiBarChartAlt  className='ms-3 bar_icons'/>
          </div>
          <div className='d-flex'>
            <button className='export_button'>Export </button>
            <div className='setting_div ms-3'>
              <MdOutlineSettings />
            </div>
          </div>
          </div>
          <div className='p-2 d-flex justify-content-between'>
            <div>
            <h5>Select a User</h5>
          <select onChange={(e) => handleClick (users.find(user => user._id === e.target.value))}>
            <option value="">User's</option>
            {leadCountsByUser.map(({ user }) => (
              <option key={user._id} value={user._id}>
                {user.fname} {user.lname}
              </option>
              
            ))}
          </select>

          {selectedUser && (
            <>
             <h6>{selectedUser.fname} {selectedUser.lname} - {leadCountsByUser.find(u => u.user._id === selectedUser._id)?.count} LEADS</h6>
              <h5>Team Leads</h5>
              <div className='team-leads-list'>
                {matchingSubUsers.length > 0 ? (
                  matchingSubUsers.map((subUser) => (
                    <div key={subUser.key1} className="team-lead" onClick={() => handleSubUserClick(subUser)}>
                      {subUser.fname} {subUser.lname} - {subUser.leadCount} LEADS
                    </div>
                  ))
                ) : (
                  <p>No team leads found for this user.</p>
                )}
              </div>
            </>
          )}

          {selectedSubUser && matchedExecutives.length > 0 && (
            <>
              <h5>Executives</h5>
              <div className='executives-list'>
                {matchedExecutives.map((exec, index) => (
                  <div key={index} className="executive">
                    {exec.fname} {exec.lname} - {exec.leadCount} LEADS
                  </div>
                ))}
              </div>
            </>
          )}
          
       </div>

     
        </div>
       </div>
       <div className='summary_div_box'>
      <button className='lead_btn'>Leads</button>
      <button className='ms-3 summry_btn'>Summary</button>
       </div>
      </div>
    </div>
  );
};

export default LeadCreatedEdit;
