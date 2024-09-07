import React, { useState } from 'react';
import './Deals.css';
import { FaUser } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa6";
import axios from 'axios';

const AddDeals = () => {
  const [formData, setFormData] = useState({
    name: '',
    organization: '', 
    title: '', 
    value: '', 
    date: '', 
    owner: '', 
    visibleto: '', 
    persontitle: '', 
    contactperson: '', 
    email: '', 
    phone: '', 
    work1: '', 
    work2: ''
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
      const response = await axios.post(`${process.env.REACT_APP_PORT}/leads/deals`, formData); 
      console.log('Deal created:', response.data);
     
      setFormData({
        name: '',
        organization: '', 
        title: '', 
        value: '', 
        date: '', 
        owner: '', 
        visibleto: '', 
        persontitle: '', 
        contactperson: '', 
        email: '', 
        phone: '', 
        work1: '', 
        work2: ''
      });
    } catch (error) {
      console.error('Error creating deal:', error);
    }
  };

  return (
    <div className='container fluid'>
      <form onSubmit={handleSubmit}>
        <div className='row'>
          <div className='col-6 dealform1'>
            <div className="form-group">
              <label className='label_text'>Contact person</label><br />
              <div className='contact_field d-flex align-items-center'>
                <FaUser />
                <input
                  type="text"
                  className="input_field2 ps-2"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className='label_text'>Organization</label>
              <div className='contact_field d-flex align-items-center'>
                <FaBuilding />
                <input
                  type="text"
                  className="input_field2 ps-2"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className='label_text'>Title</label>
              <input
                type="text"
                className="input_field"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className='label_text'>Value</label>
              <div className='d-flex justify-content-between'>
                <input
                  type="text"
                  className="value_input_field"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                />
                <input
                  className="value_input_field"
                  placeholder="Indian rupee"
                  disabled
                />
              </div>
              <div className='d-flex align-items-end justify-content-end'>
                <label className='label_addtxt'>Add products</label>
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
                <option value="Real estate">Real estate</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </select>
            </div>

            <div className="form-group">
              <label className='label_text'>Pipeline stage</label>
              <div className='stages-container'>
                <div className='stage1'></div>
                <div className='stage2'></div>
                <div className='stage2'></div>
                <div className='stage3'></div>
              </div>
            </div>

            <div className="form-group">
              <label className='label_text mt-3'>Label</label>
              <select
                className="input_field"
                name="label"
                value={formData.label}
                onChange={handleChange}
              >
                <option value="Add Label">Add Label</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </select>
            </div>

            <div className="form-group">
              <label className='label_text'>Expected close date</label>
              <input
                type="date"
                className="input_field pe-2"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className='label_text'>Owner</label>
              <input
                type="text"
                className="input_field"
                placeholder="Gaurav Tonger (YOU)"
                name="owner"
                value={formData.owner}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className='label_text'>Visible to</label>
              <select
                className="input_field"
                name="visibleto"
                value={formData.visibleto}
                onChange={handleChange}
              >
                <option value="Directors">Directors</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </select>
            </div>
          </div>

          <div className='col-6 dealform2'>
            <div className='d-flex'>
              <h4 className='persontxt'>PERSON</h4>
              <div className='greyline'></div>
            </div>

            <div className='sticky_div'>
              <div className="form-group">
                <label className='label_text'>Title</label>
                <div className='d-flex justify-content-between'>
                  <input
                    type="text"
                    className="value_input_field"
                    placeholder=""
                    name="persontitle"
                    value={formData.persontitle}
                    onChange={handleChange}
                  />
                  <select
                    className="value_input_field"
                    name="work1"
                    value={formData.work1}
                    onChange={handleChange}
                  >
                    <option value="Work">Work</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                  </select>
                </div>
                <label className='label_bottomtxt'> + Add Phone</label>
              </div>

              <div className="form-group">
                <label className='label_text mt-3'>Contact person</label>
                <div className='d-flex justify-content-between'>
                  <input
                    type="text"
                    className="value_input_field"
                    name="contactperson"
                    value={formData.contactperson}
                    onChange={handleChange}
                  />
                  <select
                    className="value_input_field"
                    name="work2"
                    value={formData.work2}
                    onChange={handleChange}
                  >
                    <option value="Work">Work</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                  </select>
                </div>
                <label className='label_bottomtxt'> + Add Email</label>
              </div>
            </div>
          </div>

          <div className='bottomdeal_div'>
            <button className='cancel_btn me-2' type="button">Cancel</button>
            <button className='save_btn' type="submit">Save</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddDeals;
