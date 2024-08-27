import React from 'react'

import AdminDashboard from './Dashboard/AdminDashboard'
import Adminsidebar from '../Sidebar/AdminSidebar'
import UserDetails from './userDetails'

const AdminHome = () => {

  return (
    <div>
      <Adminsidebar/>
      <UserDetails/>
       <div className='main-content'>
        <AdminDashboard />
      </div>
    </div>
  )
}

export default AdminHome