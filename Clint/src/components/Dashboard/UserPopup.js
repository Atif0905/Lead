import React, { useState } from 'react';
import './Dashboard.css'

const UserPopup = ({ user, onClose, subUsers, executives  }) => {
    const [selectedExecutive, setSelectedExecutive] = useState(null);

    if (!user) return null;

    const matchingSubUsers = subUsers.filter(subUser => subUser.key === user.key);

    const handleSubUserClick = (subUser) => {
        const matchingExecutive = executives.find(executive => executive.key === subUser.key1);
        if (matchingExecutive) {
          setSelectedExecutive(matchingExecutive);
        }
      };
    
    return (
        <div className="user-popup">
          <div className="user-popup-content">
           
        {matchingSubUsers.length > 0 && (
                    <div>
                        <h3>User Details</h3>
                        {matchingSubUsers.map((subUser) => (
                            <>
                            <p key={subUser._id}onClick={() => handleSubUserClick(subUser)}>
                            <strong>Team Lead:</strong> {subUser.fname} {subUser.lname}</p>
                            </>
                        ))}
                    </div>
                )}
                 {selectedExecutive && (
          <div>
            <h4>Executive Details</h4>
            <p><strong>Executive Name:</strong> {selectedExecutive.fname} {selectedExecutive.lname}</p>
          </div>
        )}
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      );
    };

export default UserPopup