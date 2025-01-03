import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewFollowups = ({ leadId , leadData}) => {
    const [updates, setUpdates] = useState([]);

    useEffect(() => {   
        const fetchLeadData = async () => {
          try {
            const response = await axios.get(`${process.env.REACT_APP_PORT}/leads/${leadId}`);
            setUpdates(response.data.updates); 
            console.log(response)
          } catch (error) {
            console.error('Error fetching lead data:', error);
          }
        };
        fetchLeadData();
      }, [leadId]);
  return (
    <div className='container fluid'>
        <div className='row'>
            <div className='col-12'>
      <h2>view followups</h2>
     
      {updates.length > 0 ? (
        <ul>
          {updates.map((update, index) => (
            <li key={index}>
              <p>Status: {update.status}</p>
              <p>Contact Person 1: {update.contactperson1}</p>
              <p>Budget: {update.budget}</p>
              <p>Pipeline: {update.pipeline}</p>
              <p>Property: {update.property}</p>
              <p>Contact Person 2: {update.contactperson2}</p>
              <p>Contact Number: {update.contactnumber}</p>
              <p>Comment: {update.comment}</p>
              <p>Callback Time: {update.callbackTime}</p>
              <p>Callback Date: {update.callbackDate}</p>
              <p>Reason to change status: {update.reason}</p>
              <hr />
            </li>
          ))}
        </ul>
      ) : (
        <p>No follow-ups available</p>
      )}
      </div>
    </div>
    </div>
  )
}

export default ViewFollowups
