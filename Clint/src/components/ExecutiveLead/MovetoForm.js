import React, { useState } from 'react';
import '../Leads/Deals.css';
import axios from 'axios';

const MovetoForm = ({ deal, setIsFormVisible , onStatusUpdate }) => {
  const [stage, setStage] = useState("Select"); 
  const leadId = deal?.id; 

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    if (stage === "Select") {
      alert("Please select a stage.");
      return;
    }

    try {
      const response = await axios.put(`${process.env.REACT_APP_PORT}/leads/update/${leadId}`, {
        status: stage, 
      });
      console.log('Lead updated successfully:', response.data);
      onStatusUpdate(stage);
      setIsFormVisible(false);
    } catch (error) {
      console.error('Error updating lead:', error);
      alert('Failed to update the lead. Please try again.');
    }
  };

  return (
    <div className='btnpopup'>
      <div className='btnpopup_content'>
        <div className='p-4'>
          <h4>Move/Convert</h4>
       
          <div className='dealcardbtn'>
            <p className='deal_head3'>{deal?.text}</p>
            <p className='deal_head1'>{deal?.status}</p>
            <p className='deal_head2'>{deal?.assignedto}</p>
           
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='p-4'>
            <label className='mt-3 mb-2'>Stage</label>
            <select
              className="inputfield_btn ps-2"
              value={stage}
              onChange={(e) => setStage(e.target.value)} 
            >
              <option value="Select">Select</option>
              <option value="Lead In">Lead In</option>
              <option value="Contact Made">Contact Made</option>
              <option value="Switch Off">Switch Off</option>
              <option value="Wrong Number">Wrong Number</option>
              <option value="Call Back">Call Back</option>
              <option value="Interested">Interested</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Broker">Broker</option>
            </select>
          </div>
          <div className='marklost_div'>
            <button
              type='button'
              className='cancelbtn'
              onClick={() => setIsFormVisible(false)}
            >
              Cancel
            </button>
            <button type='submit' className='marksave_btn ms-3'>SAVE</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovetoForm;
