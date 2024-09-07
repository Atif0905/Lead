import React from 'react'
import './Deals.css'
import { FaUser } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa6";

const AddPerson = () => {
  return (
    <div className='container-fluid'>
        <div className='row'>
            <div className='col-12'>
                <form>
                <div class="form-group">
    <label className='label_text'>Contact person</label><br/>
    <div className='contact_field d-flex align-items-center'>
    <FaUser />
    <input type="text" className="input_field2 ps-2" placeholder=""/>
    </div>
    </div>
    <div class="form-group">
    <label className='label_text'>Organization</label>
    <div className='contact_field d-flex align-items-center'>
    <FaBuilding />
    <input type="text" className="input_field2 ps-2" placeholder=""/>
    </div>
  </div>
  <div class="form-group">
    <label className='label_text'>Phone</label>
    <div className='d-flex justify-content-between'>
    <input type="text" className="value_input_field" placeholder=""/>
    <select className="value_input_field ">
    <option  className="value_input_field" value="option1">Work</option>
  <option  className="value_input_field" value="option2">option2</option>
  <option  className="value_input_field" value="option3">option3</option>
      </select>
    </div>
    <label className='label_bottomtxt'> + Add Phone</label>
  </div>
  <div class="form-group">
    <label className='label_text'>Email</label>
    <div className='d-flex justify-content-between'>
    <input type="text" className="value_input_field" placeholder=""/>
    <select className="value_input_field ">
    <option  className="value_input_field" value="option1">Work</option>
  <option  className="value_input_field" value="option2">option2</option>
  <option  className="value_input_field" value="option3">option3</option>
      </select>
    </div>
    <label className='label_bottomtxt'> + Add Email</label>
  </div>
  <div class="form-group">
    <label className='label_text'>Owner</label>
    <select  className="input_field">
    <option value="option1">Gaurav Tonger (YOU)</option>
  <option value="option2">option2</option>
  <option value="option3">option3</option>
      </select>
  </div>
  <div class="form-group">
    <label className='label_text'>Label</label>
    <input type="text" className="input_field" placeholder="Add Label"/>
  </div>
  <div class="form-group">
    <label className='label_text'>Visible</label>
    <select  className="input_field">
    <option value="option1">Directors</option>
  <option value="option2">option2</option>
  <option value="option3">option3</option>
      </select>
  </div>
                    </form>          
                      </div>
        </div>

    </div>
  )
}

export default AddPerson