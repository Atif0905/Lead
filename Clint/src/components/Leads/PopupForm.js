import React, { useState} from 'react';

const PopupForm = ({ deal, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        reason: deal.newReason || '' ,
        status: deal.newStatus || '' // Pre-fill with the dropped stage status
      });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data Submitted:', formData);
        onSubmit(formData);
      };
  
    return (
      <div className="popup-form-overlay">
        <div className="popup-form">
        <h5>Update Deal:{deal.name}</h5>
          <form onSubmit={handleSubmit}>
          <label>
          Status:
          </label>
          <input
            type="text"
            name="status"
            value={formData.status}
            readOnly 
          />
      
        <label>
          Reason:
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
          />
    <br/>
          <button type="submit">Submit</button>
          <button type="button" onClick={onClose}>Cancel</button>
          </form>
        </div>
      </div>
    );
  };
  

export default PopupForm
