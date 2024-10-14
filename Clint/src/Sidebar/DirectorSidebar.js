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
import { RiFileSettingsFill } from "react-icons/ri"
import { useLocation } from 'react-router-dom';

const DirectorSidebar = () => {
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
              <img className='sidebarlogo' src='/group white.webp' alt='logo' />
            </div>
            <div className='d-flex iconss'>
            <div className={`sideicon_div ${isActive(`/dirlead/${userId}`) ? 'active' : ''}`}>
            <a href={`/dirlead/${userId}`}>
            <MdMyLocation className='side_icons' />
            </a>
            </div>
            <div className='icons_item'>
              <p className='sideitems_text'>Leads</p>
              </div>
              </div>
              <div className='d-flex iconss'>
            <div className='sideicon_div'>
            <AiFillDollarCircle className='side_icons' />
            </div>
            <div className='icons_item'>
              <p className='sideitems_text'>Deals</p>
              </div>
            </div>
            <div className='d-flex iconss'>
            <div className='sideicon_div'>
            <GoProjectSymlink className='side_icons' />
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
            <div className='sideicon_div'>
            <LuActivitySquare className='side_icons' />
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
            <div className={`sideicon_div ${isActive(`/directorhome/${userId}`) ? 'active' : ''}`}>
              <a href='/directorhome'>
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
            <div className='sideicon_div'>
            <RiFileSettingsFill  className='side_icons' />
            </div>
            <div className='icons_item'>
              <p className='sideitems_text'>Setting</p>
              </div>
            </div>
    </div>
    </div>
  )
}

export default DirectorSidebar