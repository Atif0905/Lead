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
import {setDeals,setUsers,setSubUsers,setIsPopupVisible,setIsLoading,setStages,setNewStage,setIsAddingStage,setSelectedLeadId,setIsAssignLead,} from '../../redux/actions';
import AddDeals from './AddDeals';
import AdminLostForm from './AdminLostForm';
import AdminMovetoForm from './AdminMovetoForm';
import AdminDeleteForm from './AdminDeleteForm';

const ItemTypes = {
  CARD: 'card',
};

const DealCard = ({ id, text, setDragging, toggleAssign, status, assignedto, togglePopadd }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: { id, text, status, assignedto },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

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
      className="dealcard"
      style={{
        opacity: isDragging ? 0.5 : 1,
        boxShadow: getBoxShadowColor(status),
      }}
      onClick={() => togglePopadd(id)}
    >
      <div className="dealcard_content">
        <p className="deal_head2">Assigned to {assignedto}</p>
        <div className="d-flex justify-content-between">
          <p className="deal_head3">{text}</p>
        </div>
        <div className="dealcard_icon">
          <FaUserAlt
            className="deals_usericon"
            onClick={(e) => {
              e.stopPropagation();
              toggleAssign(id);
            }}
          />
          <div>
            <GoAlertFill className="deals_alerticon" />
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

const DealBox = ({ stage, deals,  moveCard, setDragging, toggleAssign, onDelete, handleDeleteDeal, togglePopadd  }) => {
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
            toggleAssign={toggleAssign} 
            togglePopadd={togglePopadd}
            onDelete={onDelete}
            handleDeleteDeal={handleDeleteDeal}  
          />
        ))}

      <div className='adddeal_button'>
        <FaPlus />
      </div>
    </div>
  );
};

const Leads = () => {
 
  const dispatch = useDispatch();
  const { userId } = useParams();
  const {
    deals,
    isPopupVisible,
    stages,
    adminstages,
    newStage,
    isAddingStage,
    selectedLeadId,
    isAssignLead,
  } = useSelector((state) => state);

  const [isDragging, setIsDragging] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formType, setFormType] = useState(''); 


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
          title: lead.title,
          email: lead.email,
          status: lead.status,
          stage: 'Lead In',
          assignedto: lead.assignedto || [],
        }));
        dispatch(setDeals(formattedDeals));
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

  const toggleAssign = (leadId) => {
  dispatch(setSelectedLeadId(leadId));
   dispatch(setIsAssignLead(true));
  };

  const togglePopadd = (leadId) => {
    dispatch(setSelectedLeadId(leadId));  
    dispatch(setIsPopupVisible(true));  
  };

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
      const updatedStages = [...adminstages, newStage];
     dispatch(setStages(updatedStages));
      dispatch(setNewStage(''));
    dispatch(setIsAddingStage(false));
    }
  };

  const handleDeleteStage = (stageToDelete) => {
    if (window.confirm(`Are you sure you want to delete the stage "${stageToDelete}"?`)) {
      const updatedStages = adminstages.filter(stage => stage !== stageToDelete);
      dispatch(setStages(updatedStages));
      const updatedDeals = deals.filter(deal => deal.status !== stageToDelete);
      dispatch(setDeals(updatedDeals));
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

  const handleStatusUpdate = (leadId, newStatus) => {
    const updatedDeals = deals.map(deal =>
      deal.id === leadId ? { ...deal, status: newStatus } : deal
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
      <div className='mt-4 ps-3'>
        <div className='dealscontainer mt-2'>
          {adminstages.map((stage, index) => (
            <DealBox
              key={index}
              stage={stage}
              deals={deals}
              moveCard={moveCard}
              setDragging={setIsDragging}
              toggleAssign={toggleAssign}
              togglePopadd={togglePopadd}
              onDelete={handleDeleteStage}
              handleDeleteDeal={handleDeleteDeal}
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
            <div className='formback'>
              <h2 className='formhead'>Add Deals</h2>
              <FontAwesomeIcon className='close_img' icon={faX} onClick={() => dispatch(setIsPopupVisible(false))}  />
            </div>
            <AddDeals
             leadId={selectedLeadId}
             setIsPopupVisible={setIsPopupVisible} />
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
         
        {isDragging && (
          <div className='buttons_div p-2'>
            <DeleteButton onDrop={handleDrop} />
            <LostButton onDrop={handleDrop} />
              <WonButton onDrop={handleWonDrop} />
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
