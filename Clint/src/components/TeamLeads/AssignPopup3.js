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
                   // Fetching all users from the API
                const usersResponse = await axios.get(`${process.env.REACT_APP_PORT}/getAllUser`);
                if (usersResponse.data.status === "ok") {
                  // Filter users by 'Executive' userType and matching key with assignedTo
                    const matchingUsers = usersResponse.data.data.filter(user => 
                        user.userType === 'Executive' && user.key === assignedTo
                    );
                    setUsers(matchingUsers); // Store the filtered users
                } else {
                    console.error("Failed to fetch users:", usersResponse.data.message);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData(); // Call the fetchData function
    }, [assignedTo]); // Effect will re-run when assignedTo changes

    const handleAssign = async (user) => {
        try {
            alert(`Assigned successfully to: ${user.fname}`);
            const response = await axios.put(`${process.env.REACT_APP_PORT}/leads/move/${leadId}`, {
                assignedto: `${user.id}`  // Pass the selected user's ID
            });

            if (response.status === 200) {
                const updatedDeals = deals.map((deal) =>
                    deal.id === leadId ? { ...deal, assignedto: `${user.id}` } : deal
                );
                dispatch(setDeals(updatedDeals));  // Dispatch updated deals list to Redux
                dispatch(setIsAssignLead(false));
                alert(`Assigned successfully to: ${user.fname} ${user.lname}`);
                window.location.reload();
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
  