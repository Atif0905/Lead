import React from 'react';
import './Deals.css'
import { FaUser } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa6";

const AddDeals = () => {
  return (
    <div className='container fluid'>
<div className='row'>
    <div className='col-6 dealform1 '>
        
    <form >
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
    <label className='label_text'>Title</label>
    <input type="text" className="input_field" placeholder=""/>
  </div>
  <div class="form-group">
    <label className='label_text'>Value</label>
    <div className='d-flex justify-content-between'>
    <input type="text" className="value_input_field" placeholder=""/>
    <select className="value_input_field " placeholder="Indian rupee">
    <option value="option1">Indian rupee</option>
  <option value="option2">option2</option>
  <option value="option3">option3</option>
      </select>
    </div>
    <div className='d-flex align-items-end justify-content-end'>
    <label className='label_addtxt'>Add products</label>
    </div>
  </div>
  <div class="form-group">
    <label className='label_text'>Pipeline</label>
    <select  className="input_field">
    <option  className="input_field" value="option1">Real estate</option>
  <option  className="input_field" value="option2">option2</option>
  <option  className="input_field" value="option3">option3</option>
      </select>
  </div>
  <div class="form-group">
    <label className='label_text'>Pipeline stage</label>
   <div className='stages-container'>
    <div className='stage1'>
    </div>
    <div className='stage2'>
    </div>
    <div className='stage2'>
    </div>
    <div className='stage3'>
    </div>
   </div>
  </div>
  <div class="form-group">
    <label className='label_text mt-3'>Label</label>
    <select  className="input_field">
    <option  className="input_field" value="option1">Add Label</option>
  <option  className="input_field" value="option2">option2</option>
  <option  className="input_field" value="option3">option3</option>
      </select>
  </div>
  <div class="form-group">
    <label className='label_text'>Expected close date</label>
    <input type="date" className="input_field pe-2" placeholder=""/>
  </div>
  <div class="form-group">
    <label className='label_text'>Owner</label>
    <input type="text" className="input_field" placeholder="Gaurav Tonger (YOU)"/>
  </div>
  <div class="form-group">
    <label className='label_text'>Visible to</label>
    <select  className="input_field">
    <option value="option1">Directors</option>
  <option value="option2">option2</option>
  <option value="option3">option3</option>
      </select>
  </div>
</form>

    </div>
    <div className='col-6 dealform2'>
    <div className='d-flex'>
    <h4 className='persontxt'>PERSON</h4>
    <div className='greyline'></div>
    </div>
    <form className=' sticky_div'>
  <div class="form-group">
    <label className='label_text'>Title</label>
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
    <label className='label_text mt-3'>Contact person</label>
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
</form>
    </div>
</div>
    </div>
  )
}

export default AddDeals