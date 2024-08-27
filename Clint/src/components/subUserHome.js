import React from 'react'
import TeamleadSidebar from '../Sidebar/TeamleadSidebar'
import UserDetails from './userDetails'
import SubuserDashboard from './Dashboard/SubuserDashboard'

const SubUserHome = () => {
  return (
    <div className="">
    <TeamleadSidebar/>
    <UserDetails/>
     <div className="main-content" >
    <SubuserDashboard/> 
 
    
   </div>
   </div>
  )
}

export default SubUserHome