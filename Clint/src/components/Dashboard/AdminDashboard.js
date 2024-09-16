import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import './Dashboard.css'
import { MdMyLocation } from "react-icons/md";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { SiGooglecalendar } from "react-icons/si";
import { IoCaretDownSharp } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";
import { IoMdShare } from "react-icons/io";
import { FaEllipsisH } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { FaCaretDown } from "react-icons/fa";
import UserPopup from './UserPopup';
import {
  setUsers, setSubUsers, setTotalLeads, setSelectedUser, setExecutives, setStages,  
} from '../../redux/actions';


const AdminDashboard = () => {
  const [isDropdownList, setIsDropdownList] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [stageCounts, setStageCounts] = useState({});

  const toggleAdmin = (index) => {
    setIsDropdownList(prevIndex => (prevIndex === index ? null : index));
  };

  const dispatch = useDispatch();

  const {
    users, subUsers, totalLeads, selectedUser, executives,  stages=[], leads
  } = useSelector((state) => state);


  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const showPopup = (user) => {
    setSelectedUser(user);
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setSelectedUser(null);
  }

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_PORT}/leads`);
        const leadsData = response.data;
        const totalLeads = leadsData.length;
        dispatch(setTotalLeads(response.data.length));

        const counts = stages.reduce((acc, stage) => {
          const count = leadsData.filter(lead => lead.status === stage).length;
          acc[stage] = {
            count,
            percentage: totalLeads > 0 ? (count / totalLeads * 100).toFixed(2) : 0
          };
          return acc;
        }, {});
        setStageCounts(counts);
        
      } catch (error) {
        console.error(`Error fetching leads: ${error.message}`);
      }
    };

    const fetchUsers = async () => {
      try {
        const usersResponse = await axios.get(`${process.env.REACT_APP_PORT}/getAllUser`);
        if (usersResponse.data.status === 'ok') {
          const usersData = usersResponse.data.data;
          dispatch(setUsers(usersData)); // Set all users initially
          const subUsersData = usersData.filter(user => user.userType === 'SubUser');
          const executivesData = usersData.filter(user => user.userType === 'Executive');
          dispatch(setSubUsers(subUsersData)); // Set subUsers
          dispatch(setExecutives(executivesData)); 
        } else {
          console.error('Failed to fetch users:', usersResponse.data.message);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

   
    fetchLeads();
    fetchUsers();
     
  }, []);

  const userNames = users.filter(user => user.userType === 'User');


  return (
    <div className='dashboard_maindiv'>
        <div className='dashboard_sidebar'>
          <div className='stick_div'>
<div className='sidebar_lead_div'>
  <p className='sidebar_txt'>Lead Created</p>
  <FaCaretDown className='ms-1 admin_careticon' 
   onClick={() =>toggleAdmin(1)}  />
</div>
{isDropdownList === 1 && (
        <div className='admin_dropdown_menu'>
          <p className='ms-1'>{totalLeads > 0 ? `${totalLeads} LEADS` : "(NO VALUE)"}</p>
        </div>
      )}
<div className='sidebar_lead_div'>
  <p className='sidebar_txt'>Lead Converted</p>
  <FaCaretDown className='admin_careticon' 
   onClick={() =>toggleAdmin(2)}  />
</div>
{isDropdownList === 2 && (
        <div className='admin_dropdown_menu'>
           {stages.map((stage, index) => (
               <p key={index} className=''> 
               {stage}: {stageCounts[stage].count > 0 ? 
          `${stageCounts[stage].percentage}%` : "0%"
        }
               </p>
              ))}
        </div>
      )}
          </div>
        
        </div>
        <div className='dashboard_contentdiv'>
            <div className='d-flex align-items-center justify-content-between'>
        <h2>Admin Dashboard</h2>
        <div className='d-flex'>
          <div className='periodbtn_div'>
          <SiGooglecalendar className='btn-icons' />
            <button className='period-btn'>Period</button>
            <IoCaretDownSharp className='btn-icons' />
            </div>
            <div className='periodbtn_div ms-1' onClick={toggleDropdown}>
            <FaCircleUser className='btn-icons' />
            <button className='period-btn'>User</button>
            <IoCaretDownSharp className='btn-icons'/>
            {isDropdownVisible && (
                <div className='user-dropdown'>
               {userNames.map((user) => (
                <p key={user._id} className='dir_list' onClick={() => showPopup(user)}>{user.fname}</p>
              ))}
                </div>
              )}
            </div>
           
            <div className='periodbtn_div ms-5'>
            <IoMdShare className='btn-icons' />
            <button className='period-btn'>Share</button>
            <IoCaretDownSharp className='btn-icons'/>
            </div>
            <div className='periodbtn_div ms-1'>
            <button className='period-btn'>Export</button>
            <IoCaretDownSharp className='btn-icons'/>
            </div>
            <div className=' ms-2 d-flex justify-content-center align-items-center'>
           <div className='periodbtn_line'></div>
            </div>
            <div className='periodbtn2_div ms-2'>
            <FaEllipsisH />
            </div>
        </div>
        </div>
        <div className='dash_content1 mt-5'>
<div className='dashboard_card1'>
<div className='dash_div1'>
  <div className='d-flex'>
  <MdMyLocation className='value_icon' />
    <h3 className='leadhead ms-2'>Lead created by user</h3>
    </div>
    <p className='value_txt'>{totalLeads > 0 ? `${totalLeads} LEADS` : "(NO VALUE)"}</p>
    </div>
    <div className='dash_div2'>
      <div>
      <p className='data_text'>No data to show with
      current filters or grouping</p>
      <div className='d-flex align-items-center justify-content-center'>
      <button className='report_btn mt-2'>Edit Report</button>
      </div>
      </div>
    </div>
</div>
<div className='dashboard_card1'>
<div className='dash_div1'>
  <div className='d-flex'>
  <MdMyLocation className='value_icon' />
    <h3 className='leadhead ms-2'>Lead converted</h3>
    </div>
    <p className='value_txt'>This Year</p>
    </div>
    <div className='dash_div2'>
    <div>
      <p className='data_text'>No data to show with
      current filters or grouping</p>
      <div className='d-flex align-items-center justify-content-center'>
      <button className='report_btn mt-2'>Edit Report</button>
      </div>
      </div>
    </div>
</div>
<div className='dashboard_card1'>
  <div className='dash_div3'>
    <div className='d-flex'>
    <RiMoneyRupeeCircleFill  className='value_icon' />
<h3 className='leadhead ms-2'>Lead conversion</h3>
</div>
<div className='d-flex'>
  <p className='value_txt'>REAL ESTATE</p>
  <p className='value_txt ms-4'>THIS YEAR</p>
  <p className='value_txt ms-4'>WON, LOST</p>
</div>
<p className='rate_txt'>WIN RATE IS 34%</p>
</div>
</div>
        </div>

        <div className='dash_content2 mt-2'>
<div className='dashboard_card1'>
<div className='dash_div1'>
  <div className='d-flex'>
  <RiMoneyRupeeCircleFill  className='value_icon' />
    <h3 className='leadhead ms-2'>Deals won over time </h3>
    </div>
   <div className='d-flex'>
    <p className='value_txt'>THIS YEAR</p>
    <p className='ms-3 value_txt'>WON</p>
   </div>
    </div>
    <div className='dash_div2'>
      <div>
      
      </div>
    </div>
</div>
<div className='dashboard_card1'>
<div className='dash_div1'>
  <div className='d-flex'>
  <RiMoneyRupeeCircleFill  className='value_icon' />
    <h3 className='leadhead ms-2'>Average value of won </h3>
    </div>
    <div className='d-flex'>
    <p className='value_txt'>This year </p>
    <p className='value_txt ms-2'>WON </p>
    </div>
    </div>
    <div className='dash_div2'>
      <div>
      <p className='data_text'>No data to show with
      current filters or grouping</p>
      <div className='d-flex align-items-center justify-content-center'>
      <button className='report_btn mt-2'>Edit Report</button>
      </div>
      </div>
    </div>
</div>
<div className='dashboard_card1'>
<div className='dash_div1'>
  <div className='d-flex'>
  <RiMoneyRupeeCircleFill className='value_icon' />
    <h3 className='leadhead ms-2'>Deal Duration</h3>
    </div>
    <div className='d-flex'>
    <p className='value_txt'>This Year</p>
    <p className='value_txt ms-2'>REAL ESTATE</p>
    </div>
    </div>
    <div className='dash_div2'>
      <div>
      <p className='data_text'>No data to show with
      current filters or grouping</p>
      <div className='d-flex align-items-center justify-content-center'>
      <button className='report_btn mt-2'>Edit Report</button>
      </div>
      </div>
    </div>
</div>
          
        </div>

        <div className='dash_content1 mt-2'>
<div className='dashboard_card1'>
<div className='dash_div1'>
  <div className='d-flex'>
  <SlCalender  className='value_icon' />
    <h3 className='leadhead ms-2'>Activities Completed </h3>
    </div>
    <p className='value_txt'>( THIS MONTH ) </p>
    </div>
    <div className='dash_div2'>
      <div>
      <p className='data_text'>No data to show with
      current filters or grouping</p>
      <div className='d-flex align-items-center justify-content-center'>
      <button className='report_btn mt-2'>Edit Report</button>
      </div>
      </div>
    </div>
</div>
<div className='dashboard_card1'>
<div className='dash_div1'>
  <div className='d-flex'>
  <MdMyLocation className='value_icon' />
    <h3 className='leadhead ms-2'>Deals lost by Reason </h3>
    </div>
    <div className='d-flex'>
    <p className='value_txt'>LOST</p>
    <p className='value_txt ms-2'>THIS YEAR</p>
    </div>
    </div>
    <div className='dash_div2'>
    <div>
      <p className='data_text'>No data to show with
      current filters or grouping</p>
      <div className='d-flex align-items-center justify-content-center'>
      <button className='report_btn mt-2'>Edit Report</button>
      </div>
      </div>
    </div>
</div>
<div className='dashboard_card1'>
  <div className='dash_div1'>
    <div className='d-flex'>
    <RiMoneyRupeeCircleFill  className='value_icon' />
<h3 className='leadhead ms-2'>Deal Progress </h3>
</div>
<div className='d-flex'>
  <p className='value_txt'>THIS YEAR</p>
  <p className='value_txt ms-2'>REAL ESTATE</p>
 
</div>
</div>
</div>
        </div>
        {isPopupVisible && <UserPopup user={selectedUser} onClose={closePopup}  subUsers={subUsers}  executives={executives} />}
        </div>
    </div>
  )
}

export default AdminDashboard