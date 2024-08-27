import React from 'react'
import Projects from './Projects/Projects'
import Adminsidebar from '../Sidebar/AdminSidebar'
import UserDetails from './userDetails'

const Project = () => {
  return (
    <div>
        <Adminsidebar/>
        <UserDetails />
        <div className='main-content'>
        <Projects />
        </div>
    </div>
  )
}

export default Project