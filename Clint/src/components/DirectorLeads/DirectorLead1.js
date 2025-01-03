import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import '../Leads/Deals.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { FaUserAlt, FaPlus } from 'react-icons/fa';
import { GoAlertFill } from 'react-icons/go';
import AssignPopup2 from './AssignPopup2';
import { useParams } from 'react-router-dom';
import {
  setUsers, setDeals, setLeads, setIsLoading, setStages, setNewStage,  setIsAddingStage,  setSelectedLeadId, setIsAssignLead, setIsPopupVisible,
} from '../../redux/actions';
import DirDeleteForm from './DirDeleteForm';
import DirLostForm from './DirLostForm';
import DirMovetoForm from './DirMovetoForm';
import AddDeals from '../Leads/AddDeals';
import ViewFollowups from '../Leads/ViewFollowups';
import PopupForm from '../Leads/PopupForm';

const ItemTypes = {
    CARD: 'card',
  };
  
  const DealCard = ({ id, text, setDragging, toggleAssign1,  status, updates, assignedto, togglePopadd}) => {
    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.CARD,
      item: { id, text, status, assignedto },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const lastStatus = updates && updates.length > 0 ? updates[updates.length - 1].status : status;
  
    useEffect(() => {
      setDragging(isDragging);
    }, [isDragging, setDragging]);
  
    return (
      <div
        ref={drag}
        className='dealcard'
        style={{ opacity: isDragging ? 0.5 : 1 }}
        onClick={() => togglePopadd(id)}>
        <div className='dealcard_content'>
          <p className='deal_head1'>{lastStatus}</p>
          <p className='deal_head2'>{assignedto}</p>
          <div className='d-flex justify-content-between'>
            <p className='deal_head3'>{text}</p> 
          </div>
          <div className='dealcard_icon'>
            <FaUserAlt className='deals_usericon' onClick={() => toggleAssign1(id, assignedto)} />
             <div>
            <GoAlertFill className='deals_alerticon'/>
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
        <button className='dlt_btn'>DELETE</button>
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
  
  const DealBox = ({ stage, deals, moveCard, setDeals, setDragging, togglePopadd, toggleAssign1, onDelete, deleteDeal, handleDeleteDeal }) => {
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
        .map((deal) => {
          // Determine lastStatus and update deal.status
          const lastStatus =
            deal.updates && deal.updates.length > 0
              ? deal.updates[deal.updates.length - 1].status
              : deal.status;

          deal.status = lastStatus; // Update deal.status with lastStatus

          // Filter deals for the current stage
          if (lastStatus === stage) {
            return (
            <DealCard
              key={deal.id}
              id={deal.id}
              name={deal.name}
              assignedto={deal.assignedto}
              status={deal.status}
              text={deal.text}
              deal={deal}
              email={deal.email}
              title={deal.title}
              moveCard={moveCard}
              setDeals={setDeals}
              setDragging={setDragging}
              toggleAssign1={toggleAssign1}
              onDealDelete={deleteDeal} 
              handleDeleteDeal={handleDeleteDeal}
              togglePopadd={togglePopadd}
            />
          );
        }
        return null; // Skip deals that don't match the current stage
      })}
        <div className='adddeal_button'>
          <FaPlus />
        </div>
      </div>
    );
  };

const DirectorLead1 = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const {
    users,  deals,  stages, newStage, isAddingStage,  selectedLeadId,  isAssignLead,   
  } = useSelector((state) => state);
    const [currentUserKey, setCurrentUserKey] = useState(null);
    const [filteredSubUser, setFilteredSubUser] = useState(null);
    const [assignedTo, setAssignedTo] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [formType, setFormType] = useState(''); 
     const [activeComponent, setActiveComponent] = useState(null);
      const [selectedLeadData, setSelectedLeadData] = useState(null); 
      const [addDealShow, setAddDealShow] = useState('')
        const [isPopupFormVisible, setIsPopupFormVisible] = useState(false);
        const [currentDeal, setCurrentDeal] = useState(null);
   
    useEffect(() => {
      const savedStages = JSON.parse(localStorage.getItem('dealStages')) || stages;
      dispatch(setStages(savedStages));
    }, []);
  
    useEffect(() => {
      localStorage.setItem('dealStages', JSON.stringify(stages));
    }, [stages]);
  
    useEffect(() => {
      const fetchUserAndLeads = async () => {
        dispatch(setIsLoading(true));
        try {
          const usersResponse = await axios.get(`${process.env.REACT_APP_PORT}/getAllUser`);
          if (usersResponse.data.status === 'ok') {
            const usersData = usersResponse.data.data;
            dispatch(setUsers(usersData));
  
            const currentUser = usersData.find(user => user._id === userId);
            const currentUserKey = currentUser?.key;
  
            const leadsResponse = await axios.get(`${process.env.REACT_APP_PORT}/leads`);
            const allLeads = leadsResponse.data;
            const filteredLeads = allLeads.filter(lead => lead.assignedto === currentUserKey);
            dispatch(setLeads(filteredLeads));
            const formattedDeals = filteredLeads.map(lead => ({
              id: lead._id,
              name: lead.name,
              text: lead.number,
              title: lead.title,
              email: lead.email,
              status: lead.status,
              stage: 'Lead In',
              assignedto: lead.assignedto || [],
              updates: lead.updates.map(update => ({
                status: update.status,
                reason: update.reason,
              })),
            }));
            dispatch(setDeals(formattedDeals));
            console.log(formattedDeals)
          } else {
            console.error('Failed to fetch users:', usersResponse.data.message);
          }
        } catch (error) {
          console.error('Error fetching users or leads:', error);
        } finally {
          dispatch(setIsLoading(false));
        }
      };
  
      fetchUserAndLeads();
    }, [userId]);
  
      const togglePopadd = (leadId) => {
        const leadData = deals.find((deal) => deal.id === leadId);
        if (leadData) setSelectedLeadData(leadData);
        dispatch(setSelectedLeadId(leadId));  
        dispatch(setAddDealShow(true)); 
      };
  
    const toggleAssign1 = (leadId, assignedto) => {
      dispatch(setSelectedLeadId(leadId));
      setAssignedTo(assignedto);
      const selectedDeal = deals.find(deal => deal.id === leadId);
      if (selectedDeal) {
        const subUser = users.find(user => user.userType === 'SubUser' && user.key === selectedDeal.assignedto);
        setFilteredSubUser(subUser);
      }
     dispatch(setIsAssignLead(true));
    }; 

    const handlePopupFormSubmit = async (formData) => {
      try {
        // Update the lead on the server
        const response = await axios.post(
          `${process.env.REACT_APP_PORT}/leads/${currentDeal.id}`,
          { ...formData, status: currentDeal.newStatus}
        );
    // console.log(response)
        if (response.status === 200) {
          // Update the local deals state
          const updatedDeals = deals.map(deal =>
            deal.id === currentDeal.id
              ? { ...deal, ...formData, status: currentDeal.newStatus }
              : deal
          );
          dispatch(setDeals(updatedDeals));
          setIsPopupFormVisible(false); // Close the popup form
        }
      } catch (error) {
        console.error('Error updating deal:', error);
      }
    };
  
    const moveCard = async (draggedId, droppedStage) => {
      // Find the dragged deal
      const draggedDeal = deals.find(deal => deal.id === draggedId);
      if (!draggedDeal) return;
    
      // Set the current deal and dropped stage for the popup form
      setCurrentDeal({ ...draggedDeal, newStatus: droppedStage, newReason: '' });
      setIsPopupFormVisible(true); // Show the popup form
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

    const handleStatusUpdate = ( newStatus, leadId) => {
      const updatedDeals = deals.map((deal) => 
        deal.id === leadId ? { ...deal, status: newStatus  } : deal
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
      <DndProvider backend={HTML5Backend}>
        <div className='ps-3'>
          <div className='dealscontainer'>
            {stages.map((stage, index) => (
              <DealBox
                key={index}
                stage={stage}
                deals={deals}
                moveCard={moveCard}
                setDragging={setIsDragging}
                togglePopadd={togglePopadd}
                toggleAssign1={toggleAssign1}
                onDelete={handleDeleteStage}
                onDealDelete={deleteDeal} 
                users={users}  
                setDeals={setDeals}
                handleDeleteDeal={handleDeleteDeal}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}

{isPopupFormVisible && (
  <PopupForm
    deal={currentDeal}
    onSubmit={handlePopupFormSubmit}
    onClose={() => setIsPopupFormVisible(false)}
  />
)}

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
          {addDealShow && (
        <div className='popup'>
          <div className='popup_content'>
            <div className='d-flex align-items-center justify-content-between adddeal_div'>
              <h2 className='add_deal'>Add Deals</h2>
              <FontAwesomeIcon className='close_img' icon={faX} onClick={() => dispatch(setAddDealShow(false))}  />
            </div>
            <div className=' followupbtn_div'>
            <button className='follow_ups_btn'  
           onClick={() => setActiveComponent('ViewFollowups')}>
           View Followups
            </button>
            <button className='follow_ups_btn' 
             onClick={() => setActiveComponent('AddDeals')}>
            Add Followups
            </button>
            </div>
            {activeComponent === 'AddDeals' && (
          <AddDeals
            leadId={selectedLeadId}
            setAddDealShow={setAddDealShow}
          />
        )}
           {activeComponent === 'ViewFollowups' && (
          <ViewFollowups
            leadId={selectedLeadId}
            setAddDealShow={setAddDealShow}
            leadData={selectedLeadData}
          />
        )}
          </div>
        </div>
      )}
         </div>
  
          {isAssignLead && (
            <div className='modal'>
              <div className='modal_content'>
                <div className='d-flex align-items-center justify-content-between importdeal_div'>
                  <h2 className='import_deal'>Assign Leads</h2>
                  <FontAwesomeIcon className='close_img' icon={faX} onClick={() => dispatch(setIsAssignLead(false))} />
                </div>
                  <AssignPopup2 
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
            <div className='buttons_div'>
               <DeleteButton onDrop={handleDrop} />
               <LostButton onDrop={handleDrop} />
               <WonButton onDrop={handleWonDrop} />
               <MoveToButton onDrop={handleDrop} />
            </div>
          )}

{isFormVisible && selectedDeal && formType === 'Delete' && (
         <DirDeleteForm
         setIsFormVisible={setIsFormVisible}
         leadId={selectedLeadId} 
         deal={selectedDeal}
         handleDeleteDeal={handleDeleteDeal}
         />
        )}

{isFormVisible && selectedDeal && formType === 'lost' && (
        <DirLostForm
         deal={selectedDeal}
         onUpdateDeal={handleUpdateDeal}
         setIsFormVisible={setIsFormVisible}
         />
        )}

{isFormVisible && selectedDeal && formType === 'moveTo' && (
          <DirMovetoForm 
          deal={selectedDeal}
          leadId={selectedLeadId}
          setIsFormVisible={setIsFormVisible}
          onStatusUpdate={handleStatusUpdate}/>
         )}
     
      </DndProvider>
     
  )
}

export default DirectorLead1
