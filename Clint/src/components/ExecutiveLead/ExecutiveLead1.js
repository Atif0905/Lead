import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import '../Leads/Deals.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { FaUserAlt, FaPlus } from 'react-icons/fa';
import { GoAlertFill } from 'react-icons/go';
import ImportResult from '../Leads/ImportResult';
import AddDeals from '../Leads/AddDeals';
import AssignPopup4 from './AssignPopup4';


const ItemTypes = {
    CARD: 'card',
  };
  
  const DealCard = ({ id, text, moveCard, setDragging, toggleAssign2, name, status, assignedto, onDealDelete }) => {
    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.CARD,
      item: { id },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });
  
    useEffect(() => {
      setDragging(isDragging);
    }, [isDragging, setDragging]);
  
    return (
      <div
        ref={drag}
        className='dealcard'
        style={{ opacity: isDragging ? 0.5 : 1 }}>
        <div className='dealcard_content'>
          <p className='deal_head1'>{status}</p>
          <p className='deal_head2'>{assignedto}</p>
          <div className='d-flex justify-content-between'>
            <p className='deal_head3'>{text}</p> 
            {/* <button onClick={() => onDealDelete(id)}>Dlt-lead</button> */}
          </div>
          <div className='dealcard_icon'>
            <FaUserAlt className='deals_usericon' onClick={() => toggleAssign2(id)} />
            <GoAlertFill className='deals_alerticon' />
          </div>
        </div>
      </div>
    );
  };
  
  const DealBox = ({ stage, deals, moveCard, setDragging, togglePopadd, toggleAssign2, onDelete, onDealDelete, deleteDeal }) => {
    const [, drop] = useDrop({
      accept: ItemTypes.CARD,
      drop: (item) => moveCard(item.id, stage),
    });
  
    return (
      <div ref={drop} className='Dealbox'>
        <div className='d-flex justify-content-between align-items-center'>
          <h3 className='dealheading ms-2'>{stage}</h3>
          <button className='stage_dlt' onClick={() => onDelete(stage)}>Delete</button>
        </div>
        {deals
          .filter((deal) => deal.status === stage)
          .map((deal) => (
            <DealCard
              key={deal.id}
              id={deal.id}
              name={deal.name}
              assignedto={deal.assignedto}
              status={deal.status}
              text={deal.text}
              email={deal.email}
              title={deal.title}
              moveCard={moveCard}
              setDragging={setDragging}
              toggleAssign2={toggleAssign2}
              onDealDelete={deleteDeal} 
            />
          ))}
        <div className='adddeal_button' onClick={togglePopadd}>
          <FaPlus />
        </div>
      </div>
    );
  };

const ExecutiveLead1 = () => {
  const [users, setUsers] = useState([]); 
  const [isAssignLead, setIsAssignLead] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdown, setIsUserDropdown] = useState(false);
  const [isTeamDropdown, setIsTeamDropdown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [deals, setDeals] = useState([]);
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [stages, setStages] = useState([
    'Lead In', 
    'Contact Made', 
    'Switch Off', 
    'Wrong Number', 
    'Call Back', 
    'Interested', 
    'Not Interested', 
    'Broker'
  ]);
  const [newStage, setNewStage] = useState('');
  const [isAddingStage, setIsAddingStage] = useState(false);

  useEffect(() => {
    const savedStages = JSON.parse(localStorage.getItem('dealStages')) || stages;
    setStages(savedStages);
  }, []);

  useEffect(() => {
    localStorage.setItem('dealStages', JSON.stringify(stages));
  }, [stages]);

  useEffect(() => {
      const fetchLeads = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(`${process.env.REACT_APP_PORT}/leads`);
          const allLeads = response.data;
  
          
          const filteredLeads = allLeads.filter(lead => lead.assignedto === 'Executive1 a');
  
          setLeads(filteredLeads);
          const formattedDeals = filteredLeads.map(lead => ({
            id: lead._id,
            name: lead.name,
            text: lead.number,
            title: lead.title,
            email: lead.email,
            status: lead.status,
            stage: 'Lead In',
            assignedto: lead.assignedto || [],
          }));
          setDeals(formattedDeals);
        } catch (error) {
          console.error('Error fetching leads:', error);
        } finally {
          setIsLoading(false);
        }
      };
  

    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const usersResponse = await axios.get(`${process.env.REACT_APP_PORT}/getAllUser`);
        if (usersResponse.data.status === 'ok') {
          const directors = usersResponse.data.data.filter(user => user.userType === 'User');
          const subUsers = usersResponse.data.data.filter(user => user.userType === 'SubUser');
          setUsers([...directors, ...subUsers]); 
        } else {
          console.error('Failed to fetch users:', usersResponse.data.message);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
    fetchUsers();
  }, []);

  const togglePopadd = () => setIsPopupVisible(!isPopupVisible);

  const toggleAssign2 = (leadId) => {
    setSelectedLeadId(leadId);
    setIsAssignLead(true);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleUserDropdown = () => setIsUserDropdown(!isUserDropdown);
  const toggleTeamDropdown = () => setIsTeamDropdown(!isTeamDropdown);

  const moveCard = async (draggedId, droppedStage) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_PORT}/leads/move/${draggedId}`, { newStatus: droppedStage });
      const updatedLead = response.data;

      const updatedDeals = deals.map((deal) =>
        deal.id === draggedId ? { ...deal, status: droppedStage } : deal
      );
      setDeals(updatedDeals);
    } catch (error) {
      console.error('Error moving card:', error);
    }
  };

  const handleAddStage = (e) => {
    e.preventDefault();
    if (newStage) {
      const updatedStages = [...stages, newStage];
      setStages(updatedStages);
      setNewStage('');
      setIsAddingStage(false);
    }
  };

  const handleDeleteStage = (stageToDelete) => {
    if (window.confirm(`Are you sure you want to delete the stage "${stageToDelete}"?`)) {
      const updatedStages = stages.filter(stage => stage !== stageToDelete);
      setStages(updatedStages);
      const updatedDeals = deals.filter(deal => deal.status !== stageToDelete);
      setDeals(updatedDeals);
    }
  };

  const deleteDeal = async (dealId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_PORT}/deleteleads/${dealId}`);
      const updatedDeals = deals.filter(deal => deal.id !== dealId);
      setDeals(updatedDeals);
    } catch (error) {
      console.error('Error deleting deal:', error);
    }
  };
return(

<div className="main-content">
      <DndProvider backend={HTML5Backend}>
        <div className='mt-4 ps-3'>
          <div className='d-flex'>
            <div className='buttdiv1'>
              <div className='cont_butt'>
                <img className='bar_chat' src='./bar_img.webp' alt='bar img' />
              </div>
              <div className='bar_butt'>
                <img className='bar_chat' src='./Content.webp' alt='content img' />
              </div>
              <div className='cont_butt'>
                <img className='bar_chat' src='./Rupee.webp' alt='rupee img' />
              </div>
            </div>
            <div className='buttdiv2'>
              <div className='deal_butt1' onClick={togglePopadd}>
                <p className='deal_butt1_txt'>
                  + <span>Deal</span>
                </p>
              </div>
              <div className='deal_butt2' onClick={toggleDropdown}>
                <img className='arrow_down' src='./arrowdown.webp' alt='arrow down' />
              </div>
              {isDropdownOpen && (
                <div className='dropdown-content' onClick={toggleModal}>
                  <p className='import_txt'>+ Import data</p>
                </div>
              )}
            </div>
          </div>
  
          <div className='d-flex align-items-center justify-content-between'>
            <div className='d-flex mt-4'>
              <img className='pin_img me-1' src='./Pin.webp' alt='pin' />
              <p className='pin_text mt-2'>Pin filters</p>
            </div>
            <div className='d-flex mt-4'>
              <div className='me-3'>
                <p className='ruptxt mt-1'>₨1,720,000·8 deals</p>
              </div>
              <div className='users_button me-3'>
                <div className='users_butt1'>
                  <img className='adminmaleimg' src='./AdministratorMale.webp' alt='admin' />
                  <p className='adminname'>{users[0]?.fname || 'Loading...'}</p>
                  <img className='arrowblackimg' src='./arrowblack.webp' alt='arrow black' onClick={toggleUserDropdown} />
                </div>
                {isUserDropdown && (
                  <div className='users_dropdown'>
                    {users.map((user) => (
                      <p key={user.id} className='dir_list'>{user.fname} {user.lname}</p>
                    ))}
                  </div>
                )}
                <div className='users_butt2'>
                  <img className='callibrush' src='./CalliBrush.webp' alt='brush' />
                </div>
              </div>
  
              <div className='users_button d-flex align-items-center justify-content-around me-3'>
                <img className='teamlogo' src='./Teamlogo.webp' alt='team logo' />
                <p className='teamtext'>{users[0]?.fname || 'Loading...'}</p>
                <img className='arrowblackimg' src='./arrowblack.webp' alt='arrow black' onClick={toggleTeamDropdown} />
                {isTeamDropdown && (
                  <div className='users_dropdown'>
                    {users
                      .filter(user => user.userType === 'SubUser')
                      .map((user) => (
                        <p key={user.id} className='dir_list'>{user.fname} {user.lname}</p>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
  
          <div className='dealscontainer mt-2'>
            {stages.map((stage, index) => (
              <DealBox
                key={index}
                stage={stage}
                deals={deals}
                moveCard={moveCard}
                setDragging={setIsDragging}
                togglePopadd={togglePopadd}
                toggleAssign2={toggleAssign2}
                onDelete={handleDeleteStage}
                onDealDelete={deleteDeal} 
              />
            ))}
            <div className="add-stage-form mt-2">
              {!isAddingStage ? (
                <button className='add-stage-button' onClick={() => setIsAddingStage(true)}> <FaPlus /></button>
              ) : (
                <form onSubmit={handleAddStage}>
                  <input 
                    type="text" 
                    value={newStage} 
                    onChange={(e) => setNewStage(e.target.value)} 
                    placeholder="New Stage Name"
                  />
                  <button className='add' type="submit">Submit</button>
                  <button type="button" onClick={() => setIsAddingStage(false)}>Cancel</button>
                </form>
              )}
            </div>
          </div>
  
          {isPopupVisible && (
            <div className='popup'>
              <div className='popup_content'>
                <div className='d-flex align-items-center justify-content-between adddeal_div'>
                  <h2 className='add_deal'>Add Deals</h2>
                  <FontAwesomeIcon className='close_img' icon={faX} onClick={togglePopadd} />
                </div>
                <AddDeals />
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
  
          {isAssignLead && (
            <div className='modal'>
              <div className='modal_content'>
                <div className='d-flex align-items-center justify-content-between importdeal_div'>
                  <h2 className='import_deal'>Assign Leads</h2>
                  <FontAwesomeIcon className='close_img' icon={faX} onClick={() => setIsAssignLead(false)} />
                </div>
               <AssignPopup4
                  leadId={selectedLeadId} 
                  setIsAssignLead={setIsAssignLead} 
                  deals={deals} 
                  setDeals={setDeals} 
                />
              </div>
            </div>
          )}
  
          {isDragging && (
            <div className='buttons_div p-2'>
              <button className='dlt_btn'>DELETE</button>
              <button className='lost_btn'>LOST</button>
              <button className='won_btn'>WON</button>
              <button className='dlt_btn'>MOVE TO</button>
            </div>
          )}
        </div>
      </DndProvider>
      </div>

)
}
export default ExecutiveLead1