import React from 'react'
import AddDeals from '../Leads/AddDeals'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';

const Deals = () => {
  return (
    <div className='main-content'>
        <div className='popup'>
            <div className='popup_content'>
              <div className='d-flex align-items-center justify-content-between adddeal_div'>
                <h2 className='add_deal'>Add Deals</h2>
                <FontAwesomeIcon className='close_img' icon={faX} />
              </div>
        <AddDeals/>
        </div>
        </div>
    </div>
  )
}

export default Deals