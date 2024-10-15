import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import './Deals.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  setUsers,
  setSubUsers,
  setExecutives,
  setIsLoading,
  setIsModalOpen,
  setIsPopupVisible,
  setIsDropdownOpen,
  setIsUserDropdown,
  setIsAddLeads,
} from '../../redux/actions';

import AddDeals from './AddDeals';
import ImportResult from './ImportResult';
import Addleads from '../DirectorLeads/Addleads';

const LeadAbove = () => {
  const { userId } = useParams();

  const dispatch = useDispatch();
  const {
    users,
    subUsers,
    executives,
    isPopupVisible,
    isModalOpen,
    isDropdownOpen,
    isUserDropdown,
    isAddLeads,
  } = useSelector((state) => state);

  useEffect(() => {
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
    fetchUsers();
  }, [userId, dispatch]);

  const togglePopadd = () => dispatch(setIsPopupVisible(!isPopupVisible));

  const toggleModal = () => {
    dispatch(setIsModalOpen(!isModalOpen));
    dispatch(setIsDropdownOpen(false));
  };

  const toggleAssignLeads=() => {
    dispatch(setIsAddLeads(!isAddLeads));
    dispatch(setIsDropdownOpen(false));
  }

  const toggleDropdown = () => dispatch(setIsDropdownOpen(!isDropdownOpen));
  const toggleUserDropdown = () => dispatch(setIsUserDropdown(!isUserDropdown));



  return (
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
              <p className='import_txt'  onClick={toggleModal}>+ Import data</p>
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
          <div className='users_button me-3'>
            <div className='users_butt1'>
              <img className='adminmaleimg' src='/AdministratorMale.webp' alt='admin' />
              <p className='adminname'>Director</p>
              <img
                className='arrowblackimg'
                src='/arrowblack.webp'
                alt='arrow black'
                onClick={toggleUserDropdown}
              />
              {isUserDropdown && (
                <div className='users_dropdown'>
                  <div>
                    {users.map((user) => (
                      <div
                        key={user.key}
                        className='users_hover'
                      >
                        <a href={`/dir1leads/${user._id}`}>
                          <p className='dir_list'>
                            {user.fname} {user.lname}
                          </p>
                        </a>
                     
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
            <div className='d-flex align-items-center justify-content-between adddeal_div'>
              <h2 className='add_deal'>Import Result</h2>
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
             <Addleads/>
              </div>
            </div>
          )}
    </div>
  );
};

export default LeadAbove;
