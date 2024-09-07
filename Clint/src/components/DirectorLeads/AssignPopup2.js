import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AssignPopup2 = ({ leadId, setIsAssignLead, deals, setDeals, assignedTo }) => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const usersResponse = await axios.get(`${process.env.REACT_APP_PORT}/getAllUser`);
                if (usersResponse.data.status === "ok") {
                    // Filter users where userType is 'SubUser' and user.key matches assignedTo
                    const matchingUsers = usersResponse.data.data.filter(user => 
                        user.userType === 'SubUser' && user.key === assignedTo
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
            alert(`Assigned successfully to: ${user.key1}`);
            const response = await axios.put(`${process.env.REACT_APP_PORT}/leads/move/${leadId}`, {
                assignedto: `${user.key1}`
            });

            if (response.status === 200 && response.data.status === "ok") {
                const updatedDeals = deals.map((deal) =>
                    deal.id === leadId ? { ...deal, assignedto: `${user.key1}` } : deal
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

    return (
        <div className='container'>
            <h2>Assign</h2>
            <div className='p-3'>
                {isLoading ? (
                    <p>Loading...</p>
                ) : users.length > 0 ? (
                    users.map((user) => (
                        <div key={user.key1} className='d-flex justify-content-between'>
                            <p>Name: {user.key1}</p>
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
};

export default AssignPopup2;
