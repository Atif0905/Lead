import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bar,  Pie} from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,  ArcElement,
} from 'chart.js';
import axios from 'axios';
import '../Dashboard.css'
import { MdMyLocation } from "react-icons/md";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { SiGooglecalendar } from "react-icons/si";
import { IoCaretDownSharp } from "react-icons/io5";
import { IoMdShare } from "react-icons/io";
import { FaEllipsisH } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { useParams } from 'react-router-dom'; 
import {
  setUsers, setTotalLeads, setLeads, setStages, 
} from '../../../redux/actions';
import PopupNotification from '../../ExecutiveLead/PopupNotification';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const ExecutiveDasboard = () => {
  const { userId } = useParams(); // Get user ID from URL parameters
  const [isDropdownList, setIsDropdownList] = useState(null);
  const [isLostLead, setIsLostLead] = useState();
  const [isWonLead, setIsWonLead] = useState([]);

  const toggleAdmin = (index) => {
     // Toggles dropdown for the specified index
    setIsDropdownList(prevIndex => (prevIndex === index ? null : index));
  };

    const dispatch = useDispatch();
    const {
      users, totalLeads, leads,  stages=[],
    } = useSelector((state) => state);

    useEffect(() => {
      // Fetch user and leads data on component mount
      const fetchUserAndLeads = async () => {
        try {
          const usersResponse = await axios.get(`${process.env.REACT_APP_PORT}/getAllUser`);
          if (usersResponse.data.status === 'ok') {
            const usersData = usersResponse.data.data;
            dispatch(setUsers(usersData));
           // Find current user based on userId from URL params
            const currentUser = usersData.find(user => user._id === userId);
            const currentUserKey = currentUser?.id; // Current user's unique key
            console.log(currentUserKey)
           // Fetch all leads
            const leadsResponse = await axios.get(`${process.env.REACT_APP_PORT}/leads`);
            const allLeads = leadsResponse.data;
            // Filter leads assigned to the current user that are not "won" or "lost"
            const filteredLeads = allLeads.filter(lead => lead.assignedto === currentUserKey && lead.status !== "won" && lead.status !== "Lost");
            dispatch(setLeads(filteredLeads));
            dispatch(setTotalLeads(filteredLeads.length));
           // Filter and count lost leads
            const lostLeads = allLeads.filter(
              lead => lead.assignedto === currentUserKey && lead.status === "Lost"
            );
            setIsLostLead(lostLeads.length);
        
           // Filter and count won leads
            const wonLeads = allLeads.filter(
              lead => lead.assignedto === currentUserKey && lead.status === "won"
            );
            setIsWonLead(wonLeads);
         
          } else {
            console.error('Error fetching users: ', usersResponse.data.message);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    
      fetchUserAndLeads();
    }, [userId]);
  // Function to count leads by status (stage)
    const getLeadsCountByStage = (stage) => {
      return (leads || []).filter(lead => lead.status === stage).length;
    };
    // Function to calculate percentage of leads in a specific stage
    const getLeadsPercentageByStage = (stage) => {
      const stageCount = getLeadsCountByStage(stage);
      return totalLeads > 0 ? ((stageCount / totalLeads) * 100).toFixed(2) : 0;
    };

  // Data for bar chart
    const chartData = {
      labels: stages.map(stage => stage.slice(0, 5)),
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

    const pieChartData = {
      labels: ['Total Leads', 'Lost Leads'],
      datasets: [{
        data: [totalLeads, isLostLead || 0], 
        backgroundColor: ['#FECF4C', '#2FB985'],
      }]
    };

  const pieChartOptions = {
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
    },
  };
    

  return (
    <div className='dashboard_maindiv'>
      <PopupNotification leads={leads} />
   
    <div className='dashboard_contentdiv'>
        <div className='d-flex align-items-center justify-content-between'>
    <h2>Executive Dashboard</h2>
    <div className='d-flex'>
      <div className='periodbtn_div'>
      <SiGooglecalendar className='btn-icons' />
        <button className='period-btn'>Period</button>
        <IoCaretDownSharp className='btn-icons' />
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
  <p className='data_text'>{totalLeads || '0'} LEADS</p>
  <div className='d-flex align-items-center justify-content-center'>
  <a href={`/leadcreatededit3/${userId}`}>
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
<h3 className='leadhead ms-2'>Lead status</h3>
</div>
<div className='d-flex'>
<p className='value_txt'>REAL ESTATE</p>
<p className='value_txt ms-4'>THIS YEAR</p>
<p className='value_txt ms-4'>WON, LOST</p>
</div>
<p className='rate_txt'>WIN RATE IS 34%</p>
</div>
<div className='dash_chart1 p-2'>
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
  <div className='d-flex'>

{isWonLead.length > 0 ? ( 
              isWonLead.map((lead, index) => (
                <div key={index}>
              <p>{new Date(lead.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
      })}</p>
            <p>{new Date(lead.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}</p>
                </div>
              ))
            ) : (
              <p>No won leads</p>
            )}
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
<div className='dash_div4'>
<div className='pie-chart'>
<Pie data={pieChartData} options={{ ...pieChartOptions, responsive: true, maintainAspectRatio: false }} />
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
    </div>
</div>
  )
}


export default ExecutiveDasboard