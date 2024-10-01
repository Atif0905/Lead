import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
  setUsers, setLeads, setTotalLeads, setSubUsers,
} from '../../../redux/actions';

const LeadCreated1 = () => {
  const { userId } = useParams(); 
  const [currentUser, setCurrentUser] = useState(null);
  const [executiveNames, setExecutiveNames] = useState([]); // State for executive names
  
  const dispatch = useDispatch();

  const {
    subUsers, users, leads, totalLeads,
  } = useSelector((state) => state);

  useEffect(() => {
    const fetchUserAndLeads = async () => {
      try {
        const usersResponse = await axios.get(`${process.env.REACT_APP_PORT}/getAllUser`);
        if (usersResponse.data.status === 'ok') {
          const usersData = usersResponse.data.data;
          dispatch(setUsers(usersData));

          const currentUser = usersData.find(user => user._id === userId);
          setCurrentUser(currentUser);
          const currentUserKey = currentUser?.key;

          const leadsResponse = await axios.get(`${process.env.REACT_APP_PORT}/leads`);
          const allLeads = leadsResponse.data;

          const filteredSubUsers = usersData.filter(user => user.key === currentUserKey && user.userType === 'SubUser');
          dispatch(setSubUsers(filteredSubUsers));

          // Dispatch the leads to the store
          dispatch(setLeads(allLeads));

        } else {
          console.error('Error fetching users: ', usersResponse.data.message);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchUserAndLeads();
  }, [userId, dispatch]);

  const handleUserClick = (key1) => {
    const executives = users.filter(user => user.key === key1 && user.userType === 'Executive');
    setExecutiveNames(executives); // Store the executive objects
  };

  return (
    <div className='main-content p-3'>
      {currentUser ? (
        <div>
          <p>{currentUser.fname} {currentUser.lname}</p>
          {subUsers.length > 0 && (
            <div>
              <h3>Teamleads Names:</h3>
              {subUsers.map((user, index) => {
                const assignedLeads = leads.filter(lead => lead.assignedto === user.key1);
                return (
                  <div key={index}>
                    <p onClick={() => handleUserClick(user.key1)}>
                      {user.fname} {user.lname}: {assignedLeads.length} leads
                    </p>
                  </div>
                );
              })}
              {executiveNames.length > 0 && (
                <div>
                  <h4>Executives:</h4>
                  <ul>
                    {executiveNames.map((exec, idx) => {
                     
                      const assignedLeadsCount = leads.filter(lead => lead.assignedto === exec.fname).length;
                      return (
                        <li key={idx}>
                          {exec.fname}: {assignedLeadsCount} leads
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default LeadCreated1;
