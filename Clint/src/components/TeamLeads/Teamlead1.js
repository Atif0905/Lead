import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import '../Leads/Deals.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { FaUserAlt, FaPlus } from 'react-icons/fa';
import { GoAlertFill } from 'react-icons/go';
import AssignPopup3 from './AssignPopup3';
import {
  setUsers, setDeals, setIsLoading, setStages, setNewStage, setSubUsers, setExecutives,  setIsAddLeads,  setIsAddingStage,  setSelectedLeadId, setIsAssignLead, setIsPopupVisible, setIsDragging, setIsModalOpen, setIsDropdownOpen, setIsTeamDropdown,
} from '../../redux/actions';
import TeamMovetoForm from './TeamMovetoForm';
import TeamDltForm from './TeamDltForm';
import TeamLostForm from './TeamLostForm';
import AddDeals from '../Leads/AddDeals';
import ImportResult from '../Leads/ImportResult';
import Addleads from '../DirectorLeads/Addleads';

const ItemTypes = {
    CARD: 'card',
  };
  
  const DealCard = ({ id, text,  setDragging, toggleAssign2, status, assignedto}) => {
    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.CARD,
      item: { id, text, status, assignedto},
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
            <FaUserAlt className='deals_usericon' onClick={() => toggleAssign2(id, assignedto)} />
             <div>
            <GoAlertFill className='deals_alerticon' />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DeleteButton = ({ onDrop }) => {
    const [, drop] = useDrop({
      accept: ItemTypes.CARD,
      drop: (item) => onDrop(item, 'Delete'),
    });
  
    return (
      <div ref={drop}>
        <button  className='dlt_btn'>DELETE</button>
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
  
  const DealBox = ({ stage, deals, moveCard, setDragging, togglePopadd, toggleAssign2, onDelete, onDealDelete, deleteDeal, handleDeleteDeal }) => {
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
              handleDeleteDeal={handleDeleteDeal}
            />
          ))}
        <div className='adddeal_button' onClick={togglePopadd}>
          <FaPlus />
        </div>
      </div>
    );
  };

const Teamlead1 = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const {
    users, isAddLeads, deals,   isLoading,   stages, newStage, executives, isAddingStage,  selectedLeadId,  isAssignLead,  isPopupVisible,  isModalOpen, isDropdownOpen, isUserDropdown, isTeamDropdown, isDragging,
  } = useSelector((state) => state);

  const [currentUserKey, setCurrentUserKey] = useState(null);
 
  const [filteredSubUser, setFilteredSubUser] = useState(null);
  const [currentUserName, setCurrentUserName] = useState(null);
  const [selectedName, setSelectedName] = useState('User');
  const [assignedTo, setAssignedTo] = useState('');
  const [leads, setLeads] = useState([]);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formType, setFormType] = useState(''); 
  
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
                dispatch(setSubUsers(usersData.filter(user => user.userType === 'SubUser')));
                dispatch(setExecutives(usersData.filter(user => user.userType === 'Executive')));
                  

                  const currentUser = usersData.find(user => user._id === userId);
                  const currentUserKey = currentUser?.key1;
                  setCurrentUserKey(currentUserKey);

                  const currentUserName = usersData.find(user => user.key === currentUserKey)?.fname;
                  setCurrentUserName(currentUserName);

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

    const togglePopadd = () => dispatch(setIsPopupVisible(!isPopupVisible));
  
    const toggleAssign2 = (leadId, assignedTo) => {
      dispatch(setSelectedLeadId(leadId));
      setAssignedTo(assignedTo);
      const selectedDeal = deals.find(deal => deal.id === leadId);
      if (selectedDeal) {
        const subUser = users.find(user => user.userType === 'Executive' && user.key === selectedDeal.assignedto);
        setFilteredSubUser(subUser);
      }
    
      dispatch(setIsAssignLead(true));
    };
      
      const toggleModal = () => {
        dispatch(setIsModalOpen(!isModalOpen));
        dispatch( setIsDropdownOpen(false));
       };

       const toggleAssignLeads=() => {
        dispatch(setIsAddLeads(!isAddLeads));
        dispatch(setIsDropdownOpen(false));
      }

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

    const handleDeleteDeal = async (dealId) => {
      try {
        await axios.delete(`${process.env.REACT_APP_PORT}/leads/delete/${dealId}`);
        
        const updatedDeals = deals.filter((deal) => deal.id !== dealId);
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
    
    const handleStatusUpdate = (newStatus, leadId) => {
      
      const updatedDeals = deals.map((deal) => 
        deal.id === leadId ? { ...deal, status:newStatus } : deal
      );
      dispatch(setDeals(updatedDeals));
    };

    const handleWonDrop = async (item) => {
      try {
       
        const response = await axios.put(`${process.env.REACT_APP_PORT}/leads/update/${item.id}`, { status: 'won' });
        if (response.status === 200) {
          const updatedDeals = deals.map(deal =>
            deal.id === item.id ? { ...deal, status: 'won' } : deal
          );
          dispatch(setDeals(updatedDeals)); 
        }
      } catch (error) {
        console.error('Failed to update lead status:', error);
      }
    };
 
    const handleUpdateDeal = (updatedDeal) => {
      const updatedDeals = deals.map(deal =>
        deal.id === updatedDeal._id ? { ...deal, status: updatedDeal.status } : deal
      );
      dispatch(setDeals(updatedDeals));
    };
    return (
      <div className="main-content">
      <DndProvider backend={HTML5Backend}>
        <div className='mt-4 ps-3'> 
        
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
                users={users}  
                handleDeleteDeal={handleDeleteDeal}
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
          
          {isAssignLead && (
            <div className='modal'>
              <div className='modal_content'>
                <div className='d-flex align-items-center justify-content-between importdeal_div'>
                  <h2 className='import_deal'>Assign Leads</h2>
                  <FontAwesomeIcon className='close_img' icon={faX} onClick={() => dispatch(setIsAssignLead(false))} />
                </div>
                <AssignPopup3
                  leadId={selectedLeadId} 
                  setIsAssignLead={setIsAssignLead} 
                  deals={deals} 
                  setDeals={setDeals} 
                  assignedTo={assignedTo}
                  currentUserKey={currentUserKey}
                />
              </div>
            </div>
          )}

          {isDragging && (
            <div className='buttons_div p-2'>
                <DeleteButton onDrop={handleDrop} />
                <LostButton onDrop={handleDrop} />
                <WonButton onDrop={handleWonDrop} />
              <MoveToButton onDrop={handleDrop} />
            </div>
          )}

        {isFormVisible && selectedDeal && formType === 'Delete' && (
         <TeamDltForm
         setIsFormVisible={setIsFormVisible}
         leadId={selectedLeadId} 
         deal={selectedDeal}
         handleDeleteDeal={handleDeleteDeal}
         />
        )}

        {isFormVisible && selectedDeal && formType === 'lost' && (
        <TeamLostForm
         deal={selectedDeal}
         onUpdateDeal={handleUpdateDeal}
         setIsFormVisible={setIsFormVisible}
         />
        )}

        {isFormVisible && selectedDeal && formType === 'moveTo' && (
          <TeamMovetoForm
          deal={selectedDeal}
          leadId={selectedLeadId}
          setIsFormVisible={setIsFormVisible}
          onStatusUpdate={handleStatusUpdate}/>
         )}
        </div>
      </DndProvider>
      </div>
  )
}

export default Teamlead1
