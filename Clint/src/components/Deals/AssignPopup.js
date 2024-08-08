import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AssignPopup = ({ leadId, setIsAssignLead, deals, setDeals }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [assignedDirector, setAssignedDirector] = useState(null);

  useEffect(() => {
    console.log('AssignPopup received leadId:', leadId); // Debug log
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const usersResponse = await axios.get(`http://localhost:5000/getAllUser`);
        if (usersResponse.data.status === "ok") {
          const directors = usersResponse.data.data.filter(user => user.userType === 'User');
          setUsers(directors);
          console.log(directors);
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
  }, [leadId]); // Ensure this effect runs when leadId changes

  const handleAssign = async (user) => {
    console.log('Assigning lead ID:', leadId, 'to user:', user.fname); // Debug log
  
    try {
      const response = await axios.put(`http://localhost:5000/leads/move/${leadId}`, {
        assignedto: user.fname // Use only the first name
      });
  
      if (response.data.status === "ok") {
        setAssignedDirector(user.fname); // Set only the first name
        alert(`Assigned to: ${user.fname}`);
  
        const updatedDeals = deals.map((deal) =>
          deal.id === leadId ? { ...deal, assignedto: user.fname } : deal
        );
        setDeals(updatedDeals);
        setIsAssignLead(false); // Close the popup
      } else {
        console.error("Failed to update lead:", response.data.message);
      }
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  return (
    <div className='container'>
      <h2>Assign</h2>
      <div className='p-3'>
        {users.map((user) => (
          <div key={user.id} className='d-flex justify-content-between'>
            <p>Name: {user.fname} {user.lname}</p>
            <button className='assign_button' onClick={() => handleAssign(user)}>
              Assign to
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AssignPopup;
