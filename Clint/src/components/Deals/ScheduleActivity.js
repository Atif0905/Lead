import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faPhone, faUtensils, faMinus, faCalendarDay, faCaretDown, faEllipsisH ,  faMoneyCheck, faFile, faCircleUser,  faLink  } from '@fortawesome/free-solid-svg-icons';
import { faFontAwesome } from '@fortawesome/free-brands-svg-icons';
import { HiOutlineInboxArrowDown } from "react-icons/hi2";
import { MdOutlineAddTask } from "react-icons/md";
import { FaClock } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaBuildingCircleArrowRight } from "react-icons/fa6";
import './Deals.css';

const ScheduleActivity = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [editItem, setEditItem] = useState(null); // Tracks which item is being edited
  const [location, setLocation] = useState('');
  const [videoCall, setVideoCall] = useState('');
  const [description, setDescription] = useState('');

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleEditClick = (item) => {
    setEditItem(item);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'location') setLocation(value);
    if (name === 'videoCall') setVideoCall(value);
    if (name === 'description') setDescription(value);
  };

  const handleBlur = () => {
    setEditItem(null);
  };

  return (
    <form>
      <div className='container p-3'>

          <div className='call_container mt-3'>
            <div></div>
            <div className='call_div'>
              <h4 className='call_txt'>Call</h4>
            </div>
            </div>
            <div className='icons_container'>
              <div className=''></div>
              <div className='d-flex justify-content-around icons_div'>
                <div className=' d-flex align-items-center'><FontAwesomeIcon className='icon_img' icon={faPhone} /></div>
                <div className='d-flex align-items-center'><FontAwesomeIcon className='icon_img' icon={faComments} /></div>
                <div className='d-flex align-items-center'><MdOutlineAddTask className='icon_img' /></div>
                <div className='d-flex align-items-center'><FontAwesomeIcon className='icon_img' icon={faFontAwesome} /></div>
                <div className='d-flex align-items-center'><HiOutlineInboxArrowDown className='icon_img'/></div>
                <div className='d-flex align-items-center'><FontAwesomeIcon className='icon_img' icon={faUtensils} /></div>
              </div>
            </div>
            <div className='mt-3 time_div'>
              <div className='d-flex align-items-center justify-content-center'>
                <FaClock className='clock_img'/>
                </div>
              <div className='date_div'>
                <input className='input_filed1' type="date" />
              </div>
              <div className='date_div'>
                <input className='input_filed1' type="time" />
              </div>
              <div><FontAwesomeIcon icon={faMinus} /></div>
              <div className='date_div'>
                <input className='input_filed1' type="time" />
              </div>
              <div className='date_div'>
                <input className='input_filed1' type="date" />
              </div>
            </div>
            <div className='mt-3 priority_div'>
              <div className='d-flex align-items-center justify-content-center'>
                <FontAwesomeIcon  className='clock_img' icon={faCalendarDay} />
                </div>
              <div className='prior_input d-flex align-items-center justify-content-around' onClick={toggleDropdown}>
                <p className='mb-0'>Priority</p>
                <FontAwesomeIcon icon={faCaretDown} />
              </div>
              {isDropdownOpen && (
                <div className='proirdown-menu'>
                  <button className='prior_item' onClick={() => setIsDropdownOpen(false)}>High</button>
                  <button className='prior_item' onClick={() => setIsDropdownOpen(false)}>Medium</button>
                  <button className='prior_item' onClick={() => setIsDropdownOpen(false)}>Low</button>
                </div>
              )}
            </div>
            <div className='mt-3 add_content d-flex align-items-center'>
              <div className='d-flex align-items-center justify-content-center'>
              <FontAwesomeIcon  className='clock_img' icon={faEllipsisH} />
              </div>
              <h5 className='ms-4'>Add</h5>
              <p className='ms-2 loctxt'>
                {editItem === 'location' ? (
                  <input
                    type='text'
                    name='location'
                    value={location}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder='Enter location'
                    className='location_input'
                  />
                ) : (
                  <span onClick={() => handleEditClick('location')} style={{ cursor: 'pointer' }}>
                    location,
                  </span>
                )}
              </p>
              <p className='ms-2 loctxt'>
                {editItem === 'videoCall' ? (
                  <input
                    type='text'
                    name='videoCall'
                    value={videoCall}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder='Enter video call details'
                    className='video_call_input'
                  />
                ) : (
                  <span onClick={() => handleEditClick('videoCall')} style={{ cursor: 'pointer' }}>
                    video call,
                  </span>
                )}
              </p>
              <p className='ms-2 loctxt'>
                {editItem === 'description' ? (
                  <input
                    type='text'
                    name='description'
                    value={description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder='Enter description'
                    className='description_input'
                  />
                ) : (
                  <span onClick={() => handleEditClick('description')} style={{ cursor: 'pointer' }}>
                    description
                  </span>
                )}
              </p>
            </div>
            <div className='mt-2 priority_div'>
              <div className='d-flex align-items-center justify-content-center'>
                <FontAwesomeIcon  className='clock_img' icon={faMoneyCheck} />
                </div>
              <div className='prior_input d-flex align-items-center justify-content-around' onClick={toggleDropdown}>
                <p className='mb-0'>Free</p>
                <FontAwesomeIcon icon={faCaretDown} />
              </div>
            </div>
            <div className=' mt-3  note_div'>
              <div className='d-flex justify-content-center'>
            <FontAwesomeIcon  className='clock_img' icon={faFile} /></div>
            <div>
            <textarea className='input_yellow' type='text'/>
            </div>
            </div>
            <label className='note_txt'>Notes are necessary. (Give reasons ) </label>
            <div className='mt-3 admin_div'>
              <div className='d-flex align-items-center justify-content-center'>
            <FontAwesomeIcon  className='clock_img' icon={faCircleUser} />
            </div>
            <div className='admin_input'>
            <p className='mb-0'>Gaurav Tongar (YOU)</p>
            <FontAwesomeIcon icon={faCaretDown} />
            </div>
            <div>

            </div>
            </div>
            <div className='mt-3 admin_div'>
              <div className='d-flex align-items-center justify-content-center'>
            <FontAwesomeIcon  className='clock_img' icon={faLink} />
            </div>
            <input placeholder='Deal or Lead' className='admin_input'/>
            <div>

            </div>
            </div>
            <div className='mt-3 admin_div'>
              <div className='d-flex align-items-center justify-content-center'>
          
            </div>
            <div className='admin_input d-flex'>
            <FaUser />
            <input placeholder='' type='file' className='admin_input1 ms-2'/>
            </div>
            <div>

            </div>
            </div> 
            <div className='mt-3 admin_div'>
              <div className='d-flex align-items-center justify-content-center'>
          
            </div>
            <div className='admin_input d-flex'>
            <FaBuildingCircleArrowRight />
            <input placeholder='Organization' className='admin_input1 ms-2'/>
            </div>
            <div>

            </div>
            </div>  
          </div>
       
     
    </form>
  );
};

export default ScheduleActivity;
