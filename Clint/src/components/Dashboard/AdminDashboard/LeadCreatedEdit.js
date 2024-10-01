import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import '../Dashboard.css';
import {
  setUsers, setSubUsers, setExecutives, setLeads
} from '../../../redux/actions';

const LeadCreatedEdit = () => {
  const [leadCountsByUser, setLeadCountsByUser] = useState([]);
  const [matchingSubUsers, setMatchingSubUsers] = useState([]);
  const [matchedExecutives, setMatchedExecutives] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Track the selected user
  const [selectedSubUser, setSelectedSubUser] = useState(null); // Track the selected sub-user

  const dispatch = useDispatch();

  const {
    subUsers, executives, users, leads
  } = useSelector((state) => state);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_PORT}/leads`);
        const leadsData = response.data;
        dispatch(setLeads(leadsData));

        const leadCountsByUser = users.filter(user => user.userType === 'User').map(user => {
          const count = leadsData.filter(lead => lead.assignedto === user.key).length;
          return { user, count };
        });
        setLeadCountsByUser(leadCountsByUser);
      } catch (error) {
        console.error(`Error fetching leads: ${error.message}`);
      }
    };

    const fetchUsers = async () => {
      try {
        const usersResponse = await axios.get(`${process.env.REACT_APP_PORT}/getAllUser`);
        if (usersResponse.data.status === 'ok') {
          const usersData = usersResponse.data.data;
          dispatch(setUsers(usersData));
          const subUsersData = usersData.filter(user => user.userType === 'SubUser');
          const executivesData = usersData.filter(user => user.userType === 'Executive');
          dispatch(setSubUsers(subUsersData));
          dispatch(setExecutives(executivesData));
        } else {
          console.error('Failed to fetch users:', usersResponse.data.message);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchLeads();
    fetchUsers();
  }, [dispatch, users]);

  const handleClick = (user) => {
    setSelectedUser(user); // Set the selected user
    setSelectedSubUser(null); // Reset the selected sub-user when a new user is clicked

    const matchedSubUsers = Array.isArray(subUsers)
      ? subUsers.filter(subUser => subUser.key === user.key)
      : [];

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

    setMatchingSubUsers(subUserDetails);
  };

  const handleSubUserClick = (subUser) => {
    setSelectedSubUser(subUser);

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
    <div className="p-3">
      <div className="main-content">
        <h4 className='mt-3 mb-4'>Lead Created by user Details</h4>

        {leadCountsByUser.map(({ user, count }) => (
          <div key={user._id}>
            <p className="user-names" onClick={() => handleClick(user)}>
              {user.fname} {user.lname}: {count} LEADS
            </p>
            {selectedUser && selectedUser._id === user._id && matchingSubUsers.length > 0 && (
              <div className="subuser-names">
                <h5>  {user.fname} {user.lname}'s Teamlead</h5>
                {matchingSubUsers.map((subUser, index) => (
                  <div key={index}>
                    <p className="subuser-name" onClick={() => handleSubUserClick(subUser)}>
                       {subUser.fname} {subUser.lname}: {subUser.leadCount} LEADS
                    </p>

                    {selectedSubUser && selectedSubUser.key1 === subUser.key1 && matchedExecutives.length > 0 && (
                      <div className="executive-details">
                        <h5>{subUser.fname} {subUser.lname}'s Executives</h5>
                        {matchedExecutives.map((exec, index) => (
                          <p key={index}>
                            {exec.fname} {exec.lname}: {exec.leadCount} LEADS
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

      </div>
    </div>
  );
};

export default LeadCreatedEdit;
