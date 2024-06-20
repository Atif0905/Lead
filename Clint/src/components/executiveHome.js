import React from 'react'
import "./Home.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Excecutivesidebar from '../Sidebar/ExcecutiveSidebar';
const executiveHome = ({ userData }) => {
    const logOut = () => {
        window.localStorage.clear();
        window.location.href = "./login";
      };
  return (
    <div>
      <Excecutivesidebar/>
      <div className="main-content">
        <div className=''>
          <h1 className='Homehead'>Excecutive Board</h1>
          <div className='d-flex Homesearch'> <FontAwesomeIcon icon={faMagnifyingGlass} className='searchicon'/> <input type='text' placeholder='Search' className='Homesearch'/></div>
          
        </div>
        <div className='boxcontainer mt-3'>
            <div className='Homebox'>
            <h3 className='mt-3 boxheading'>New Leads</h3>
            </div>
            <div className='Homebox'>
            <h3 className='mt-3 boxheading'>Not Picked</h3>
            </div>
            <div className='Homebox'>
            <h3 className='mt-3 boxheading'>Switch Off</h3>
            </div>
            <div className='Homebox'>
            <h3 className='mt-3 boxheading'>Wrong Number</h3>
            </div>
            <div className='Homebox'>
            <h3 className='mt-3 boxheading'>Call Back</h3>
            </div>
            <div className='Homebox'>
            <h3 className='mt-3 boxheading'>Interested</h3>
            </div>
            <div className='Homebox'>
            <h3 className='mt-3 boxheading'>Not Interested</h3>
            </div>
            <div className='Homebox'>
            <h3 className='mt-3 boxheading'>Broker</h3>
            </div>
        </div>
      </div>

    </div>
  )
}

export default executiveHome
