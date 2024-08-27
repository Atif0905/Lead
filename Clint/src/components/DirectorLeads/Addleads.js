import React, { useState } from 'react';
import axios from 'axios';

const Addleads = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    status: '',
    title: '',
    assignedto: ''
  });

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
      // Optionally, display an error message
    }
  };

  return (
    <div className='container'>
      <h2>Assign</h2>
      <div className='p-3'>
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
          <input
            className='input_assign mt-2'
            type="text"
            name="status"
            placeholder='Status'
            value={formData.status}
            onChange={handleChange}
          /><br/>
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
          <button type="submit" className="mt-2">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Addleads;
