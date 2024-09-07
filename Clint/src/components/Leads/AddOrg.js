import React from 'react'
import { FaUser } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa6";

const AddOrg = () => {
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
    <label className='label_text'>Address</label>
    <div className='contact_field d-flex align-items-center'>
    <FaBuilding />
    <input type="text" className="input_field2 ps-2" placeholder=""/>
    </div>
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
    <select  className="input_field">
    <option value="option1">Add Label</option>
  <option value="option2">option2</option>
  <option value="option3">option3</option>
      </select>
  </div>
 
  <div class="form-group">
    <label className='label_text'>Visible</label>
    <input type="text" className="input_field" placeholder="Directors"/>
  </div>
                    </form>          
                      </div>
        </div>

    </div>
  )
}

export default AddOrg