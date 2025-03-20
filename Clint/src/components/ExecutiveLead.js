import React from 'react';
import ExecutiveAbove from './ExecutiveLead/ExecutiveAbove'
import ExecutiveLead1 from './ExecutiveLead/ExecutiveLead1'
import PopupNotification from './ExecutiveLead/PopupNotification';

const ExecutiveLead = () => {
  return (
    <div className='main-content'>
        <ExecutiveAbove/>
        <ExecutiveLead1/>
        <PopupNotification/>
    </div>
  )
}

export default ExecutiveLead