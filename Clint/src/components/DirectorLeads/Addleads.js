import React, { useState } from 'react';
import { useSelector } from 'react-redux'; // Import useSelector
import axios from 'axios';
import '../Leads/Deals.css';

const Addleads = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    status: '',
    title: '',
    assignedto: ''
  });

  // Get stages from Redux store
  const stages = useSelector((state) => state.stages); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_PORT}/leads/create`, formData); 
      console.log('Lead created:', response.data);
     
      setFormData({
        name: '',
        email: '',
        number: '',
        status: '',
        title: '',
        assignedto: ''
      });
    } catch (error) {
      console.error('Error creating lead:', error);
    }
  };

  return (
    <div className='container'>
      <div className='formcontainer'>
        <form onSubmit={handleSubmit} className='p-2'>
          <input
            className='input_assign mt-1'
            type="text"
            name="name"
            placeholder='Name'
            value={formData.name}
            onChange={handleChange}
          /><br/>
          <input
            className='input_assign mt-2'
            type="email"
            name="email"
            placeholder='Email'
            value={formData.email}
            onChange={handleChange}
          /><br/>
          <input
            className='input_assign mt-2'
            type="tel"
            name="number"
            placeholder='Number'
            value={formData.number}
            onChange={handleChange}
          /><br/>
          
          <select
            className='input_assign mt-2'
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="">Status</option>
            {stages.map((stage, index) => (
              <option key={index} value={stage}>{stage}</option>
            ))}
          </select><br/>

          <input
            className='input_assign mt-2'
            type="text"
            name="title"
            placeholder='Title'
            value={formData.title}
            onChange={handleChange}
          /><br/>
          <input
            className='input_assign mt-2'
            type="text"
            name="assignedto"
            placeholder='Assignedto'
            value={formData.assignedto}
            onChange={handleChange}
          /><br/>
          <button type="submit" className="save_btn mt-2">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Addleads;
