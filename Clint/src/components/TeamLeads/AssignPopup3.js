import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';

const AssignPopup3 = ({ leadId, setIsAssignLead, deals, setDeals, assignedTo }) => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const usersResponse = await axios.get(`${process.env.REACT_APP_PORT}/getAllUser`);
                if (usersResponse.data.status === "ok") {
                  
                    const matchingUsers = usersResponse.data.data.filter(user => 
                        user.userType === 'Executive' && user.key === assignedTo
                    );
                    setUsers(matchingUsers);
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
    }, [assignedTo]);

    const handleAssign = async (user) => {
        try {
            alert(`Assigned successfully to: ${user.fname}`);
            const response = await axios.put(`${process.env.REACT_APP_PORT}/leads/move/${leadId}`, {
                assignedto: `${user.id}`
            });

            if (response.status === 200) {
                const updatedDeals = deals.map((deal) =>
                    deal.id === leadId ? { ...deal, assignedto: `${user.id}` } : deal
                );
                dispatch(setDeals(updatedDeals));
                dispatch(setIsAssignLead(false));
            } else {
                console.error("Failed to update lead:", response.data);
                alert(`Failed to assign: ${response.data.message || 'Unknown error occurred'}`);
            }
        } catch (error) {
            console.error('Error updating lead:', error);
            if (error.response) {
              console.error('Error response:', error.response.data);
            }
            alert('An error occurred while assigning the lead.');
          } finally {
            dispatch(setIsAssignLead(false)); 
          }
        };  
   

    return (
        <div className='container'>
            <h2>Assign</h2>
            <div className='p-3'>
                {isLoading ? (
                    <p>Loading...</p>
                ) : users.length > 0 ? (
                    users.map((user) => (
                        <div key={user.key} className='d-flex justify-content-between'>
                            <p>Name: {user.fname} {user.lname}</p>
                            <div>
                                <button 
                                    className='assign_button'
                                    onClick={async () => {
                                        await handleAssign(user);
                                    }}>
                                    Assign to
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No matching SubUsers found.</p>
                )}
            </div>
        </div>
    );
}

export default AssignPopup3;
  