import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import '../Leads/Deals.css'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  setUsers,
  setIsLoading,
  setIsModalOpen,
  setIsPopupVisible,
  setIsDropdownOpen,
  setIsTeamDropdown,
  setIsAddLeads,
} from '../../redux/actions';
import AddDeals from '../Leads/AddDeals';
import ImportResult from '../Leads/ImportResult';
import Addleads from '../DirectorLeads/Addleads';

const TeamleadAbove = () => {
    const { userId } = useParams();

    const [currentUserName, setCurrentUserName] = useState(null);
    const [currentUserKey, setCurrentUserKey] = useState(null);

    const dispatch = useDispatch();
    const {
       isPopupVisible,  isModalOpen, isDropdownOpen,  isAddLeads,
        isTeamDropdown
      } = useSelector((state) => state);

      useEffect(() => {
        const fetchUsers = async () => {
            dispatch(setIsLoading(true));
            try {
                const usersResponse = await axios.get(`${process.env.REACT_APP_PORT}/getAllUser`);
                if (usersResponse.data.status === 'ok') {
                  const usersData = usersResponse.data.data;
                    dispatch(setUsers(usersData));
                    
                    const currentUser = usersData.find(user => user._id === userId);
                    const currentUserKey = currentUser?.key1;
                    setCurrentUserKey(currentUserKey);
  
                    const currentUserName = usersData.find(user => user.key === currentUserKey)?.fname;
                    setCurrentUserName(currentUserName);
                    console.log(currentUserName)
  
                    } else {
                    console.error('Failed to fetch users:', usersResponse.data.message);
                }
        
            } catch (error) {
                console.error('Error fetching leads and users:', error);
            } finally {
                dispatch(setIsLoading(false));
            }
        };
  
        fetchUsers();
        
    }, [userId, dispatch]);

      const togglePopadd = () => 
     dispatch(setIsPopupVisible(!isPopupVisible));

      const toggleDropdown = () => dispatch(setIsDropdownOpen(!isDropdownOpen)); 
      
      const toggleModal = () => {
        dispatch(setIsModalOpen(!isModalOpen));
        dispatch( setIsDropdownOpen(false));
       };

       const toggleAssignLeads=() => {
        dispatch(setIsAddLeads(!isAddLeads));
        dispatch(setIsDropdownOpen(false));
      }
      const toggleTeamDropdown = () => dispatch(setIsTeamDropdown(!isTeamDropdown));

  return (
    <div className='main-content'>
        <div className='mt-4 p-3'>
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
                   <div className=''>
                  <p className='import_txt' onClick={toggleModal}>+ Import data</p>
                  <p className='import_txt' onClick={toggleAssignLeads}>+ Add Leads</p>
                  </div> 
                </div>
              )}
            </div>
          </div>
          <div className='d-flex align-items-center justify-content-between'>
            <div className='d-flex mt-4'>
              <img className='pin_img me-1' src='/Pin.webp' alt='pin' />
              <p className='pin_text mt-2'>Pin filters</p>
            </div>
            <div className='d-flex mt-4'>
              <div className='me-3'>
                <p className='ruptxt mt-1'>₨1,720,000·8 deals</p>
              </div>
            
              <div className='users_button d-flex align-items-center justify-content-around me-5'>
                <img className='teamlogo' src='/Teamlogo.webp' alt='team logo' />
                <p className='teamtext'>teams</p>
                <img className='arrowblackimg' src='/arrowblack.webp' alt='arrow black' onClick={toggleTeamDropdown} />
                {isTeamDropdown && (
                  <div className='users_dropdown'>
                    <div className='users_hover'>
                    <p>{currentUserName}</p>
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
               <AddDeals/>
                <div className='bottomdeal_div'>
                  <button className='cancel_btn me-2' onClick={togglePopadd}>Cancel</button>
                  <button className='save_btn'>Save</button>
                </div>
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
               <ImportResult/>
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
  <Addleads/>
              </div>
            </div>
          )}
        </div>
        </div>
  )
}

export default TeamleadAbove