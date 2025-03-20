import { useState, useEffect } from 'react';
import { RxCross2 } from "react-icons/rx";
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';

const PopupNotification = ({ leads,  leadId  }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupLead, setPopupLead] = useState(null);
  const [shownLeads, setShownLeads] = useState(new Set());
   const [updates, setUpdates] = useState([]);

   useEffect(() => {   
    const fetchLeadData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_PORT}/leads/${leadId}`);
        setUpdates(response.data.updates); 
        console.log(updates)
      } catch (error) {
        console.error('Error fetching lead data:', error);
      }
    };
    fetchLeadData();
  }, [leadId]);

  useEffect(() => {
    AOS.init();
  }, [])

  useEffect(() => {
    const checkCallbackTime = () => {
       //Function to format date into "YYYY-MM-DD" format
      const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
      };
    
      if (!leads || !Array.isArray(leads)) return;
      const currentTime = new Date();
      const currentDate = formatDate(currentTime);

        // Get current time in 24-hour "HH:mm" format
      const currentTimeStr = currentTime.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      }); 

      // Find a lead that matches the current date and time for callback
      const leadWithMatchingDateTime = updates.find((lead) => {
        const leadTime = new Date(`${lead.callbackDate}T${lead.callbackTime}`);
        return (
          lead.callbackDate === currentDate &&  // Match the callback date
          lead.status === 'Call Back' && // Ensure the status is 'Call Back'
          !shownLeads.has(lead.id) &&  // Ensure the lead hasn't already triggered a popup
          leadTime <= currentTime // Ensure the callback time has passed
        );
      });
     
      // If a matching lead is found, set it in the popup state
      if (leadWithMatchingDateTime) {
        setPopupLead(leadWithMatchingDateTime);
        setShowPopup(true);
        setShownLeads((prev) => new Set(prev).add(leadWithMatchingDateTime.id)); // Add lead ID to the shown list
      }
  
      // Check if the popupLead's status has changed
      if (popupLead && popupLead.status !== 'Call Back') {
        setShowPopup(false);
        setPopupLead(null);
      }
    };
   // Set an interval to check for matching leads every second
  const intervalId = setInterval(checkCallbackTime, 1000);
     // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [leads, popupLead, shownLeads]);

 // Function to close the popup manually
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
