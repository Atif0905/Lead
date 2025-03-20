import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
  setUsers, setLeads, setTotalLeads, setSubUsers,
} from '../../../redux/actions';

const LeadCreated2 = () => {
    const { userId } = useParams(); // Get the `userId` parameter from the URL
    const [currentUser, setCurrentUser] = useState(null);  // Store the details of the current user
    
    const dispatch = useDispatch();
  
    const {
      subUsers, users, leads, totalLeads,
    } = useSelector((state) => state);
  
    useEffect(() => {
      // Fetch users and leads when the component mounts or `userId` changes
      const fetchUserAndLeads = async () => {
        try {
          const usersResponse = await axios.get(`${process.env.REACT_APP_PORT}/getAllUser`);
          if (usersResponse.data.status === 'ok') {
            const usersData = usersResponse.data.data; // Extract user data from response
            dispatch(setUsers(usersData));
            // Find the current user based on the `userId` from the URL
            const currentUser = usersData.find(user => user._id === userId);
            setCurrentUser(currentUser);
            const currentUserKey = currentUser?.key1;  // Extract the `key1` of the current user
            // console.log(currentUserKey)
  
            const leadsResponse = await axios.get(`${process.env.REACT_APP_PORT}/leads`);
            const allLeads = leadsResponse.data;
            // Filter users who are executives under the current user's key
            const filteredSubUsers = usersData.filter(user => user.key === currentUserKey && user.userType === 'Executive');
            dispatch(setSubUsers(filteredSubUsers));
            dispatch(setLeads(allLeads));
  
          } else {
            console.error('Error fetching users: ', usersResponse.data.message);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchUserAndLeads();  // Call the data fetching function
    }, [userId, dispatch]);
  
  return (
    <div className='main-content p-3'>
      {currentUser ? (
        <div>
          <p>{currentUser.fname} {currentUser.lname}</p>
          {subUsers.length > 0 && (
            <div>
              <h3>Executive Names:</h3>
              {subUsers.map((user, index) => {
                const assignedLeads = leads.filter(lead => lead.assignedto === user.id);
                return (
                  <div key={index}>
                    <p >
                      {user.fname} {user.lname}: {assignedLeads.length} leads
                    </p>
                  </div>
                );
              })}
             
            </div>
          )}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  )
}

export default LeadCreated2