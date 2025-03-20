import React, { useState} from 'react';
import { useDispatch } from 'react-redux';
import './Deals.css';
import { FaUser } from "react-icons/fa";
import axios from 'axios';

const AddDeals = ({ leadId, setAddDealShow}) => {
  const dispatch = useDispatch();

  // Initializing formData to store form inputs.
  const [formData, setFormData] = useState({
    status: '',
    contactperson1: '', 
    budget: '', 
    pipeline: '', 
    property: '', 
    contactperson2: '', 
    contactnumber: '', 
    comment: '', 
    callbackTime: '',
    callbackDate: ''
  });
  // stageColor is used for styling pipeline stages dynamically.
  const [stageColor, setStageColor] = useState('');

   // handleChange updates formData based on user input and adjusts stageColor based on pipeline.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
      // Setting stageColor dynamically for visual pipeline representation.
    if (name === 'pipeline') {
      switch (value) {
        case 'Hot':
          setStageColor('hot');
          break;
        case 'Cold':
          setStageColor('cold');
          break;
        case 'Medium':
          setStageColor('medium');
          break;
        default:
          setStageColor('');
      }
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_PORT}/leads/${leadId}`, 
     formData);
      // console.log('Lead created:', response.data);
      // Resetting formData after successful submission.
      setFormData({
        status: '',
        contactperson1: '',
        budget: '',
        pipeline: '',
        property: '',
        contactperson2: '',
        contactnumber: '',
        comment: '',
        callbackTime: '',
        callbackDate: '',
      });
       // Closing the modal using Redux dispatch.
     dispatch(setAddDealShow(false));
    } catch (error) {
      console.error('Error creating lead:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className='container fluid'>
       {/* <h6>Lead id: {leadId}</h6> */}
      <form onSubmit={handleSubmit}>
        <div className='row'>
          <div className='col-6 dealform1'>
          <div className="form-group">
              <label className='label_text'>Stage</label><br />
                <select
                  className="input_field ps-2"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}>
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
            {formData.status === 'Call Back' && (
              <>
                <div className="form-group">
                  <label className="label_text">Callback Date</label><br />
                  <div className="contact_field d-flex align-items-center">
                    <input
                      type="date"
                      className="input_field2 ps-2"
                      name="callbackDate"
                      value={formData.callbackDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="label_text">Callback Time</label><br />
                  <div className="contact_field d-flex align-items-center">
                    <input
                      type="time"
                      className="input_field2 ps-2"
                      name="callbackTime"
                      value={formData.callbackTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </>
            )}
            <div className="form-group">
              <label className='label_text'>Contact person</label><br />
              <div className='contact_field d-flex align-items-center'>
                <FaUser />
                <input
                  type="text"
                  className="input_field2 ps-2"
                  name="contactperson1"
                  value={formData.contactperson1}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label className='label_text'>Budget</label>
              <div className='contact_field d-flex align-items-center'>
                
                <input
                  type="number"
                  className="input_field2 ps-2"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label className='label_text'>Pipeline</label>
              <select
                className="input_field"
                name="pipeline"
                value={formData.pipeline}
                onChange={handleChange}
              >
                <option value="Select">Select</option>
                <option value="Hot" >Hot</option>
                <option value="Cold">Cold</option>
                <option value="Medium">Medium</option>
              </select>
            </div>
            <div className="form-group">
              <label className='label_text'>Pipeline stage</label>
              <div className='stages-container'>
              <div className={`stage1 ${stageColor}`}></div>
                <div className={`stage2 ${stageColor}`}></div>
                <div className={`stage3 ${stageColor}`}></div>
                <div className={`stage4 ${stageColor}`}></div>
              </div>
            
            </div>
            <div className="form-group">
              <label className='label_text mt-3'>Invest In</label>
              <select
                className="input_field"
                name="property"
                value={formData.property}
                onChange={handleChange}
              >
                <option value="Property">Property</option>
                <option value="Option 2">Option 2</option>
                <option value="Option 3">Option 3</option>
              </select>
            </div>
            {/* <div className="form-group">
              <label className='label_text'>Username</label><br />
              <div className='contact_field d-flex align-items-center'>
                <input
                  type="text"
                  className="input_field2 ps-2"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div> */}
          </div>

          <div className='col-6 dealform2'>
          
              <h4 className='persontxt'>Additional Information </h4>
           
            <div className='sticky_div'>
            <div className="form-group">
              <label className='label_text'>Contact Person</label><br />
              <div className='contact_field d-flex align-items-center'>
              
                <input
                  type="text"
                  className="input_field2 ps-2"
                  name="contactperson2"
                  value={formData.contactperson2}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className='label_text'>Contact Number</label><br />
              <div className='contact_field d-flex align-items-center'>
              
                <input
                  type="number"
                  className="input_field2 ps-2"
                  name="contactnumber"
                  value={formData.contactnumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className='label_text'>Message</label><br />
              <div className='message_field d-flex align-items-center'>
              
                <textarea
                  type="text"
                  rows={5}
                  className="input_field2 ps-2"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                />
              </div>
            </div>
            </div>
          </div>

          <div className='bottomdeal_div'>
            <button className='cancel_btn me-2' type="button" onClick={() => dispatch(setAddDealShow(false))}>Cancel</button>
            <button className='save_btn' type="submit">Save</button>
          </div>
        </div>
      </form>
      
    </div>
  );
};

export default AddDeals;
