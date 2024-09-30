import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; 
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import '../Dashboard.css'
import { MdMyLocation } from "react-icons/md";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { SiGooglecalendar } from "react-icons/si";
import { IoCaretDownSharp } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";
import { IoMdShare } from "react-icons/io";
import { FaEllipsisH } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";

import {
  setUsers, setSubUsers, setTotalLeads, setExecutives, setAdminStages, setSelectedUser, setIsPopupVisible, setLeads
} from '../../../redux/actions';
import UserDetailPopup from './UserDetailPopup';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const AdminDashboard = () => {
  const [selectUser, setSelectUser] = useState(null);
  const [isDropdownList, setIsDropdownList] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [stageCounts, setStageCounts] = useState({});
  const [isPopupShow, setisPopupShow] = useState(false); 
  const [leadCountsByUser, setLeadCountsByUser] = useState([]);

  const toggleAdmin = (index) => {
    setIsDropdownList(prevIndex => (prevIndex === index ? null : index));
  };

  const dispatch = useDispatch();

  const {
  subUsers, selectedUser, executives,  users,  totalLeads,   adminstages=[], isPopupVisible, leads
  } = useSelector((state) => state);


  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const showPopup = (user) => {
    const userCount = leadCountsByUser.find(item => item.user._id === user._id)?.count || 0;
    setSelectUser({ ...user, count: userCount });
    dispatch(setIsPopupVisible(true));

  };

  const closePopup = () => {
    dispatch(setIsPopupVisible(false));
    dispatch(setisPopupShow(false));
    dispatch(setSelectUser(null));
  }

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_PORT}/leads`);
        const leadsData = response.data;
        dispatch(setLeads(leadsData));

  
        const totalLeads = leadsData.length;
        dispatch(setTotalLeads(totalLeads));
      
        const counts = adminstages.reduce((acc, stage) => {
          const count = leadsData.filter(lead => lead.status === stage).length;
          acc[stage] = {
            count,
            percentage: totalLeads > 0 ? (count / totalLeads * 100).toFixed(2) : 0
          };
          return acc;
        }, {});
        setStageCounts(counts);

        

        const leadCountsByUser = users.filter(user => user.userType === 'User').map(user => {
          const count = leadsData.filter(lead => lead.assignedto === user.key).length;
          return { user, count };
        });
        setLeadCountsByUser(leadCountsByUser);
      } catch (error) {
        console.error(`Error fetching leads: ${error.message}`);
      }
    };

    const fetchUsers = async () => {
      try {
        const usersResponse = await axios.get(`${process.env.REACT_APP_PORT}/getAllUser`);
        if (usersResponse.data.status === 'ok') {
          const usersData = usersResponse.data.data;
          dispatch(setUsers(usersData));
          const subUsersData = usersData.filter(user => user.userType === 'SubUser');
          const executivesData = usersData.filter(user => user.userType === 'Executive');
          dispatch(setSubUsers(subUsersData));
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
  }, [dispatch, adminstages, users]);

  const getLeadsCountByStage = (adminstage) => {
    return (leads || []).filter(lead => lead.status === adminstage).length;
  };
  const getLeadsPercentageByStage = (adminstage) => {
    const stageCount = getLeadsCountByStage(adminstage);
    return totalLeads > 0 ? ((stageCount / totalLeads) * 100).toFixed(2) : 0;
  };

  const chartData = {
    labels: adminstages.map(adminstage => adminstage.slice(0, 7)),
    datasets: [
      {
        label: 'Reached Stage',
        data: adminstages.map(adminstage => getLeadsCountByStage(adminstage)),
        backgroundColor: adminstages.map((_, index) => {
          const colors = ['#FECF4C', '#FECF4C', '#FECF4C', '#FECF4C', '#FECF4C', '#FECF4C', '#FECF4C', '#FECF4C', '#FF0000', '#71AE79'];
          return colors[index % colors.length]; 
        }),
        borderWidth: 0,
        barThickness: 12, 
        pointRadius: 10,
      },
      {
        label: 'Won',
        backgroundColor: '#71AE79',
      },
      {
        label: 'Lost',
        backgroundColor: '#FF0000',
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
               {stage}: {stageCounts[stage].count > 0 ? 
          `${stageCounts[stage].percentage}%` : "0%"
        }
               </p>
              ))}
        </div>
      )}
          </div>
        
        </div> */}
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
                {leadCountsByUser.map(({ user }) => (
                  <p key={user._id} className='dir_list' onClick={() => showPopup(user)}>
                    {user.fname} {user.lname}
                  </p>
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
      {leadCountsByUser.map(({ user, count }) => (
                  <p key={user._id} className='data_text'>
                    {user.fname} {user.lname}: {count} LEADS
                  </p>
                ))}
      <div className='d-flex align-items-center justify-content-center'>
        <a href='/leadcreatededit'>
      <button className='report_btn mt-2'>Edit Report</button>
      </a>
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
<div className='dash_chart1 p-1' >
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
       <UserDetailPopup
      leadCountsByUser={leadCountsByUser}
      subUsers={subUsers}
      leads={leads} 
      executives={executives}
     selectUser={selectUser}
        onClose={closePopup}  
        />
        }
        </div>
   
    </div>
  )
}

export default AdminDashboard