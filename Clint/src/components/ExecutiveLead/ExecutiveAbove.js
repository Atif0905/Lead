import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useParams } from 'react-router-dom'
import '../Leads/Deals.css'
import {
    setUsers,
    setIsLoading,
    setIsModalOpen,
    setIsPopupVisible,
    setIsDropdownOpen,
  } from '../../redux/actions';
import AddDeals from '../Leads/AddDeals';
import ImportResult from '../Leads/ImportResult';

const ExecutiveAbove = () => {
    const { userId } = useParams();

    const dispatch = useDispatch();
    const {
       isPopupVisible,  isModalOpen, isDropdownOpen,  selectedLeadId,
      } = useSelector((state) => state);


      useEffect(() => {
   
        const fetchUsers = async () => {
          dispatch(setIsLoading(true));
          try {
              const usersResponse = await axios.get(`${process.env.REACT_APP_PORT}/getAllUser`);
              if (usersResponse.data.status === 'ok') {
                const usersData = usersResponse.data.data;
                dispatch(setUsers(usersData));
    
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
    }, [userId]);

    const togglePopadd = () => {
        dispatch(setIsPopupVisible(true));  
      };

      const toggleModal = () => {
        dispatch(setIsModalOpen(!isModalOpen));
        dispatch(setIsDropdownOpen(false));
      };
    
      const toggleDropdown = () => dispatch(setIsDropdownOpen(!isDropdownOpen));

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
                <div className='dropdown-content' onClick={toggleModal}>
                  <p className='import_txt'>+ Import data</p>
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
             
            </div>
          </div>

          {isPopupVisible && (
            <div className='popup'>
              <div className='popup_content'>
                <div className='d-flex align-items-center justify-content-between adddeal_div'>
                  <h2 className='add_deal'>Add Deals</h2>
                  <FontAwesomeIcon className='close_img' icon={faX} onClick={() => dispatch(setIsPopupVisible(false))} />
                </div>
              <AddDeals
                 leadId={selectedLeadId}
                 setIsPopupVisible={setIsPopupVisible} />
               
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
  
        </div>

    </div>
  )
}

export default ExecutiveAbove