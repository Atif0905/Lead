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
import {
  setUsers,  setDeals, setIsLoading, setStages, setNewStage,  setIsAddingStage,  setSelectedLeadId,
} from '../../redux/actions';
import MovetoForm from './MovetoForm';
import LostForm from './LostForm';
import PopupNotification from './PopupNotification';
import AddDeals from '../Leads/AddDeals';
import ViewFollowups from '../Leads/ViewFollowups';
import PopupForm from '../Leads/PopupForm';

const ItemTypes = {
    CARD: 'card',
  };
  
  const DealCard = ({ id, text,  setDragging, status, assignedto, togglePopadd }) => {
    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.CARD,
      item: { id, text, status, assignedto  }, 
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

   // Update the dragging state whenever the card's dragging state changes
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
          <p className='deal_head1'>{status}</p>
          <p className='deal_head2'>{assignedto}</p>
          <div className='d-flex justify-content-between'>
            <p className='deal_head3'>{text}</p> 
          </div>
          <div className='dealcard_icon'>
            <FaUserAlt className='deals_usericon'
             onClick={(e) => e.stopPropagation()} />
            <GoAlertFill className='deals_alerticon' 
             onClick={(e) => e.stopPropagation()}/>
          </div>
        </div>
      </div>
    );
  };
// Represents a drop zone for marking a deal as lost
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
// Represents a drop zone for moving a deal
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
// Represents a drop zone for marking a deal as won
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
  // Represents a container for deals within a specific stage
  const DealBox = ({ stage, deals, moveCard, setDragging, togglePopadd,  onDelete,  deleteDeal, onDragStart }) => {
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
              togglePopadd={togglePopadd}
            />
          ))}
        <div className='adddeal_button'>
          <FaPlus />
        </div>
      </div>
    );
  };

const ExecutiveLead1 = () => {
  const { userId } = useParams();  // Extract userId from the route
  const dispatch = useDispatch();

  const {
 deals,  stages, newStage,  isAddingStage,  selectedLeadId,    
  } = useSelector((state) => state);

  const [isDragging, setIsDragging] = useState(false);
  const [leads, setLeads] = useState([]);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formType, setFormType] = useState(''); 
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [activeComponent, setActiveComponent] = useState(null);
  const [selectedLeadData, setSelectedLeadData] = useState(null); 
  const [addDealShow, setAddDealShow] = useState('')
    const [isPopupFormVisible, setIsPopupFormVisible] = useState(false);
    const [currentDeal, setCurrentDeal] = useState(null); 
// Load stages from localStorage on component mount
  useEffect(() => {
    const savedStages = JSON.parse(localStorage.getItem('dealStages')) || stages;
    dispatch(setStages(savedStages));
  }, []);
  // Save stages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('dealStages', JSON.stringify(stages));
  }, [stages]);
 // Fetch leads and users and filter them based on the current user's assignments
  useEffect(() => {
      const fetchLeadsAndUsers = async () => {
        dispatch(setIsLoading(true));
        try {
            const usersResponse = await axios.get(`${process.env.REACT_APP_PORT}/getAllUser`);
            if (usersResponse.data.status === 'ok') {
              const usersData = usersResponse.data.data;
              dispatch(setUsers(usersData));
         // Find the current user based on the userId from route parameters
              const currentUser = usersData.find(user => user._id === userId);
              const currentUserKey = currentUser?.id;  // Extract the user's key for filtering leads
             // Fetch all leads from the database
              const leadsResponse = await axios.get(`${process.env.REACT_APP_PORT}/leads`);
              const allLeads = leadsResponse.data;
               // Filter leads to include only those assigned to the current user
              const filteredLeads = allLeads.filter(lead => lead.assignedto === currentUserKey);
              setLeads(filteredLeads);
              console.log(filteredLeads)

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
    fetchLeadsAndUsers();   // Invoke the function to fetch data
  }, [userId]); // Re-run the effect when userId changes

   const togglePopadd = (leadId) => {
        const leadData = deals.find((deal) => deal.id === leadId);
        if (leadData) setSelectedLeadData(leadData);
        dispatch(setSelectedLeadId(leadId));  
        dispatch(setAddDealShow(true)); 
      };

  // Function to handle status of the lead and a form is popup to update status of the lead.
  const moveCard = async (draggedId, droppedStage) => {
    // Find the dragged deal
    const draggedDeal = deals.find(deal => deal.id === draggedId);
    if (!draggedDeal) return;
  
    // Set the current deal and dropped stage for the popup form
    setCurrentDeal({ ...draggedDeal, newStatus: droppedStage, newReason: '' });
    setIsPopupFormVisible(true); // Show the popup form
  };
// Function to handle popup form show when we drag lead card from one stage to another stage.
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

  const handleAddStage = (e) => {
    e.preventDefault();// Prevent the default form submission behavior
    if (newStage) {
      const updatedStages = [...stages, newStage]; // Create a new array with the existing stages and add the new stage
      dispatch(setStages(updatedStages)); // Update the stages in the Redux store
      dispatch(setNewStage('')); // Reset the `newStage` input field to an empty string
      dispatch(setIsAddingStage(false)); // Close the "Add Stage" input form
    }
  };

  const handleDeleteStage = (stageToDelete) => {
     // Confirm with the user before deleting the stage
    if (window.confirm(`Are you sure you want to delete the stage "${stageToDelete}"?`)) {
       // Filter out the stage to be deleted from the stages array
      const updatedStages = stages.filter(stage => stage !== stageToDelete);
      dispatch(setStages(updatedStages)); // Update the stages in the Redux store
      const updatedDeals = deals.filter(deal => deal.status !== stageToDelete);
      dispatch(setDeals(updatedDeals)); // Update the deals in the Redux store
    }
  };

  const deleteDeal = async (dealId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_PORT}/deleteleads/${dealId}`);
       // Filter out the deleted deal from the current list of deals
      const updatedDeals = deals.filter(deal => deal.id !== dealId);
       // Update the Redux store with the updated list of deals
      dispatch(setDeals(updatedDeals));
    } catch (error) {
      console.error('Error deleting deal:', error);
    }
  };

  const handleDrop = (deal, dropType, leadId) => {
    // Set the selected deal in the state when a deal is dropped
    setSelectedDeal(deal); 
    setFormType(dropType); 
     // Make the form visible by updating the state
    setIsFormVisible(true); 
    // Dispatch an action to update the Redux store with the selected lead's ID
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

return(
  <DndProvider backend={HTML5Backend}>
<PopupNotification leadId={selectedLeadId}
leads={leads} />
        <div className=' ps-3 '>
          <div className='dealscontainer '>
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
            {isDragging && (
            <div className='buttons_div'>
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
         onUpdateDeal={handleUpdateDeal}
         />
        )}
      
    
    
    
      </DndProvider>
)
}
export default ExecutiveLead1