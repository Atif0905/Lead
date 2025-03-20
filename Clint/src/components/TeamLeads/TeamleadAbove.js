import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import '../Leads/Deals.css'
import axios from 'axios';
import { useParams , useNavigate } from 'react-router-dom';
import {setUsers, setLeads, setSubUsers, setExecutives, setIsLoading, setIsModalOpen, setIsPopupVisible,setIsDropdownOpen, setIsTeamDropdown, setIsAddLeads} from '../../redux/actions';
import AddDeals from '../Leads/AddDeals';
import ImportResult from '../Leads/ImportResult';
import Addleads from '../DirectorLeads/Addleads';
import { FaBell } from "react-icons/fa6";
import { RiArrowDownSFill } from "react-icons/ri";
import { FaUserTie } from "react-icons/fa6";

const TeamleadAbove = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [currentUserKey, setCurrentUserKey] = useState(null);
    const [selectedName, setSelectedName] = useState('User');
    const [matchingUserCount, setMatchingUserCount] = useState(0);
    const [allleads, setAllLeads] = useState([]); 
    const [filterlead, setFilterLead] = useState([]); 
    const [callbackLeads, setCallbackLeads] = useState([]);
    const [isBellDropdownOpen, setIsBellDropdownOpen] = useState(false);

 // Toggles the notification bell dropdown
    const toggleBellDropdown = () => {
      setIsBellDropdownOpen(!isBellDropdownOpen);
  };
    
    const {
       isPopupVisible,  isModalOpen, isDropdownOpen,  isAddLeads,
        isTeamDropdown, subUsers, executives, leads
      } = useSelector((state) => state);

      useEffect(() => {
        const fetchUsersAndLeads = async () => {
            dispatch(setIsLoading(true));
            try {
              // Fetch users
              const usersResponse = await axios.get(`${process.env.REACT_APP_PORT}/getAllUser`);
              if (usersResponse.data.status === 'ok') {
                const allUsers = usersResponse.data.data;
                dispatch(setUsers(allUsers));
                dispatch(setSubUsers(allUsers.filter(user => user.userType === 'SubUser')));
                dispatch(setExecutives(allUsers.filter(user => user.userType === 'Executive')));
              // Get the current user and set the key for filtering leads
                const currentUser = allUsers.find(user => user._id === userId);
                if (currentUser) {
                  setCurrentUserKey(currentUser.key1);
                }
              } else {
                console.error('Failed to fetch users:', usersResponse.data.message);
              }
              // Fetch leads
              const leadsResponse = await axios.get(`${process.env.REACT_APP_PORT}/leads`);
              if (leadsResponse.status === 200) {
              //  Get the leads whose assignedto matches the current user key.
                const filteredLeads = leadsResponse.data.filter(lead => lead.assignedto === currentUserKey);
                dispatch(setLeads(filteredLeads));
              } else {
                console.error('Failed to fetch leads:', leadsResponse.data.message);
              }
            } catch (error) {
              console.error('Error fetching users or leads:', error);
            } finally {
              dispatch(setIsLoading(false));
            }
        };
        fetchUsersAndLeads();
      }, [userId, dispatch, currentUserKey]);  // Re-run when userId or currentUserKey changes

      useEffect(() => {
        const fetchLeadsexecutive = async () => {
          try {
            // Fetch leads
            const leadsResponse = await axios.get(`${process.env.REACT_APP_PORT}/leads`);
            const fetchedLeads = leadsResponse.data;
            setAllLeads(fetchedLeads);
      
           // Filter executives based on the current user's key
            const matchingExecutives = executives.filter((executive) => executive.key === currentUserKey);
      
            if (matchingExecutives.length > 0) {
              const matchingExecutiveId = matchingExecutives[0].id; // Assuming 'id' exists in executives
      
              // Filter leads where assignedto matches the matching executive's id
              const filteredLeads = fetchedLeads.filter((lead) => lead.assignedto === matchingExecutiveId);
              setFilterLead(filteredLeads);
              // console.log(filteredLeads)
      
        // Combine lead updates with the lead name
        const lastLeadUpdates = filteredLeads.map((lead) => {
          const lastUpdate = lead.updates[lead.updates.length - 1]; // Get the last update
          if (lastUpdate) {
            return {
              ...lastUpdate,
              leadName: lead.name, // Assuming 'name' is the lead's name field
            };
          }
          return null; // Handle leads with no updates
        }).filter(Boolean); // Remove null values for leads without updates
        
        console.log(lastLeadUpdates);
              
              // Filter leads for "Call Back" status with matching callbackDate and callbackTime
              const currentDate = new Date();
              const formattedDate = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
              console.log(formattedDate)
              const formattedTime = currentDate.toTimeString().split(":").slice(0, 2).join(":"); // Format as HH:MM
              const callbackLeads = lastLeadUpdates .filter(
                (update) =>
                  update.status === "Call Back" &&
                update.callbackDate <= formattedDate &&
                update.callbackTime <= formattedTime 
              );
              // console.log("Filtered Callback Leads:", callbackLeads);
              // Optionally, update state for callback leads
              setCallbackLeads(callbackLeads); // Store callback leads in state
            }
            // Set matching user count
            setMatchingUserCount(matchingExecutives.length);
          } catch (error) {
            console.error("Error fetching leads or calculating count:", error);
          }
        };
        fetchLeadsexecutive(); 
      }, [executives, currentUserKey]); // Re-run when executives or currentUserKey changes

  // Function to automatically assign leads to executives
      const assignLeadsAutomatically = async () => {
        if (executives.length === 0 || leads.length === 0) {
            console.error("No executives or leads available for assignment.");
            return;
        }
    
        const filteredLeads = leads.filter(lead => lead.assignedto === currentUserKey);
        if (filteredLeads.length === 0) {
            console.error("No filtered leads available for assignment.");
            return;
        }
    
        const eligibleExecutives = executives.filter(executive => executive.key === currentUserKey);
        
    
        if (eligibleExecutives.length === 0) {
            console.error("No eligible executives found for currentUserKey:", currentUserKey);
            return;
        }
    
        let executiveIndex = 0; // Start assigning from the first executive
    
        try {
          // Assign leads to executives in a round-robin fashion
            for (let i = 0; i < filteredLeads.length; i++) {
                const lead = filteredLeads[i];
                const executive = eligibleExecutives[executiveIndex];
                
                // Update the lead assignment
                lead.assignedto = executive.id;
    
                // Call the API to update the lead's assignedto field
                await axios.put(`${process.env.REACT_APP_PORT}/leads/move/${lead._id}`, {
                    assignedto: executive.id, // Use executive's id for assignment
                });
    
                // Move to the next executive (round-robin)
                executiveIndex = (executiveIndex + 1) % eligibleExecutives.length;
            }
    
            // Update the state with the newly assigned leads
            dispatch(setLeads(filteredLeads));
            console.log("Leads distributed successfully among executives!");
    
        } catch (error) {
            console.error("Error assigning leads:", error);
        }
    };
    
      const togglePopadd = () => 
     dispatch(setIsPopupVisible(!isPopupVisible));

      const toggleDropdown = () => dispatch(setIsDropdownOpen(!isDropdownOpen)); 
      
      const toggleModal = () => {
        dispatch(setIsModalOpen(!isModalOpen));
        dispatch( setIsDropdownOpen(false));
       };

       const toggleAssignLeads=() => {
        dispatch(setIsAddLeads(!isAddLeads));
        dispatch(setIsDropdownOpen(false));
      }
      const toggleTeamDropdown = () => dispatch(setIsTeamDropdown(!isTeamDropdown));

  return (
        <div className='mt-4 p-3'>
        <div className='d-flex'>
           
            <div className='buttdiv2'>
              <div className='d-flex align-items-center justify-content-center'>
                <p className='deal_butt1_txt'>
                  + <span>Lead</span>
                </p>
              </div>
              <div className='d-flex align-items-center justify-content-center' onClick={toggleDropdown}>
                <RiArrowDownSFill  className='arrow_down' />
              </div>
              {isDropdownOpen && (
                <div className='dropdown-content'>
                   <div className=''>
                  <p className='import_txt' onClick={toggleModal}>+ Import data</p>
                  <p className='import_txt' onClick={toggleAssignLeads}>+ Add Leads</p>
                  <p className='import_txt' onClick={assignLeadsAutomatically}>+ Automatic assign Leads</p>
                  </div> 
                </div>
              )}
            </div>
          </div>
          <div className='d-flex align-items-center justify-content-between mt-4'>
            <div>
           
            </div>
            <div className='d-flex'>
            
              <div className='users_button d-flex align-items-center justify-content-around me-5'>
                <FaUserTie className='adminmaleimg'/>
                <p className='teamtext'>{selectedName}</p>
                 <RiArrowDownSFill className='arrowblackimg'  onClick={toggleTeamDropdown} />
                {isTeamDropdown && (
                    <div className='users_dropdown'>
                    <div>
                    {executives.map((executive) => (
                 <div key={executive.key}>
          {currentUserKey === executive.key && (
            <div className='users_hover'>
                <a  onClick={() => { 
                  setSelectedName(`${executive.fname} ${executive.lname}`);
                  navigate(`/executiveleads/${executive._id}`)
                  }}>
            <p className='dir_list'>{executive.fname} {executive.lname}</p>
            </a>
            </div>
          )}
        </div>
      ))}
      </div>
      </div>
      )}
              </div>
              <div className='me-3'>
              <FaBell className='noti_bell' onClick={toggleBellDropdown} />
              {callbackLeads.length > 0 && (
  <span className="badge">{callbackLeads.length}</span>
)}
  {isBellDropdownOpen && (
                        <div className="bell-dropdown">
                           {callbackLeads.length > 0 ? (
      callbackLeads.map((lead, index) => (
        <div key={index} className="callback-lead">
          <p>{lead.leadName} - Callback Time Labsed</p>
        </div>
      ))
    ) : (
      <p>No callback leads available.</p>
    )}
                        </div>
                    )}
              </div>
            </div>
          </div>

          {isPopupVisible && (
            <div className='popup'>
              <div className='popup_content'>
                <div className='d-flex align-items-center justify-content-between adddeal_div'>
                  <h2 className='add_deal'>Add Deals</h2>
                  <FontAwesomeIcon className='close_img' icon={faX} onClick={togglePopadd} />
                </div>
               <AddDeals/>
                <div className='bottomdeal_div'>
                  <button className='cancel_btn me-2' onClick={togglePopadd}>Cancel</button>
                  <button className='save_btn'>Save</button>
                </div>
              </div>
            </div>
          )}
  
          {isModalOpen && (
            <div className='modal'>
              <div className='modal_content'>
                <div className='d-flex align-items-center justify-content-between importdeal_div'>
                  <h2 className='import_deal'>Import Results</h2>
                  <FontAwesomeIcon className='close_img' icon={faX} onClick={toggleModal} />
                </div>
               <ImportResult/>
              </div>
            </div>
          )}
          
{isAddLeads && (
            <div className='modal'>
              <div className='modal_content'>
                <div className='d-flex align-items-center justify-content-between importdeal_div'>
                  <h2 className='import_deal'>Add Leads</h2>
                  <FontAwesomeIcon className='close_img' icon={faX} onClick={toggleAssignLeads} />
                </div>
  <Addleads/>
              </div>
            </div>
          )}
        </div>
  )
}

export default TeamleadAbove