import React, { useState} from 'react';
import ScheduleActivity from './ScheduleActivity';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import './Activity.css'

const Activity = () => {
    const [isShowActivity, setIsShowActivity] = useState(false);

    const togglePopActivity = () => setIsShowActivity(!isShowActivity);
  return (
    <div className=''>
        <div className='d-flex'>
          <div className='buttdiv1'>
            <div className='cont_butt'>
              <img className='bar_chat' src='./bar_img.webp' alt='bar img' />
            </div>
            <div className='bar_butt'>
              <img className='bar_chat' src='./Content.webp' alt='content img' />
            </div>
            <div className='cont_butt'>
              <img className='bar_chat' src='./Rupee.webp' alt='rupee img' />
            </div>
          </div>
          <div className='buttdiv2'>
            <div className='deal_butt1' onClick={togglePopActivity}>
              <p className='deal_butt1_txt'>
                + <span>Activity</span>
              </p>
            </div>
            <div className='deal_butt2' >
              <img className='arrow_down' src='./arrowdown.webp' alt='arrow down' />
            </div>
          
             
          
          </div>
        </div>
        {isShowActivity && (
          <div className='modal'>
            <div className='activity_content'>
              <div className='d-flex align-items-center justify-content-between activitydeal_div'>
                <h2 className='popup_head'>Schedule an activity</h2>
                <FontAwesomeIcon className='close_img' icon={faX} onClick={() => setIsShowActivity(false)} />
              </div>
             <ScheduleActivity />
            </div>
          </div>
        )}
    </div>
  )
}

export default Activity