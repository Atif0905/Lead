import React, { useState } from 'react';
import '../Dashboard.css';

const UserDetailPopup1 = ({ onClose, selectUser,  subUsers, leads, executives }) => {
    const [matchingSubUsers, setMatchingSubUsers] = useState([]);
    const [matchedExecutives, setMatchedExecutives] = useState([]);
    const handleClick = (selectUser) => {
    
      const matchedSubUsers = Array.isArray(subUsers)
        ? subUsers.filter(subUser => subUser.key === selectUser.key)
        : [];
  
      
      const subUserDetails = matchedSubUsers.map(subUser => {
       
        const assignedLeads = Array.isArray(leads)
          ? leads.filter(lead => {
              return lead.assignedto === subUser.key1;
            })
          : [];
  
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
     
      const matchedExecutivesList = executives.filter(exec => exec.key === subUser.key1);
      
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
    <div className="user-popup">
      <div className="user-popup-content">
        <h4>User's Details</h4>
        {selectUser ? (
          <div>
            <p onClick={() => handleClick(selectUser)}>Name: {selectUser.fname} {selectUser.lname}</p>
            <p>Total number of Leads: {selectUser.count}</p> 
          </div>
        ) : (
          <p className="no-user">No user selected</p>
        )}

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
  )
}

export default UserDetailPopup1