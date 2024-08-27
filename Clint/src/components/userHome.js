import React from 'react'
import DirectorSidebar from '../Sidebar/DirectorSidebar';
import UserDetails from './userDetails';
import DirectorDashboard from './Dashboard/DirectorDashboard';

const UserHome = () => {

  return (
      <div>
        <DirectorSidebar/>
        <UserDetails/>
        <div className='main-content'>
     <DirectorDashboard/>
      </div>
    </div>
  )
}

export default UserHome