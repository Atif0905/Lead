import React, { useState, useEffect } from "react";
import './Sidebar.css';
import { MdMyLocation } from "react-icons/md";
import { AiFillDollarCircle } from "react-icons/ai";
import { GoProjectSymlink } from "react-icons/go";
import { RiMailDownloadFill } from "react-icons/ri";
import { LuActivitySquare } from "react-icons/lu";
import { MdContactPage } from "react-icons/md";
import { GoGraph } from "react-icons/go";
import { FaBoxArchive } from "react-icons/fa6";
import { RiFileSettingsFill } from "react-icons/ri";
import { useLocation } from 'react-router-dom';

const Adminsidebar = () => {
  const userId = window.localStorage.getItem("userId");
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const isActive = (path) => activeLink === path;

  return (
    <div>
     
    <div className='excecutiveside'>
            <div>
              <img className='sidebarlogo' src='/llogo.jpeg' alt='logo' />
            </div>
            <div className='d-flex iconss'>
            <div className={`sideicon_div ${isActive(`/adminleads/${userId}`) ? 'active' : ''}`}>
              <a href={`/adminleads/${userId}`}>
            <MdMyLocation className='side_icons' />
            </a>
            </div>
            <div className='icons_item'>
              <p className='sideitems_text'>Leads</p>
              </div>
              </div>
              <div className='d-flex iconss'>
              <div className={`sideicon_div ${isActive('/adddeals') ? 'active' : ''}`}>
              <a href='/adddeals'>
            <AiFillDollarCircle className='side_icons' />
            </a>
            </div>
            <div className='icons_item'>
              <p className='sideitems_text'>Deals</p>
              </div>
            </div>
            <div className='d-flex iconss'>
            <div className={`sideicon_div ${isActive('/projects') ? 'active' : ''}`}>
              <a href='./projects'>
            <GoProjectSymlink className='side_icons' />
            </a>
            </div>
            <div className='icons_item'>
              <p className='sideitems_text'>Projects</p>
              </div>
            </div>
            <div className='d-flex iconss'>
            <div className='sideicon_div'>
            <RiMailDownloadFill className='side_icons' />
            </div>
            <div className='icons_item'>
              <p className='sideitems_text'>Message</p>
              </div>
            </div>
            <div className='d-flex iconss'>
            <div className={`sideicon_div ${isActive('/scheduleactivity') ? 'active' : ''}`}>
            <a href='/scheduleactivity'>
            <LuActivitySquare className='side_icons' />
            </a>
            </div>
            <div className='icons_item'>
              <p className='sideitems_text'>Activities</p>
              </div>
            </div>
            <div className='d-flex iconss'>
            <div className='sideicon_div'>
            <MdContactPage className='side_icons' />
            </div>
            <div className='icons_item'>
              <p className='sideitems_text'>Contacts</p>
              </div>
            </div>
            <div className='d-flex iconss'>
            <div className={`sideicon_div ${isActive(`/admin-dashboard/${userId}`) ? 'active' : ''}`}>
              <a href='/'>
            <GoGraph className='side_icons' />
            </a>
            </div>
            <div className='icons_item'>
              <p className='sideitems_text'>Insights</p>
              </div>
            </div>
            <div className='d-flex iconss'>
            <div className='sideicon_div'>
            <FaBoxArchive className='side_icons' />
            </div>
            <div className='icons_item'>
              <p className='sideitems_text'>Products</p>
              </div>
            </div>
            <div className='d-flex iconss'>
            <div className={`sideicon_div ${isActive('/toolsimport') ? 'active' : ''}`}>
              <a href='/toolsimport'>
            <RiFileSettingsFill  className='side_icons' />
            </a>
            </div>
            <div className='icons_item'>
              <p className='sideitems_text'>Setting</p>
              </div>
            </div>
    </div>
    </div>
  )
}

export default Adminsidebar