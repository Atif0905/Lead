import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AddDeals from './AddDeals';
import ImportResult from './ImportResult';
import './Deals.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import AddPerson from './AddPerson';
import AddOrg from './AddOrg';
import ScheduleActivity from './ScheduleActivity';

const ItemTypes = {
  CARD: 'card',
};

const DealCard = ({ id, text, moveCard, setDragging }) => {
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
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className='dealcard-content'>
        {text}
      </div>
    </div>
  );
};

const DealBox = ({ stage, deals, moveCard, setDragging }) => {
  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: (item) => moveCard(item.id, stage),
  });

  return (
    <div ref={drop} className='Dealbox'>
      <h3 className='dealheading ms-2'>{stage}</h3>
      {deals
        .filter((deal) => deal.stage === stage)
        .map((deal) => (
          <DealCard key={deal.id} id={deal.id} text={deal.text} moveCard={moveCard} setDragging={setDragging} />
        ))}
    </div>
  );
};

const Deals = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdown, setIsUserDropdown] = useState(false);
  const [isTeamDropdown, setIsTeamDropdown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [deals, setDeals] = useState([
    { id: 1, text: 'Deal 1', stage: 'Lead In' },
    { id: 2, text: 'Deal 2', stage: 'Contact Made' },
    { id: 3, text: 'Deal 3', stage: 'Lead In' },
    { id: 4, text: 'Deal 4', stage: 'Switch Off' },
  ]);

  useEffect(() => {
    if (isPopupVisible) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isPopupVisible]);

  const togglePopup = () => setIsPopupVisible(!isPopupVisible);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setIsDropdownOpen(false);
  };
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleUserDropdown = () => setIsUserDropdown(!isUserDropdown);
  const toggleTeamDropdown = () => setIsTeamDropdown(!isTeamDropdown);

  const moveCard = (draggedId, droppedStage) => {
    const draggedDeal = deals.find((deal) => deal.id === draggedId);
    if (draggedDeal) {
      const updatedDeals = deals.map((deal) =>
        deal.id === draggedId ? { ...deal, stage: droppedStage } : deal
      );
      setDeals(updatedDeals);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='mt-4 ps-3'>
        <div className='d-flex'>
          <div className='buttdiv1'>
            <div className='cont_butt'>
              <img className='bar_chat' src='./bar_img.webp' alt='dd' />
            </div>
            <div className='bar_butt'>
              <img className='bar_chat' src='./Content.webp' alt='dd' />
            </div>
            <div className='cont_butt'>
              <img className='bar_chat' src='./Rupee.webp' alt='dd' />
            </div>
          </div>
          <div className='buttdiv2'>
            <div className='deal_butt1' onClick={togglePopup}>
              <p className='deal_butt1_txt'>
                + <span>Deal</span>
              </p>
            </div>

            <div className='deal_butt2' onClick={toggleDropdown}>
              <img className='arrow_down' src='./arrowdown.webp' alt='dd' />
            </div>
            {isDropdownOpen && (
              <div className='dropdown-content' onClick={toggleModal}>
                <p className='import_txt'> + Import data</p>
              </div>
            )}
          </div>
        </div>

        <div className='d-flex align-items-center justify-content-between'>
          <div className='d-flex mt-4'>
            <img className='pin_img me-1' src='./Pin.webp' alt='dsd' />
            <p className='pin_text mt-2'>Pin filters</p>
          </div>
          <div>
            <div className='d-flex mt-4'>
              <div className='me-3'>
                <p className='ruptxt mt-1'>₨1,720,000·8 deals</p>
              </div>
              <div className='users_button me-3'>
                <div className='users_butt1' >
                  <img className='adminmaleimg' src='./AdministratorMale.webp' alt='sdd' />
                  <p className='adminname'>Shiv K. Singh</p>
                  <img className='arrowblackimg' src='./arrowblack.webp' alt='ff'  onClick={toggleUserDropdown}/>
                </div>
                {isUserDropdown && (
                  <div className='users_dropdown'>
                    <ul>
                      <li className='list'>name2</li>
                      <li className='list'>admin2</li>
                      <li className='list'>admin3</li>
                    </ul>
                  </div>
                )}
                <div className='users_butt2'>
                  <img className='callibrush' src='./CalliBrush.webp' alt='dd' />
                </div>
              </div>
              <div className='users_button d-flex align-items-center justify-content-around me-3'>
                <img className='teamlogo' src='./Teamlogo.webp' alt='dcd' />
                <p className='teamtext'>Team 1</p>
                <img className='arrowblackimg' src='./arrowblack.webp' alt='fgg' onClick={toggleTeamDropdown}/>
                {isTeamDropdown && (
                  <div className='users_dropdown'>
                    <ul>
                      <li className='list'>team2</li>
                      <li className='list'>team3</li>
                      <li className='list'>team4</li>
                    </ul>
                  </div>
                )}
              </div>
        
            </div>
        
          </div>
        </div>

        <div className='dealscontainer mt-2'>
          {['Lead In', 'Contact Made', 'Switch Off', 'Wrong Number', 'Call Back', 'Interested', 'Not Interested', 'Broker'].map((stage) => (
            <DealBox key={stage} stage={stage} deals={deals} moveCard={moveCard} setDragging={setIsDragging} />
          ))}
        </div>

        {isPopupVisible && (
          <div className='popup'>
            <div className='popup_content'>
              <div className='d-flex align-items-center justify-content-between adddeal_div'>
                <h2 className='add_deal'>Add Deals</h2>
                <FontAwesomeIcon  className='close_img' icon={faX} onClick={togglePopup}  />
              </div>
              <AddDeals />
              {/* <AddPerson/> */}
              {/* <AddOrg /> */}
              {/* <ScheduleActivity /> */}
              <div className='bottomdeal_div'>
                <button className='cancel_btn me-2' onClick={togglePopup}>Cancel</button>
                <button className='save_btn'>Save</button>
              </div>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className='modal'>
            <div className='modal_content'>
              <div className='d-flex align-items-center justify-content-between importdeal_div'>
                <h2 className='import_deal'>Import results</h2>
                <FontAwesomeIcon  className='close_img' icon={faX} onClick={toggleModal} />
              </div>
              <ImportResult />
              {/* <div className='bottomimport_div'>
                <button className='cancel_btn1 me-2' onClick={toggleModal}>Cancel</button>
                <button className='save_btn1'>Import</button>
              </div> */}
            </div>
          </div>
        )}
      </div>
      {isDragging && (
        <div className='buttons_div p-2'>
          <button className='dlt_btn'>DELETE</button>
          <button className='lost_btn'>LOST</button>
          <button className='won_btn'>WON</button>
          <button className='dlt_btn'>MOVE TO</button>
        </div>
       )}
    </DndProvider>
  );
};

export default Deals;
