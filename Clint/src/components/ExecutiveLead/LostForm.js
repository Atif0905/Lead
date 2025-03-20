import React, { useState } from 'react';
import '../Leads/Deals.css';
import axios from 'axios';

const LostForm = ({ deal, setIsFormVisible , onUpdateDeal}) => {
  const leadId = deal?.id;  // Extract lead ID from the deal object

  const [formData, setFormData] = useState({
    status: 'Lost', 
    lostreason: '',
    lostcomment: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e)=> {
    e.preventDefault();

    try {
      const response = await axios.put(`${process.env.REACT_APP_PORT}/leads/update/${leadId}`, formData); 
      const updatedDeal = response.data;
      onUpdateDeal(updatedDeal);

      setFormData({
        status: 'Lost',
        lostreason: '',
        lostcomment: '',
      });
      setIsFormVisible(false);

    } catch (error) {
      console.error('Error updating lead:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className='btnpopup'>
      <div className='btnpopup_content'>
        <div className='p-4'>
          <h4>Mark as Lost</h4>
          <div className='dealcardbtn'>
            <p className='deal_head3'>{deal?.text}</p>
            <p className='deal_head1'>{deal?.status}</p>
            <p className='deal_head2'>{deal?.assignedto}</p>
           
          </div>
          <form onSubmit={handleSubmit}>
            <label className='mt-3 mb-2'>Lost reason</label>
            <input
              type="text"
              className="inputfield_btn ps-2"
              name="lostreason"
              value={formData.lostreason}  
              onChange={handleChange}
              required
            />

            <label className='mt-3 mb-2'>Comments</label>
            <textarea
              rows={3}
              type="text"
              className="inputfield2_btn ps-2"
              name="lostcomment"
              value={formData.lostcomment} 
              onChange={handleChange}
              required
            />
            <p>Manage lost reasons in Company</p>

            <div className='marklost_div'>
              <button className='cancelbtn' type="button" onClick={() => setIsFormVisible(false)}>Cancel</button>
              <button type='submit' className='marklost_btn ms-3'>MARK AS LOST</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LostForm;
