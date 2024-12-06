import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import '../Leads/Deals.css';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  setUsers,
  setLeads,
  setSubUsers,
  setExecutives,
  setIsLoading,
  setIsModalOpen,
  setIsPopupVisible,
  setIsDropdownOpen,
  setIsUserDropdown,
  setIsAddLeads,
} from '../../redux/actions';
import AddDeals from '../Leads/AddDeals';
import ImportResult from '../Leads/ImportResult';
import Addleads from './Addleads';

const DirectorAbove = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const dispatch = useDispatch();
  const [currentUserKey, setCurrentUserKey] = useState(null);
  const [hoveredSubUserKey1, setHoveredSubUserKey1] = useState(null); 
  const [selectedName, setSelectedName] = useState('User');

  const {
    users,
    leads,
    subUsers,
    executives,
    isPopupVisible,
    isModalOpen,
    isDropdownOpen,
    isUserDropdown,
    isAddLeads,
  } = useSelector((state) => state);

  useEffect(() => {
    const fetchUsersAndLeads = async () => {
      dispatch(setIsLoading(true));
      try {
        // Fetch Users
        const usersResponse = await axios.get(`${process.env.REACT_APP_PORT}/getAllUser`);
        if (usersResponse.data.status === 'ok') {
          const allUsers = usersResponse.data.data;
          dispatch(setUsers(allUsers.filter(user => user.userType === 'User')));
          dispatch(setSubUsers(allUsers.filter(user => user.userType === 'SubUser')));
          dispatch(setExecutives(allUsers.filter(user => user.userType === 'Executive')));

          const currentUser = allUsers.find(user => user._id === userId);
          if (currentUser) {
            setCurrentUserKey(currentUser.key);
          }
        } else {
          console.error('Failed to fetch users:', usersResponse.data.message);
        }

        // Fetch Leads
        const leadsResponse = await axios.get(`${process.env.REACT_APP_PORT}/leads`);
        if (leadsResponse.status === 200) {
          setLeads(leadsResponse.data); 
        } else {
          console.error('Failed to fetch leads:', leadsResponse.data.message);
        }
      } catch (error) {
        console.error('Error fetching users or leads:', error);
      } finally {
        dispatch(setIsLoading(false));
      }
    };

    fetchUsersAndLeads();
  }, [userId]);

  const assignLeadsAutomatically = async () => {
    if (subUsers.length === 0 || leads.length === 0) {
      console.error("No subUsers or leads available for assignment.");
      return;
    }
  
    // Filter subUsers to include only those matching the currentUserKey
    const filteredSubUsers = subUsers.filter(subUser => subUser.key === currentUserKey);
  
    if (filteredSubUsers.length === 0) {
      console.error("No matching subUsers found for the current user.");
      return;
    }
  
    try {
      const updatedLeads = [...leads];
      let subUserIndex = 0;
  
      // Assign leads only to filteredSubUsers
      for (let i = 0; i < updatedLeads.length; i++) {
        const lead = updatedLeads[i];
        const subUser = filteredSubUsers[subUserIndex];
  
        lead.assignedto = subUser.key1; // Assign subUser's key1 to the lead
  
        // API call to update the lead in the backend
        await axios.put(`${process.env.REACT_APP_PORT}/leads/move/${lead._id}`, {
          assignedto: subUser.key1,
        });
  
        // Rotate to the next filteredSubUser
        subUserIndex = (subUserIndex + 1) % filteredSubUsers.length;
      }
  
      // Update the local state
      dispatch(setLeads(updatedLeads));
      console.log("Leads assigned to matching subUsers successfully!");
    } catch (error) {
      console.error("Error assigning leads to matching subUsers:", error);
    }
  };
  const togglePopadd = () => dispatch(setIsPopupVisible(!isPopupVisible));

  const toggleAssignLeads = () => {
    dispatch(setIsAddLeads(!isAddLeads));
    dispatch(setIsDropdownOpen(false));
  };

  const toggleModal = () => {
    dispatch(setIsModalOpen(!isModalOpen));
    dispatch(setIsDropdownOpen(false));
  };

  const toggleDropdown = () => dispatch(setIsDropdownOpen(!isDropdownOpen));

  const toggleUserDropdown = () => dispatch(setIsUserDropdown(!isUserDropdown));

  const handleSubUserMouseEnter = (subUserKey1) => setHoveredSubUserKey1(subUserKey1);
  const handleSubUserMouseLeave = () => setHoveredSubUserKey1(null);


  return (
    <div className='main-content'>
      <div className='mt-4 ps-3'>
        <div className='d-flex'>
          <div className='buttdiv1'>
            <div className='cont_butt'>
              <img className='bar_chat' src='/bar_img.webp' alt='bar img' />
            </div>
            <div className='bar_butt'>
              <img className='bar_chat' src='/Content.webp' alt='content img' />
            </div>
            <div className='cont_butt'>
              <img className='bar_chat' src='/Rupee.webp' alt='rupee img' />
            </div>
          </div>
          <div className='buttdiv2'>
            <div className='deal_butt1' onClick={togglePopadd}>
              <p className='deal_butt1_txt'>
                + <span>Deal</span>
              </p>
            </div>
            <div className='deal_butt2' onClick={toggleDropdown}>
              <img className='arrow_down' src='/arrowdown.webp' alt='arrow down' />
            </div>
            {isDropdownOpen && (
              <div className='dropdown-content'>
                <div>
                  <p className='import_txt' onClick={toggleModal}>+ Import data</p>
                  <p className='import_txt' onClick={toggleAssignLeads}>+ Add Leads</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='d-flex align-items-center justify-content-between mt-4'>
          <div>
          <button className='automatic_button' onClick={assignLeadsAutomatically}>Assign Leads</button>
          </div>
          <div className='d-flex'>
            <div className='me-3'>
              <p className='ruptxt mt-1'>₨1,720,000·8 deals</p>
            </div>
            <div className='users_button me-3'>
              <div className='users_butt1'>
                <img className='adminmaleimg' src='/AdministratorMale.webp' alt='admin' />
                <p className='adminname'>{selectedName}</p>
                <img className='arrowblackimg' src='/arrowblack.webp' alt='arrow black' onClick={toggleUserDropdown} />
              </div>
              {isUserDropdown && (
                <div className='users_dropdown'>
                  <div>
                  {subUsers.map((subUser) => (
      <div  className='users_hover d-flex'
      onMouseEnter={() => handleSubUserMouseEnter(subUser.key1)} 
      onMouseLeave={handleSubUserMouseLeave}>
        {currentUserKey === subUser.key && (
          <div className='d-flex'>
             <a href={`/teamlead/${subUser._id}`} onClick={() => setSelectedName(`${subUser.fname} ${subUser.lname}`)}>
          <p className='dir_list'>{subUser.fname} {subUser.lname}</p></a>
          {hoveredSubUserKey1 === subUser.key1 && (
            <div className='executive-info'>
            {executives
              .filter((executive) => executive.key === subUser.key1)
              .map((executive) => (
                <a href={`/executiveleads/${executive._id}`} onClick={() => setSelectedName(`${executive.fname} ${executive.lname}`)}>
                <p key={executive.key} className='dir_list'>
                  {executive.fname}  {executive.lname}
                </p>
                </a>
              ))}
          </div>
          )}
        </div>
        )}
      </div>
    ))}
    </div>
                </div>
              )}
              <div className='users_butt2'>
                <img className='callibrush' src='/CalliBrush.webp' alt='brush' />
              </div>
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
              <div className='d-flex align-items-center justify-content-between importdeal_div'>
                <h2 className='import_deal'>Import Results</h2>
                <FontAwesomeIcon className='close_img' icon={faX} onClick={toggleModal} />
              </div>
              <ImportResult />
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
    </div>
  );
};

export default DirectorAbove;
