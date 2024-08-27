import React from 'react'
import "./Home.css";
import Excecutivesidebar from '../Sidebar/ExcecutiveSidebar';
import ExecutiveDasboard from './Dashboard/ExecutiveDasboard';
import UserDetails from './userDetails';


const ExecutiveHome = () => {
  return (
    <div>
      <Excecutivesidebar/>
      <UserDetails/>
      <div className="main-content">
        <ExecutiveDasboard/>
      </div>

    </div>
  )
}

export default ExecutiveHome
