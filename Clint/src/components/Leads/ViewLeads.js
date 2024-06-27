  import React, { useEffect, useState, useRef } from 'react';
  import axios from 'axios';
  import "../Home.css";
  import './Leads.css'

  const ViewLeads = () => {
    const [leads, setLeads] = useState([]);
    const [selectedLead, setSelectedLead] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef(null);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const leadsResponse = await axios.get('http://localhost:5000/leads');
          setLeads(leadsResponse.data);
          console.log(leadsResponse);
          const usersResponse = await axios.get(`http://localhost:5000/getAllUser?search=${searchQuery}`);
          if (usersResponse.data.status === "ok") {
            setUsers(usersResponse.data.data);
            console.log(usersResponse);
          } else {
            console.error("Failed to fetch users:", usersResponse.data.message);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }, [searchQuery]);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsDropdownOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    const updateLeadStatus = async (_id, status) => {
      try {
        await axios.put(`http://localhost:5000/leads/${_id}`, { status });
        console.log('Lead status updated');
        setLeads((prevLeads) => prevLeads.map(lead => 
          lead._id === _id ? { ...lead, status } : lead
        ));
      } catch (error) {
        console.error('Error updating lead status:', error);
      }
    };

    const closeDropdown = () => {
      setIsDropdownOpen(false);
      setTimeout(() => {
        setIsDropdownVisible(false);
        setSelectedLead(null);
      }, 2000); 
    };

    const handleLeadClick = (lead) => {
      if (selectedLead && selectedLead._id === lead._id) {
        closeDropdown();
      } else {
        setSelectedLead(lead);
        setIsDropdownVisible(true);
        setTimeout(() => {
          setIsDropdownOpen(true);
        }, 10); 
      }
    };

    const assignLead = async (_id, userId) => {
      try {
        await axios.put(`http://localhost:5000/leads/${_id}`, {
          assignedto: userId
        });
        console.log('Lead assigned');
        const updatedLeads = leads.map(lead =>
          lead._id === _id ? { ...lead, assignedto: userId } : lead
        );
        setLeads(updatedLeads);
      } catch (error) {
        console.error('Error assigning lead:', error);
      }
    };


    const filteredUsers = users.filter(user => user.userType !== 'Admin');

    return (
      <div className=''>
        <h2>View Leads</h2>
        <div className='boxcontainer mt-3'>
          <div className='Homebox'>
            <h3 className='mt-3 boxheading'>New Leads</h3>
            {leads.map((lead) => (
              <div className='leadsdiv' key={lead._id}>
                <div
                  className='leadsnumber'
                  onClick={() => handleLeadClick(lead)}
                >
                  {lead.number}
                </div>
                {selectedLead && selectedLead._id === lead._id && (
                  <div className={`custom-dropdown ${isDropdownOpen ? 'open' : ''}`} ref={dropdownRef}>
                    <h6>Assign This Lead to</h6>
                    {isLoading ? (
                      <div>Loading...</div>
                    ) : (
                      filteredUsers.map((user) => (
                        <div key={user._id} className='custom-dropdown-item d-flex justify-content-between'>
                          {user.fname} {user.lname} ({user.userType})
                          <button className='transferbutt' onClick={() => assignLead(lead._id, user._id)}>Transfer</button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className='Homebox'>
            <h3 className='mt-3 boxheading'>Not Picked</h3>
          </div>
          <div className='Homebox'>
            <h3 className='mt-3 boxheading'>Switch Off</h3>
          </div>
          <div className='Homebox'>
            <h3 className='mt-3 boxheading'>Wrong Number</h3>
          </div>
          <div className='Homebox'>
            <h3 className='mt-3 boxheading'>Call Back</h3>
          </div>
          <div className='Homebox'>
            <h3 className='mt-3 boxheading'>Interested</h3>
          </div>
          <div className='Homebox'>
            <h3 className='mt-3 boxheading'>Not Interested</h3>
          </div>
          <div className='Homebox'>
            <h3 className='mt-3 boxheading'>Broker</h3>
          </div>
        </div>
      </div>
    );
  };

  export default ViewLeads;
