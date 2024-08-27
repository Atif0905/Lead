import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AssignPopup3 = ({ leadId, setIsAssignLead, deals, setDeals, assignedTo }) => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const usersResponse = await axios.get(`${process.env.REACT_APP_PORT}/getAllUser`);
                if (usersResponse.data.status === "ok") {
                    const executives = usersResponse.data.data.filter(user => user.userType === 'Executive');
                    setUsers(executives);
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
    }, []);

    const handleAssign = async (user) => {
        try {
            alert(`Assigned successfully to: ${user.fname} ${user.lname}`);
            const response = await axios.put(`${process.env.REACT_APP_PORT}/leads/move/${leadId}`, {
                assignedto: `${user.key}`
            });

            if (response.status === 200 && response.data.status === "ok") {
                // Update the deals state in the parent component
                const updatedDeals = deals.map((deal) =>
                    deal.id === leadId ? { ...deal, assignedto: `${user.key}` } : deal
                );
                setDeals(updatedDeals);
                setIsAssignLead(false);
            } else {
                console.error("Failed to update lead:", response.data);
                alert(`Failed to assign: ${response.data.message || 'Unknown error occurred'}`);
            }
        } catch (error) {
            console.error('Error updating lead:', error);
            alert('An error occurred while assigning the lead.');
        }
    };

    // Find the currently assigned user
    const currentAssignedUser = users.find(user => user.key === assignedTo);

    return (
        <div className='container'>
            <h2>Assign</h2>
            <div className='p-3'>
                <div className='d-flex justify-content-between'>
                    <p>Name: {currentAssignedUser ? `${currentAssignedUser.fname} ${currentAssignedUser.lname}` : 'None'}</p>
                    <div>
                        <button 
                            className='assign_button'  
                            onClick={async () => {
                                
                                    await handleAssign(currentAssignedUser);
                                
                                setIsAssignLead(false);
                            }}>
                            Assign to
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AssignPopup3;
  