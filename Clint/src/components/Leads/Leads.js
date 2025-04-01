import React, {useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import './Deals.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { FaUserAlt, FaPlus } from 'react-icons/fa';
import AssignPopup from './AssignPopup';
import { GoAlertFill } from 'react-icons/go';
import { useParams} from 'react-router-dom';
import {setDeals,setUsers,setSubUsers,setIsLoading,setStages,setNewStage,setIsAddingStage,setSelectedLeadId,setIsAssignLead} from '../../redux/actions';
import AddDeals from './AddDeals';
import AdminLostForm from './AdminLostForm';
import AdminMovetoForm from './AdminMovetoForm';
import AdminDeleteForm from './AdminDeleteForm';
import ViewFollowups from './ViewFollowups';
import PopupForm from './PopupForm';

const ItemTypes = {
  CARD: 'card',
};

const DealCard = ({ id, text,  setDragging, toggleAssign,  status, updates,assignedto, togglePopadd}) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: { id, text, status, assignedto },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const lastStatus = updates && updates.length > 0 ? updates[updates.length - 1].status : status;
  // console.log(lastStatus)

  useEffect(() => {
    setDragging(isDragging);
  }, [isDragging, setDragging]);

  // Function to determine box-shadow color based on status
  const getBoxShadowColor = (status) => {
    switch (status) {
      case "Lead In":
        return "0px 4px 5px rgba(0, 0, 255, 0.5)";
      case "Contact Made":
      case "won":
        return "0px 4px 5px rgba(0, 128, 0, 0.5)"; 
      case "Lost":
      case "Not Interested":
        return "0px 4px 5px rgba(255, 0, 0, 0.5)";
      case "Switch Off":
      case "Interested":
      case "Call Back":
        return "0px 4px 5px rgba(255, 255, 0, 0.5)";
      default:
        return "0px 4px 5px rgba(0, 0, 0, 0.1)"; 
    }
  };

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
          <FaUserAlt className='deals_usericon' onClick={(e) => {
            e.stopPropagation();
            toggleAssign(id);
          }}/>
              <div>
            <GoAlertFill className='deals_alerticon'
            onClick={(e) => {
              e.stopPropagation(); 
            }} />
            </div>
        </div>
      </div>
    </div>
  );
};
  // Function to handle Delete button
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
  // Function to handle Lost button
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
  // Function to handle move to button
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
  // Function to handle won button
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

const DealBox = ({ stage, deals,  moveCard, setDragging, toggleAssign, onDelete, handleDeleteDeal, togglePopadd}) => {
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
            email={deal.email}
            updates={deal.updates}
            moveCard={moveCard}
            setDragging={setDragging}
            toggleAssign={toggleAssign} 
            togglePopadd={togglePopadd}
            onDelete={onDelete}
            handleDeleteDeal={handleDeleteDeal}  
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

const Leads = () => {
  const dispatch = useDispatch();
  const { userId} = useParams();
  const {deals,stages, adminstages,newStage,isAddingStage,selectedLeadId,isAssignLead,
  } = useSelector((state) => state);
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
    localStorage.setItem('dealStages', JSON.stringify(adminstages));
  }, [adminstages]);

  useEffect(() => {
    const fetchLeads = async () => {
      dispatch(setIsLoading(true));
      try {
        const response = await axios.get(`${process.env.REACT_APP_PORT}/leads`);
        const formattedDeals = response.data.map(lead => ({
          id: lead._id,
          name: lead.name,
          text: lead.number,
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
        console.log(deals)
      } catch (error) {
        console.error('Error fetching leads:', error);
      } finally {
        dispatch(setIsLoading(false));
      }
    };
    
    const fetchUsers = async () => {
      dispatch(setIsLoading(true));
      try {
        const usersResponse = await axios.get(`${process.env.REACT_APP_PORT}/getAllUser`);
        if (usersResponse.data.status === 'ok') {
          const allUsers = usersResponse.data.data;
          dispatch(setUsers(allUsers.filter(user => user.userType === 'User')));
          dispatch(setSubUsers(allUsers.filter(user => user.userType === 'SubUser')));
        } else {
          console.error('Failed to fetch users:', usersResponse.data.message);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        dispatch(setIsLoading(false));
      }
    }; 
    fetchLeads();
    fetchUsers();
  }, [userId]);

  // useEffect(() => {   
//   const fetchLeadData = async () => {
//      try {
//      const response = await axios.get(`${process.env.REACT_APP_PORT}/leads`);
//      setUpdates(response.data); 
//      console.log('updated lead', response)
//    } catch (error) {
//        console.error('Error fetching lead data:', error);
//      }
//    };
//    fetchLeadData();
//  }, [leadId]);

  
   // Handles the visibility of the assign popup
  const toggleAssign = (leadId) => {
  dispatch(setSelectedLeadId(leadId));
   dispatch(setIsAssignLead(true));
  };

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
  // Function to handle addition of a stage
  const handleAddStage = (e) => {
    e.preventDefault();
    if (newStage) {
      const updatedStages = [...adminstages, newStage];
     dispatch(setStages(updatedStages));
      dispatch(setNewStage(''));
    dispatch(setIsAddingStage(false));
    }
  };
 // Function to handle deletion of a stage
  const handleDeleteStage = (stageToDelete) => {
    if (window.confirm(`Are you sure you want to delete the stage "${stageToDelete}"?`)) {
      const updatedStages = adminstages.filter(stage => stage !== stageToDelete);
      dispatch(setStages(updatedStages));
      const updatedDeals = deals.filter(deal => deal.status !== stageToDelete);
      dispatch(setDeals(updatedDeals));
    }
  };
 // Function to handle deletion of a leads
  const handleDeleteDeal = async (dealId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_PORT}/leads/delete/${dealId}`);
      
      const updatedDeals = deals.filter((deal) => deal.id !== dealId);
    dispatch(setDeals(updatedDeals));
    } catch (error) {
      console.error('Error deleting deal:', error);
    }
  };
// Handles dropping a lead into a specific action button (e.g., Delete, Lost, etc.)
  const handleDrop = (deal, dropType, leadId) => {
    setSelectedDeal(deal); 
    setFormType(dropType); 
    setIsFormVisible(true); 
    dispatch(setSelectedLeadId(leadId));
  };
 // Function to handle won form of a leads
  const handleStatusUpdate = (leadId, newStatus) => {
    const updatedDeals = deals.map(deal =>
      deal.id === leadId ? { ...deal, status: newStatus } : deal
    );
    dispatch(setDeals(updatedDeals)); 
  };
 // Function to handle won form of a leads
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
 // Function to handle Lost form show when lead card drag to the lost button
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
          {adminstages.map((stage, index) => (
            <DealBox
              key={index}
              stage={stage}
              deals={deals.filter((deal) => deal.status === stage)}
              onCardDrop={(draggedId) => moveCard(draggedId, stage)}
              moveCard={moveCard}
              setDragging={setIsDragging}
              toggleAssign={toggleAssign}
              togglePopadd={togglePopadd}
              onDelete={handleDeleteStage}
              handleDeleteDeal={handleDeleteDeal}
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
        {isAssignLead && (
          <div className='modal'>
            <div className='modal_content'>
              <div className='d-flex align-items-center justify-content-between importdeal_div'>
                <h2 className='import_deal'>Assign Leads</h2>
                <FontAwesomeIcon className='close_img' icon={faX} onClick={() => dispatch(setIsAssignLead(false))} />
              </div>
              <AssignPopup 
                leadId={selectedLeadId} 
                setIsAssignLead={setIsAssignLead} 
                deals={deals} 
                setDeals={setDeals} 
              /> 
            </div>
          </div>
        )}
         </div>

     {/* Render the button options only when an item is being dragged */}
        {isDragging && (
          <div className='buttons_div'>
             {/* Button to delete the dragged item; triggers handleDrop on drop */}
            <DeleteButton onDrop={handleDrop} />
              {/* Button to mark the dragged item as lost; triggers handleDrop on drop */}
            <LostButton onDrop={handleDrop} />
            {/* Button to mark the dragged item as won; triggers a separate handler on drop */}
              <WonButton onDrop={handleWonDrop} />
          {/* Button to move the dragged item to a different location; triggers handleDrop on drop */}
              <MoveToButton onDrop={handleDrop} />
          </div>
        )}

        {isFormVisible && selectedDeal && formType === 'Delete' && (
         <AdminDeleteForm
         setIsFormVisible={setIsFormVisible}
         leadId={selectedLeadId} 
         deal={selectedDeal}
         handleDeleteDeal={handleDeleteDeal}
         />
        )}

        {isFormVisible && selectedDeal && formType === 'moveTo' && (
          <AdminMovetoForm 
          deal={selectedDeal}
          leadId={selectedLeadId}
          setIsFormVisible={setIsFormVisible}
          onStatusUpdate={handleStatusUpdate}/>
         )}

        {isFormVisible && selectedDeal && formType === 'lost' && (
         <AdminLostForm
         deal={selectedDeal}
         onUpdateDeal={handleUpdateDeal}
         setIsFormVisible={setIsFormVisible}
         />
        )}
     
    </DndProvider>
  );
};

export default Leads;
