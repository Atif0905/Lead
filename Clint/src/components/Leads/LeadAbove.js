import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import './Deals.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {setUsers, setSubUsers, setExecutives, setIsLoading, setIsModalOpen, setIsPopupVisible,setIsDropdownOpen,setIsUserDropdown,setIsAddLeads,} from '../../redux/actions';
import AddDeals from './AddDeals';
import ImportResult from './ImportResult';
import Addleads from '../DirectorLeads/Addleads';
import { RiArrowDownSFill } from "react-icons/ri";
import { FaUserTie } from "react-icons/fa6";  

const LeadAbove = () => {
  // Extract userId from URL parameters
  const { userId } = useParams();

  const dispatch = useDispatch();
  const {users, subUsers, executives, isPopupVisible, isModalOpen, isDropdownOpen, isUserDropdown,isAddLeads} = useSelector((state) => state);
  const [hoveredUserKey, setHoveredUserKey] = useState(null); 
  const [hoveredSubUserKey1, setHoveredSubUserKey1] = useState(null); 
  const [selectedName, setSelectedName] = useState('User');
  const [unassignedLeads, setUnassignedLeads] = useState([]);
  const [lastUserIndex, setLastUserIndex] = useState(0);
  
  useEffect(() => {
    // Fetch users, subUsers, and executives from API and update state in redux store
    const fetchUsers = async () => {
      dispatch(setIsLoading(true));
      try {
        const usersResponse = await axios.get(`${process.env.REACT_APP_PORT}/getAllUser`);
        if (usersResponse.data.status === 'ok') {
          const allUsers = usersResponse.data.data;
          dispatch(setUsers(allUsers.filter(user => user.userType === 'User')));
          dispatch(setSubUsers(allUsers.filter(user => user.userType === 'SubUser')));
          dispatch(setExecutives(allUsers.filter(user => user.userType === 'Executive')));
        } else {
          console.error('Failed to fetch users:', usersResponse.data.message);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        dispatch(setIsLoading(false));
      }
    };
    fetchUsers(); // Call fetchUsers when component mounts or userId changes
  }, [userId, dispatch]);
  
// Fetch unassigned leads from the database
  const fetchUnassignedLeads = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_PORT}/leads`);
      if (response.data && Array.isArray(response.data)) {
        const unassigned = response.data.filter((lead) => !lead.assignedto);
        setUnassignedLeads(unassigned);
        console.log('Unassigned Leads:', unassigned); 
      } else {
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching leads:', error.message);
    }
  };

 // Distribute unassigned leads to users in a circular way
  const distributeLeads = async () => {
    if (users.length === 0) {
      console.error('No users available for lead distribution.');
      return;
    }

    const leadsPerUser = Math.floor(unassignedLeads.length / users.length);  // Calculate number of leads per user
    console.log(leadsPerUser)
    const remainingLeads = unassignedLeads.length % users.length;  // Calculate remaining leads
console.log(remainingLeads)

    let assignedLeads = [];
    let index = 0;

    const startingIndex = (lastUserIndex + 1) % users.length; // Ensure circular distribution
    console.log(startingIndex)

  // Distribute leads evenly to users
    for (let i = 0; i < users.length; i++) {
      const userIndex = (startingIndex + i) % users.length; // Ensure circular distribution
      const user = users[userIndex];
      const leadsToAssign = unassignedLeads.slice(index, index + leadsPerUser);

      assignedLeads = [
        ...assignedLeads,
        ...leadsToAssign.map((lead) => ({ ...lead, assignedto: user.key })), // Assign leads to users
      ];
      index += leadsPerUser;

      // Update the lastUserIndex for the next cycle
      if (index >= unassignedLeads.length) {
        setLastUserIndex(userIndex); // Set last user index for next distribution
        break;
      }
    }

    // Assign remaining leads to the next set of users
    for (let i = 0; i < remainingLeads; i++) {
      const userIndex = (startingIndex + i) % users.length;
      const user = users[userIndex];
      assignedLeads.push({
        ...unassignedLeads[index + i],
        assignedto: user.key,
      });
    }

    // Update leads in the database
    try {
      const updatePromises = assignedLeads.map((lead) =>
        axios.put(`${process.env.REACT_APP_PORT}/leads/move/${lead._id}`, {
          assignedto: lead.assignedto,
        })
      );
      await Promise.all(updatePromises);
      console.log('Leads successfully distributed and updated!');
      fetchUnassignedLeads(); // Refresh unassigned leads
    } catch (error) {
      console.error('Error updating leads:', error.message);
    }
  };

  // Handle the Assign Leads button click, fetch unassigned leads, and distribute them
  const handleAssignLeadsClick = async () => {
    await fetchUnassignedLeads();
    await distributeLeads();
  };

  const togglePopadd = () => dispatch(setIsPopupVisible(!isPopupVisible));

  const toggleModal = () => {
    dispatch(setIsModalOpen(!isModalOpen));
    dispatch(setIsDropdownOpen(false));
  };

  const toggleAssignLeads = () => {
    dispatch(setIsAddLeads(!isAddLeads));
    dispatch(setIsDropdownOpen(false));
  };

  const toggleDropdown = () => dispatch(setIsDropdownOpen(!isDropdownOpen));
  const toggleUserDropdown = () => dispatch(setIsUserDropdown(!isUserDropdown));

  const handleUserMouseEnter = (userKey) => setHoveredUserKey(userKey);
  const handleUserMouseLeave = () => setHoveredUserKey(null);

  const handleSubUserMouseEnter = (subUserKey1) => setHoveredSubUserKey1(subUserKey1);
  const handleSubUserMouseLeave = () => setHoveredSubUserKey1(null);

  return (
    <div className='mt-4 ps-3'>
      <div className='d-flex'>
        <div className='buttdiv2'>
          <div className='d-flex align-items-center justify-content-center'>
            <p className='deal_butt1_txt'>
              + <span>Leads</span>
            </p>
          </div>
          <div className='d-flex align-items-center justify-content-center' onClick={toggleDropdown}>
            <RiArrowDownSFill  className='arrow_down' />
          </div>
          {isDropdownOpen && (
            <div className='dropdown-content'>
              <div>
                <p className='import_txt' onClick={toggleModal}>+ Import data</p>
                <p className='import_txt' onClick={toggleAssignLeads}>+ Add Leads</p>
                <p className='import_txt' onClick={handleAssignLeadsClick}>+ Automatic assign Leads</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='d-flex align-items-center justify-content-between mt-4'>
        <div>
        </div>
      
          <div className='users_button me-3'>
            <div className='users_butt1'>
            <FaUserTie className='adminmaleimg'/>
              <p className='adminname'>{selectedName}</p>
              <RiArrowDownSFill className='arrowblackimg' onClick={toggleUserDropdown} />
              {isUserDropdown && (
                <div className='users_dropdown'>
                  <div>
                    {users.map((user) => (
                      <div
                        key={user.key}
                        className=''
                        onMouseEnter={() => handleUserMouseEnter(user.key)} 
                        onMouseLeave={handleUserMouseLeave} >
                          <div className='users_hover'>
                          <a href={`/dir1leads/${user._id}`} onClick={() => setSelectedName(`${user.fname} ${user.lname}`)}>
                          <p className='dir_list'>
                            {user.fname} {user.lname}
                          </p>
                        </a>
                        </div>
                        {hoveredUserKey === user.key && (
                          <div className='subuser-info'>
                            {subUsers
                              .filter((subUser) => subUser.key === user.key)
                              .map((subUser) => (
                                <div
                                  key={subUser.key}
                                  className='subuser-hover d-flex'
                                  onMouseEnter={() => handleSubUserMouseEnter(subUser.key1)} 
                                  onMouseLeave={handleSubUserMouseLeave}>
                                    <div>
                                      <a href={`/teamlead/${subUser._id}`} onClick={() => setSelectedName(`${subUser.fname} ${subUser.lname}`)}>
                                  <p className='subuser-name'>
                                    {subUser.fname} {subUser.lname}
                                  </p>
                                  </a>
                               </div>
                                  {hoveredSubUserKey1 === subUser.key1 && (
                                    <div className='executive-info'>
                                      {executives
                                        .filter((executive) => executive.key === subUser.key1)
                                        .map((executive) => (
                                          <a href={`/executiveleads/${executive._id}`} onClick={() => setSelectedName(`${executive.fname} ${executive.lname}`)}>
                                          <p key={executive.key} className='executive-name'>
                                            {executive.fname} {executive.lname}
                                          </p>
                                          </a>
                                        ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
           
          </div>
     
      </div>

      {isPopupVisible && (
        <div className='popup'>
          <div className='popup_content'>
            <div className='d-flex align-items-center justify-content-between adddeal_div'>
              <h2 className='add_deal'>Add Deals</h2>
              <FontAwesomeIcon className='close_img' icon={faX} onClick={togglePopadd} />
            </div>
            <AddDeals />
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className='modal'>
          <div className='modal_content'>
            <div className='d-flex align-items-center justify-content-between adddeal_div'>
              <h2 className='add_deal'>Import Result</h2>
              <FontAwesomeIcon className='close_img' icon={faX} onClick={toggleModal} />
            </div>
            <ImportResult
            toggleModal={toggleModal}/>
          </div>
        </div>
      )}

{isAddLeads && (
        <div className='modal'>
          <div className='modal_content'>
            <div className='d-flex align-items-center justify-content-between importdeal_div'>
              <h2 className='import_deal'>Add Leads</h2>
              <FontAwesomeIcon className='close_img' icon={faX} onClick={toggleAssignLeads} />
            </div>
            <Addleads />
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadAbove;
