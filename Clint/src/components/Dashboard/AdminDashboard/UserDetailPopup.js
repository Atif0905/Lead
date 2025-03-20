import React, { useState } from 'react';
import '../Dashboard.css';

const UserDetailPopup = ({ onClose, selectUser,  subUsers, leads, executives }) => {
    // State to store the list of sub-users matching the selected user's key
  const [matchingSubUsers, setMatchingSubUsers] = useState([]);
   // State to store the list of executives matching the selected sub-user's key1
  const [matchedExecutives, setMatchedExecutives] = useState([]);
  const handleClick = (selectUser) => {
    // Filter sub-users whose key matches the selected user's key
    const matchedSubUsers = Array.isArray(subUsers)
      ? subUsers.filter(subUser => subUser.key === selectUser.key)
      : [];

     // Map over the matched sub-users to find their assigned leads
    const subUserDetails = matchedSubUsers.map(subUser => {
     
      const assignedLeads = Array.isArray(leads)
        ? leads.filter(lead => {
            return lead.assignedto === subUser.key1;
          })
        : [];
 // Return sub-user details including their assigned leads count
      return {
        fname: subUser.fname,
        lname: subUser.lname,
        leadCount: assignedLeads.length,
        key1: subUser.key1,
      };
    });

    setMatchingSubUsers(subUserDetails);
  };

  const handleSubUserClick = (subUser) => {
      // Filter executives whose key matches the sub-user's key1
    const matchedExecutivesList = executives.filter(exec => exec.key === subUser.key1);
     
    // Map over the matched executives to find their assigned leads
    const executivesDetails = matchedExecutivesList.map(exec => {
      const assignedLeads = Array.isArray(leads)
        ? leads.filter(lead => lead.assignedto === exec.fname)
        : [];
         // Return executive details including their assigned leads count
      return {
        fname: exec.fname,
        lname: exec.lname,
        leadCount: assignedLeads.length,
      };
    });
     // Update the state with matched executives' details
    setMatchedExecutives(executivesDetails);
  };


  return (
    <div className="user-popup">
      <div className="user-popup-content">
        <h4>User's Details</h4>
        {/* Display details of the selected user */}
        {selectUser ? (
          <div>
            <p onClick={() => handleClick(selectUser)}>Name: {selectUser.fname} {selectUser.lname}</p>
            <p>Total number of Leads: {selectUser.count}</p> 
          </div>
        ) : (
          <p className="no-user">No user selected</p>
        )}
  {/* Display matching sub-users and their details */}
         {matchingSubUsers.length > 0 && (
          <div className="subuser-names">
            <h5>{selectUser.fname}'s Teamleads</h5>
            {matchingSubUsers.map((subUser, index) => (
              <p key={index} className="subuser-name" onClick={() => handleSubUserClick(subUser)}>
                SubUser: {subUser.fname} {subUser.lname}: {subUser.leadCount} LEADS
              </p>
            ))}
          </div>
        )}
 {/* Display matched executives and their details */}
         {matchedExecutives.length > 0 && (
          <div className="executive-details">
            <h5> Executives:</h5>
            {matchedExecutives.map((exec, index) => (
              <p key={index}>
                {exec.fname} {exec.lname}: {exec.leadCount} LEADS
              </p>
            ))}
          </div>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default UserDetailPopup;
