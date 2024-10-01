import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AssignPopup = ({ leadId, setIsAssignLead, deals, setDeals }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [assignedDirector, setAssignedDirector] = useState(null);

  useEffect(() => {
   

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const usersResponse = await axios.get(`${process.env.REACT_APP_PORT}/getAllUser`);
        if (usersResponse.data.status === "ok") {
          const directors = usersResponse.data.data.filter(user => user.userType === 'User');
          setUsers(directors);
          console.log('Directors:', directors);
        } else {
          console.error("Failed to fetch users:", usersResponse.data.message);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [leadId]);

  const handleAssign = async (user) => {
    console.log('Assigning lead ID:', leadId, 'to user:', `${user.key}`);
  
    try {
      alert(`Assigned successfully to: ${user.key}`);
      const response = await axios.put(`${process.env.REACT_APP_PORT}/leads/move/${leadId}`, {
        assignedto: `${user.key}`
      });
  
      console.log('API response:', response);
  
      if (response.status === 200 && response.data.status === "ok") {
        setAssignedDirector(`${user.key}`);
  
        const updatedDeals = deals.map((deal) =>
          deal.id === leadId ? { ...deal, assignedto: `${user.key}` } : deal
        );
        setDeals(updatedDeals);  // This updates the deals array and re-renders the components
        setIsAssignLead(false);   // Close the popup
      } else {
        console.error("Failed to update lead:", response.data);
        alert(`Failed to assign: ${response.data.message || 'Unknown error occurred'}`);
      }
    } catch (error) {
      console.error('Error updating lead:', error);
      alert('An error occurred while assigning the lead.');
    }
  };

  return (
    <div className='container'>
      <h2>Assign</h2>
      <div className='p-3'>
        {users.map((user) => (
          <div key={user.id} className='d-flex justify-content-between'>
            <p>Name: {user.key}</p>
            <button 
              className='assign_button'  
              onClick={async () => {
                await handleAssign(user);
        setIsAssignLead(false);
         }} >
              Assign to
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignPopup;
