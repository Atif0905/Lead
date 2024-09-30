import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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

import {
  setUsers, setIsAddLeads, setDeals, setIsLoading, setStages, setNewStage,  setIsAddingStage,  setSelectedLeadId, setIsAssignLead,
  setIsPopupVisible, setIsModalOpen, setIsDropdownOpen, setIsUserDropdown, setIsTeamDropdown,
} from '../../redux/actions';
import MovetoForm from './MovetoForm';
import LostForm from './LostForm';

const ItemTypes = {
    CARD: 'card',
  };
  
  const DealCard = ({ id, text, moveCard, setDragging, name, status, assignedto, onDealDelete, deal, onDragStart }) => {
    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.CARD,
      item: { id, text, status, assignedto  }, 
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
          </div>
          <div className='dealcard_icon'>
            <FaUserAlt className='deals_usericon' />
            <GoAlertFill className='deals_alerticon' />
          </div>
        </div>
      </div>
    );
  };

  const LostButton = ({ onDrop }) => {
    const [, drop] = useDrop({
      accept: ItemTypes.CARD,
      drop: (item) => onDrop(item, 'lost'),
    });
  
    return (
      <div ref={drop}>
        <button  className='lost_btn'>LOST</button>
      </div>
    );
  };

  const MoveToButton = ({ onDrop }) => {
    const [, drop] = useDrop({
      accept: ItemTypes.CARD,
      drop: (item) => onDrop(item, 'moveTo'),
    });
  
    return (
      <div ref={drop}>
        <button className='dlt_btn'>MOVE TO</button>
      </div>
    );
  };

  const WonButton = ({ onDrop }) => {
    const [, drop] = useDrop({
      accept: ItemTypes.CARD,
      drop: (item) => onDrop(item, 'won'),
    });
  
    return (
      <div ref={drop}>
        <button  className='won_btn'>WON</button>
      </div>
    );
  };
  
  const DealBox = ({ stage, deals, moveCard, setDragging, togglePopadd,  onDelete, onDealDelete, deleteDeal, onDragStart, leadId }) => {
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
              onDealDelete={deleteDeal} 
              onDragStart={onDragStart}
            />
          ))}
        <div className='adddeal_button' onClick={togglePopadd}>
          <FaPlus />
        </div>
      </div>
    );
  };

const ExecutiveLead1 = (deal) => {
  const { userId } = useParams();
  const dispatch = useDispatch();
;

  const {
   users, isAddLeads, deals,   isLoading,   stages, newStage,  isAddingStage,  selectedLeadId,  isAssignLead,  isPopupVisible,  isModalOpen, isDropdownOpen, isUserDropdown, isTeamDropdown
  } = useSelector((state) => state);

  const [isDragging, setIsDragging] = useState(false);
  const [leads, setLeads] = useState([]);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formType, setFormType] = useState(''); 
  const [dealStatus, setDealStatus] = useState(deal.status);
  

  useEffect(() => {
    const savedStages = JSON.parse(localStorage.getItem('dealStages')) || stages;
    dispatch(setStages(savedStages));
  }, []);

  useEffect(() => {
    localStorage.setItem('dealStages', JSON.stringify(stages));
  }, [stages]);

  useEffect(() => {
   
      const fetchLeadsAndUsers = async () => {
        dispatch(setIsLoading(true));
        try {
            const usersResponse = await axios.get(`${process.env.REACT_APP_PORT}/getAllUser`);
            if (usersResponse.data.status === 'ok') {
              const usersData = usersResponse.data.data;
              dispatch(setUsers(usersData));

              const currentUser = usersData.find(user => user._id === userId);
              const currentUserKey = currentUser?.fname;

                const leadsResponse = await axios.get(`${process.env.REACT_APP_PORT}/leads`);
                const allLeads = leadsResponse.data;
               const filteredLeads = allLeads.filter(lead => lead.assignedto === currentUserKey);

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
               dispatch(setDeals(formattedDeals));
            } else {
                console.error('Failed to fetch users:', usersResponse.data.message);
            }
        } catch (error) {
            console.error('Error fetching leads and users:', error);
        } finally {
          dispatch(setIsLoading(false));
        }
    };

    fetchLeadsAndUsers();
  }, [userId]);

  const togglePopadd = () => {
    dispatch(setIsPopupVisible(true));  
  };

  const toggleModal = () => {
    dispatch(setIsModalOpen(!isModalOpen));
    dispatch(setIsDropdownOpen(false));
  };

  const toggleDropdown = () => dispatch(setIsDropdownOpen(!isDropdownOpen));
   
  const moveCard = async (draggedId, droppedStage) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_PORT}/leads/move/${draggedId}`, { newStatus: droppedStage });
      const updatedLead = response.data;

      const updatedDeals = deals.map((deal) =>
        deal.id === draggedId ? { ...deal, status: droppedStage } : deal
      );
      dispatch(setDeals(updatedDeals));
    } catch (error) {
      console.error('Error moving card:', error);
    }
  };

  const handleAddStage = (e) => {
    e.preventDefault();
    if (newStage) {
      const updatedStages = [...stages, newStage];
      dispatch(setStages(updatedStages));
      dispatch(setNewStage(''));
      dispatch(setIsAddingStage(false));
    }
  };

  const handleDeleteStage = (stageToDelete) => {
    if (window.confirm(`Are you sure you want to delete the stage "${stageToDelete}"?`)) {
      const updatedStages = stages.filter(stage => stage !== stageToDelete);
      dispatch(setStages(updatedStages));
      const updatedDeals = deals.filter(deal => deal.status !== stageToDelete);
      dispatch(setDeals(updatedDeals));
    }
  };

  const deleteDeal = async (dealId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_PORT}/deleteleads/${dealId}`);
      const updatedDeals = deals.filter(deal => deal.id !== dealId);
      dispatch(setDeals(updatedDeals));
    } catch (error) {
      console.error('Error deleting deal:', error);
    }
  };

  const handleDrop = (deal, dropType, leadId) => {
    setSelectedDeal(deal); 
    setFormType(dropType); 
    setIsFormVisible(true); 
    dispatch(setSelectedLeadId(leadId));
  };

  const handleStatusUpdate = (newStatus) => {
    setDealStatus(newStatus); 
  };

  const handleWonDrop = async (item) => {
    try {
     
      const response = await axios.put(`${process.env.REACT_APP_PORT}/leads/update/${item.id}`, { status: 'won' });
      if (response.status === 200) {
        console.log('Lead status updated to won');
     
      }
    } catch (error) {
      console.error('Failed to update lead status:', error);
    }
  };

return(
  <DndProvider backend={HTML5Backend}>
<div className="main-content">
    
        <div className='mt-4 ps-3 '>
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
                <div className='dropdown-content' onClick={toggleModal}>
                  <p className='import_txt'>+ Import data</p>
                </div>
              )}
            </div>
          </div>
  
          <div className='d-flex align-items-center justify-content-between'>
            <div className='d-flex mt-4'>
              <img className='pin_img me-1' src='/Pin.webp' alt='pin' />
              <p className='pin_text mt-2'>Pin filters</p>
            </div>
            <div className='d-flex mt-4'>
             
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
                onDelete={handleDeleteStage}
                onDealDelete={deleteDeal} 
                leadId={selectedLeadId}
              />
            ))}
            <div className="add-stage-form mt-2">
              {!isAddingStage ? (
                <button className='add-stage-button' onClick={() => dispatch(setIsAddingStage(true))}> <FaPlus /></button>
              ) : (
                <form onSubmit={handleAddStage}>
                  <input 
                    type="text" 
                    value={newStage} 
                    onChange={(e) => dispatch(setNewStage(e.target.value))} 
                    placeholder="New Stage Name"
                  />
                  <button className='add' type="submit">Submit</button>
                  <button type="button" onClick={() => dispatch(setIsAddingStage(false))}>Cancel</button>
                </form>
              )}
            </div>
          </div>
  
          {isPopupVisible && (
            <div className='popup'>
              <div className='popup_content'>
                <div className='d-flex align-items-center justify-content-between adddeal_div'>
                  <h2 className='add_deal'>Add Deals</h2>
                  <FontAwesomeIcon className='close_img' icon={faX} onClick={() => dispatch(setIsPopupVisible(false))} />
                </div>
                <AddDeals 
                 leadId={selectedLeadId}
                 setIsPopupVisible={setIsPopupVisible} />
               
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
            {isDragging && (
            <div className='buttons_div p-2 '>
              <button className='dlt_btn'>DELETE</button>
              {/* <button  className='lost_btn'>LOST</button> */}
              <LostButton onDrop={handleDrop} />
              <WonButton onDrop={handleWonDrop} />
              {/* <button className='dlt_btn' >MOVE TO</button> */}
              <MoveToButton onDrop={handleDrop} />
            </div>
            )}
        
        {isFormVisible && selectedDeal && formType === 'moveTo' && (
          <MovetoForm 
          deal={selectedDeal}
          leadId={selectedLeadId}
          setIsFormVisible={setIsFormVisible}
          onStatusUpdate={handleStatusUpdate}/>
         )}

        {isFormVisible && selectedDeal && formType === 'lost' && (
         <LostForm
         deal={selectedDeal}
         setIsFormVisible={setIsFormVisible}
         />
        )}
        </div>
    
      </div>
      </DndProvider>
)
}
export default ExecutiveLead1