import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import '../Leads/Deals.css'
import axios from 'axios';
import { useParams , useNavigate } from 'react-router-dom';
import {
  setUsers,
  setLeads,
  setSubUsers,
  setExecutives,
  setIsLoading,
  setIsModalOpen,
  setIsPopupVisible,
  setIsDropdownOpen,
  setIsTeamDropdown,
  setIsAddLeads,
} from '../../redux/actions';
import AddDeals from '../Leads/AddDeals';
import ImportResult from '../Leads/ImportResult';
import Addleads from '../DirectorLeads/Addleads';
import { FaBell } from "react-icons/fa6";

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
      
      }, [userId, dispatch, currentUserKey]);

      useEffect(() => {
        const fetchLeadsexecutive = async () => {
          try {
            // Fetch leads
            const leadsResponse = await axios.get(`${process.env.REACT_APP_PORT}/leads`);
            const fetchedLeads = leadsResponse.data;
            setAllLeads(fetchedLeads);
      
            // Filter executives to find the matching one
            const matchingExecutives = executives.filter((executive) => executive.key === currentUserKey);
      
            if (matchingExecutives.length > 0) {
              const matchingExecutiveId = matchingExecutives[0].id; // Assuming 'id' exists in executives
      
              // Filter leads where assignedto matches the matching executive's id
              const filteredLeads = fetchedLeads.filter((lead) => lead.assignedto === matchingExecutiveId);
              setFilterLead(filteredLeads);
      
              // Filter leads for "Call Back" status with matching callbackDate and callbackTime
              const currentDate = new Date();
              const formattedDate = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
              console.log(formattedDate)
              const formattedTime = currentDate.toTimeString().split(":").slice(0, 2).join(":"); // Format as HH:MM
              const callbackLeads = filteredLeads.filter(
                (lead) =>
                lead.status === "Call Back" &&
                lead.callbackDate <= formattedDate &&
                lead.callbackTime <= formattedTime
              );
              console.log("Filtered Callback Leads:", callbackLeads);
              // Optionally, update state for callback leads
              setCallbackLeads(callbackLeads); // Create state for callback leads if needed
            }
            // Set matching user count
            setMatchingUserCount(matchingExecutives.length);
          } catch (error) {
            console.error("Error fetching leads or calculating count:", error);
          }
        };
      
        fetchLeadsexecutive(); // Call the async function
      }, [executives, currentUserKey]);


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
            for (let i = 0; i < filteredLeads.length; i++) {
                const lead = filteredLeads[i];
                const executive = eligibleExecutives[executiveIndex];
                
                // Update the lead assignment
                lead.assignedto = executive.id;
    
                // Call the API to update the lead's assignedto field
                await axios.put(`${process.env.REACT_APP_PORT}/leads/move/${lead._id}`, {
                    assignedto: executive.id, // Use key1 to assign
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
    <div className='main-content'>
        <div className='mt-4 p-3'>
        <div className='d-flex'>
            <div className='buttdiv1'>
              <div className='cont_butt'>
                <img className='bar_chat' src='/bar_img.webp' alt='bar img' />
              </div>
              <div className='bar_butt'>
                <img className='bar_chat' src='/Content.webp' alt='content img' />
              </div>
              <div className='cont_butt'>
                <img className='bar_chat' src='/Rupee.webp' alt='rupee img' />
              </div>
            </div>
            <div className='buttdiv2'>
              <div className='deal_butt1' onClick={togglePopadd}>
                <p className='deal_butt1_txt'>
                  + <span>Deal</span>
                </p>
              </div>
              <div className='deal_butt2' onClick={toggleDropdown}>
                <img className='arrow_down' src='/arrowdown.webp' alt='arrow down' />
              </div>
              {isDropdownOpen && (
                <div className='dropdown-content'>
                   <div className=''>
                  <p className='import_txt' onClick={toggleModal}>+ Import data</p>
                  <p className='import_txt' onClick={toggleAssignLeads}>+ Add Leads</p>
                  </div> 
                </div>
              )}
            </div>
          </div>
          <div className='d-flex align-items-center justify-content-between mt-4'>
            <div>
            <button className='automatic_button' onClick={assignLeadsAutomatically}>Assign Leads</button>
            </div>
            <div className='d-flex'>
            
              <div className='users_button d-flex align-items-center justify-content-around me-5'>
                <img className='teamlogo' src='/Teamlogo.webp' alt='team logo' />
                <p className='teamtext'>{selectedName}</p>
                <img className='arrowblackimg' src='/arrowblack.webp' alt='arrow black' onClick={toggleTeamDropdown} />
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
                                callbackLeads.map((lead) => (
                                    <div key={lead.id} className="dropdown-item">
                                        <p className="lead-name">
                                            {lead.name} labsed call
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="dropdown-empty">No Callback Leads</p>
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
        </div>
  )
}

export default TeamleadAbove