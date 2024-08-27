import React from 'react'
import Adminsidebar from '../Sidebar/AdminSidebar'
import Activity from './Activity/Activity'

const AdminActivity = () => {
  return (
    <div>
        <Adminsidebar/>
        <div className='main-content'>
<Activity/>
        </div>
    </div>
  )
}

export default AdminActivity