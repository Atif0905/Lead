import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';

const AssignPopup = ({ leadId, setIsAssignLead, deals, setDeals}) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const usersResponse = await axios.get(`${process.env.REACT_APP_PORT}/getAllUser`);
        if (usersResponse.data.status === "ok") {
          const directors = usersResponse.data.data.filter(user => user.userType === 'User');
          setUsers(directors);
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
    try {
      const response = await axios.put(`${process.env.REACT_APP_PORT}/leads/move/${leadId}`, {
        assignedto: `${user.key}`,
      });

      console.log(response.data);

      if (response.status === 200) {
        const updatedDeals = deals.map((deal) =>
          deal.id === leadId ? { ...deal, assignedto: `${user.key}` } : deal
        );
        dispatch(setDeals(updatedDeals));
        dispatch(setIsAssignLead(false)); 
        alert(`Assigned successfully to: ${user.fname} ${user.lname}`);
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
      setIsAssignLead(false); 
    }
  };
  return (
    <div className='container'>
      <h4>Assign</h4>
      <div className=''>
        {isLoading ? (
          <p>Loading users...</p>
        ) : (
          users.map((user) => (
            <div key={user.id} className='d-flex justify-content-between'>
              <p>Name: {user.fname} {user.lname}</p>
              <button
                className='assign_button'
                onClick={async () => {
                  await handleAssign(user);
           }} >
                Assign to
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AssignPopup;
