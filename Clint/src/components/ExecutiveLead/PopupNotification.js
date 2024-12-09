import { useState, useEffect } from 'react';
import { RxCross2 } from "react-icons/rx";
import AOS from 'aos';
import 'aos/dist/aos.css';

const PopupNotification = ({ leads }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupLead, setPopupLead] = useState(null);
  const [shownLeads, setShownLeads] = useState(new Set());

  useEffect(() => {
    AOS.init();
  }, [])

  useEffect(() => {
    const checkCallbackTime = () => {
      const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
      };
  
      if (!leads || !Array.isArray(leads)) return;
  
      const currentTime = new Date();
      const currentDate = formatDate(currentTime);
      const currentTimeStr = currentTime.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      });
  
      const leadWithMatchingDateTime = leads.find((lead) => {
        const leadTime = new Date(`${lead.callbackDate}T${lead.callbackTime}`);
        return (
          lead.callbackDate === currentDate &&
          lead.status === 'Call Back' &&
          !shownLeads.has(lead.id) &&
          leadTime <= currentTime // Check if the callback time is now or has passed
        );
      });
  
      if (leadWithMatchingDateTime) {
        setPopupLead(leadWithMatchingDateTime);
        setShowPopup(true);
        setShownLeads((prev) => new Set(prev).add(leadWithMatchingDateTime.id));
      }
  
      // Check if the popupLead's status has changed
      if (popupLead && popupLead.status !== 'Call Back') {
        setShowPopup(false);
        setPopupLead(null);
      }
    };
  
  const intervalId = setInterval(checkCallbackTime, 1000);
  
    return () => clearInterval(intervalId);
  }, [leads, popupLead, shownLeads]);

  const closePopup = () => {
    setShowPopup(false);
  };


  return (
    <>
      {showPopup && popupLead && (
        <div data-aos="fade-left"  data-aos-delay="5000" className={`popup-notification ${showPopup ? 'slide-in' : ''}`}>
          <div className="popup-content">
          <RxCross2 className='cross_notify' onClick={closePopup}/>
          <h6 className='notify_head'>Callback Reminder</h6>
            <p className='notify_txt'>{`Lead: ${popupLead.name}`}</p>
            <p className='notify_txt'>{`Callback Date: ${popupLead.callbackDate}`}</p>
            <p className='notify_txt'>{`Callback Time: ${popupLead.callbackTime}`}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default PopupNotification;
