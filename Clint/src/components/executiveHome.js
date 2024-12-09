import React from 'react'
import "./Home.css";
import ExecutiveDasboard from './Dashboard/ExecutiveDashboard/ExecutiveDasboard';
import PopupNotification from './ExecutiveLead/PopupNotification';

const ExecutiveHome = () => {
  
  return (
 
      <div className="main-content">
        <ExecutiveDasboard/>
        <PopupNotification/>
      </div>

  )
}

export default ExecutiveHome
