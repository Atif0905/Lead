import './Sidebar.css';
import React from "react";
import { MdMyLocation } from "react-icons/md";
import { AiFillDollarCircle } from "react-icons/ai";
import { GoProjectSymlink } from "react-icons/go";
import { RiMailDownloadFill } from "react-icons/ri";
import { LuActivitySquare } from "react-icons/lu";
import { MdContactPage } from "react-icons/md";
import { GoGraph } from "react-icons/go";
import { FaBoxArchive } from "react-icons/fa6";
import { RiFileSettingsFill } from "react-icons/ri";

const Adminsidebar = () => {
  const userId = window.localStorage.getItem("userId");

  return (
    <div>
    
    <div className='excecutiveside'>
       
            <div>
              <img className='sidebarlogo' src='/group white.webp' alt='logo' />
            </div>
            <div className='d-flex iconss'>
            <div className='sideicon_div'>
              <a href={`/adminleads/${userId}`}>
            <MdMyLocation className='side_icons' />
            </a>
            </div>
            <div className='icons_item'>
              <p className='sideitems_text'>Leads</p>
              </div>
              </div>
              <div className='d-flex iconss'>
            <div className='sideicon_div'>
              <a href='/adddeals'>
            <AiFillDollarCircle className='side_icons' />
            </a>
            </div>
            <div className='icons_item'>
              <p className='sideitems_text'>Deals</p>
              </div>
            </div>
            <div className='d-flex iconss'>
            <div className='sideicon_div'>
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
            <div className='sideicon_div'>
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
            <div className='sideicon_div'>
              <a href='./'>
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