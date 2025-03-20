import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; 
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import '../Dashboard.css'
import  { fetchLeads, fetchUsers } from '../../api/Api'
import { MdMyLocation } from "react-icons/md";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { SiGooglecalendar } from "react-icons/si";
import { IoCaretDownSharp } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";
import { IoMdShare } from "react-icons/io";
import { FaEllipsisH } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { useParams } from 'react-router-dom'; 
import {
  setUsers, setTotalLeads, setLeads, setStages, setSubUsers, setIsPopupVisible,
} from '../../../redux/actions';
import UserDetailPopup1 from './UserDetailPopup1';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DirectorDashboard = () => {
    const { userId } = useParams(); 
    const [selectUser, setSelectUser] = useState(null);
    const [isDropdownList, setIsDropdownList] = useState(null);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  
    const toggleAdmin = (index) => {
      setIsDropdownList(prevIndex => (prevIndex === index ? null : index));
    };
  
    const dispatch = useDispatch();
    const {
        subUsers,  users, totalLeads, leads,  stages=[], isPopupVisible,
    } = useSelector((state) => state);
    
    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
      };  
      const showPopup = (subUser) => {
        setSelectUser({ ...subUser});
        dispatch(setIsPopupVisible(true));
      };
      const closePopup = () => {
        dispatch(setIsPopupVisible(false));
      }
  
    useEffect(() => {
      const fetchUserAndLeads = async () => {
        try {
          const usersResponse = await axios.get(`${process.env.REACT_APP_PORT}/getAllUser`);
          if (usersResponse.data.status === 'ok') {
            const usersData = usersResponse.data.data;
            dispatch(setUsers(usersData));
    
            const currentUser = usersData.find(user => user._id === userId);
            const currentUserKey = currentUser?.key;
    
            const leadsResponse = await axios.get(`${process.env.REACT_APP_PORT}/leads`);
            const allLeads = leadsResponse.data;
           
            const filteredLeads = allLeads.filter(lead => lead.assignedto === currentUserKey);
            dispatch(setLeads(filteredLeads));
            dispatch(setTotalLeads(filteredLeads.length));
              
          } else {
            console.error('Error fetching users: ', usersResponse.data.message);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchUserAndLeads();
    }, [userId]);
  
    const getLeadsCountByStage = (stage) => {
      return (leads || []).filter(lead => lead.status === stage).length;
    };
  

    const getLeadsPercentageByStage = (stage) => {
      const stageCount = getLeadsCountByStage(stage);
      return totalLeads > 0 ? ((stageCount / totalLeads) * 100).toFixed(2) : 0;
    };
  
    const currentUserKey = users.find(user => user._id === userId)?.key;
    const matchingSubUsers = users.filter(users => 
        users.key === currentUserKey && users.userType === 'SubUser' 
    );
    
    const chartData = {
      labels: stages.map(stage => stage.slice(0, 7)),
      datasets: [
        {
          label: 'Reached Stage',
          data: stages.map(stage => getLeadsCountByStage(stage)),
          backgroundColor: '#FECF4C',
          borderWidth: 0,
          barThickness: 12, 
          pointRadius: 10,
        }
      ]
    };
  
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 9, 
          boxHeight: 9,    
          }
        },
        title: {
          display: true,
          text: 'Number of Leads',
          position: 'left', 
        },
      },
      scales: {
        y: {
          grid: {
            display: false, 
          },
          ticks: {
            callback: function(value) {
              return value % 2 === 0 ? value : ''; 
            },
          },
        },
        x: {
          grid: {
            display: false, 
          },
        },
      },
      
    };

  return (
    <div className='dashboard_maindiv'>
    {/* <div className='dashboard_sidebar'>
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
             {stage} - {getLeadsPercentageByStage(stage)}%
           </p>
             ))}
    </div>
  )}
      </div>
    </div> */}
    <div className='dashboard_contentdiv'>
        <div className='d-flex align-items-center justify-content-between'>
    <h2>Director Dashboard</h2>
    <div className='d-flex'>
      <div className='periodbtn_div'>
      <SiGooglecalendar className='btn-icons' />
        <button className='period-btn'>Period</button>
        <IoCaretDownSharp className='btn-icons' />
        </div>
        <div className='periodbtn_div ms-1' onClick={toggleDropdown}>
        <FaCircleUser className='btn-icons' />
        <button className='period-btn'>User</button>
        <IoCaretDownSharp className='btn-icons' />
        {isDropdownVisible && (
               <div className='user-dropdown'>
                 {matchingSubUsers.length > 0 ? (
                            matchingSubUsers.map((subUser, index) => (
                                <p key={index} className='dir_list' onClick={() => showPopup(subUser)}>
                                {subUser.fname} {subUser.lname}</p>
                            ))
                        ) : (
                            <p>No users found</p>
                        )}
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
<p className='value_txt'>{totalLeads || '0'} LEADS</p>
</div>
<div className='dash_div2'>
  <div>
  {matchingSubUsers.length > 0 ? (
                            matchingSubUsers.map((subUser,  index) => (
                                <p key={index} className='data_text'>
                                {subUser.fname} {subUser.lname}</p>
                            ))
                        ) : (
                            <p>No users found</p>
                        )}
  <div className='d-flex align-items-center justify-content-center'>
    <a href={`/leadcreatededit1/${userId}`}>
  <button className='report_btn mt-2'>Edit Report</button></a>
  </div>
  </div>
</div>
</div>
<div className='dashboard_card1'>
<div className='dash_div1'>
<div className='d-flex'>
<MdMyLocation className='value_icon' />
<h3 className='leadhead ms-2'>Lead conversion</h3>
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
<div className='formhead'>
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
<div className='dash_chart1 p-1'>
<Bar data={chartData} options={{ ...options, responsive: true, maintainAspectRatio: false }} />
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
    {isPopupVisible && 
       <UserDetailPopup1
      subUsers={subUsers}
      leads={leads} 
      selectUser={selectUser}
        onClose={closePopup}  
        />
        }
    </div>
</div>
  )
}

export default DirectorDashboard