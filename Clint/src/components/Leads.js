import React from 'react'
import Deals from './Deals/Deals'
import Adminsidebar from '../Sidebar/AdminSidebar'
import UserDetails from './userDetails'



const Leads = () => {
 
  return (
    <div>
      <Adminsidebar/>
      <UserDetails/>
      <div className='main-content'>
        <Deals/>
      </div>
    </div>
  )
}

export default Leads