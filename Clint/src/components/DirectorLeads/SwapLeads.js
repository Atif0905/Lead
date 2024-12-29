import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { IoMdArrowDropdown } from "react-icons/io";
import moment from "moment";

const SwapLeads = ({ subUsers, executives, currentUserKey }) => {
  const stages = useSelector((state) => state.stages);
  const filteredStages = stages.filter(
    (stage) => stage === "Not Interested" || stage === "Switch Off" || stage === "Wrong Number"
  );

  const [showStagesDropdown, setShowStagesDropdown] = useState(false);
  const [showUsersDropdown, setShowUsersDropdown] = useState(false);
  const [showCustomDropdown, setShowCustomDropdown] = useState(false);
  const [leads, setLeads] = useState([]);
  const [visibleOtherSubUsers, setVisibleOtherSubUsers] = useState({});
  const [allExecutiveLeads, setAllExecutiveLeads] = useState([]);
  const [selectedUserType, setSelectedUserType] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);  

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_PORT}/leads`);
        setLeads(response.data);
      
      } catch (err) {
        console.error("Error fetching leads:", err);
      }
    };

    fetchLeads();
  }, []);

  const filteredSubUsers = subUsers.filter((subUser) => subUser.key === currentUserKey);

  const handleToggleStagesDropdown = () => {
    setShowStagesDropdown((prev) => !prev);
  };

  const handleToggleUserDropdown = () => {
    setShowUsersDropdown((prev) => !prev);
  };
  const handleUserSelection = (type) => {
    setSelectedUserType(type);
    setShowUsersDropdown(false); // Close the dropdown after selection
  };

  const handleToggleCustomDropdown = () => {
    setShowCustomDropdown((prev) => !prev);
    setShowStagesDropdown(false); // Close stages dropdown if open
  };

  const handleToggleOtherSubUsers = (index) => {
    setVisibleOtherSubUsers((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleSwapLead = async (leadId, newAssignedTo) => {
    try {
      await axios.put(`${process.env.REACT_APP_PORT}/leads/move/${leadId}`, {
        assignedto: newAssignedTo,
      });
      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead._id === leadId ? { ...lead, assignedto: newAssignedTo } : lead
        )
      );
    } catch (error) {
      console.error("Error updating lead assignment:", error);
    }
  };

  // Collect all executive leads
  useEffect(() => {
    const collectedExecutiveLeads = [];

    executives.forEach((executive) => {
      const executiveLeads = leads.filter(
        (lead) => lead.assignedto === executive.id && filteredStages.includes(lead.status)
      );
      if (executiveLeads.length > 0) {
        collectedExecutiveLeads.push(...executiveLeads);
      }
    });

    setAllExecutiveLeads(collectedExecutiveLeads);
    // console.log(collectedExecutiveLeads)
  }, [leads, executives, filteredStages]);

  const handleStageSelection = (stage) => {
    setSelectedStage(stage); // Set the selected stage
    setShowStagesDropdown(false); // Close the dropdown after selection
  };

  const getFilteredLeads = (leads, selectedStage) => {
    if (!selectedStage) return leads;

    // Extract the number of days from the selected stage
    const stageDays = parseInt(selectedStage, 10);
    return leads.filter((lead) => {
      const daysAgo = moment().diff(moment(lead.updatedAt), 'days');
      return daysAgo === stageDays;
    });
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div className="position-relative">
                <button onClick={handleToggleCustomDropdown}>
                  Custom button <IoMdArrowDropdown className="ms-2" />
                </button>
                {showCustomDropdown && (
                  <div className="dropdown-stagescontent">
                    <div>
                    <li className="stages-item"  onClick={() => handleStageSelection("0")}>0 day</li>
                      <li className="stages-item"  onClick={() => handleStageSelection("1")}>1 day</li>
                      <li className="stages-item" onClick={() => handleStageSelection("2")}>2 day</li>
                      <li className="stages-item" onClick={() => handleStageSelection("3")}>3 day</li>
                    </div>
                  </div>
                )}
              </div>
              <div className="d-flex">
                <div className="position-relative">
                <button onClick={ handleToggleUserDropdown }>User's <IoMdArrowDropdown className="ms-3" />
                  </button>
                  {showUsersDropdown && (
                  <div className="dropdown-stagescontent">
                    <div>
                     <p className="stages-item"  onClick={() => handleUserSelection("Teamlead")}>Teamlead</p>
                     <p className="stages-item" onClick={() => handleUserSelection("Executive")}>Executive</p>
                    </div>
                  </div>
                )}
                </div>
              <div className="ms-3 position-relative">
                <button onClick={handleToggleStagesDropdown}>
                  Leads Stages <IoMdArrowDropdown className="ms-3" />
                </button>
                {showStagesDropdown && (
                  <div className="dropdown-stagescontent">
                    <div>
                      {filteredStages.map((stage, index) => (
                        <li key={index} className="stages-item">
                          {stage}
                        </li>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              </div>
            </div>
            <div className="mt-4 swap_grid">
              {filteredSubUsers.map((subUser, index) => {
                const matchingExecutives = executives.filter(
                  (executive) => executive.key === subUser.key1
                );
                return (
                  <div key={index} className="mb-3 border swapbox">
                    <div className="subuser-box p-3">
                     <h6 className="text-center"> {subUser.fname} {subUser.lname}</h6>
                 
                    </div>
                    {selectedUserType === "Teamlead" && (
                    <div className="teamlead_div m-3">
  <h5 className="text-center">Total Leads</h5>
 
  {getFilteredLeads(
  leads.filter((lead) => lead.assignedto === subUser.key1 && filteredStages.includes(lead.status)),
  selectedStage
).length > 0 ? (
  <h1 className="text-center">
    {
      getFilteredLeads(
        leads.filter(
          (lead) =>
            lead.assignedto === subUser.key1 && filteredStages.includes(lead.status)
        ),
        selectedStage
      ).length
    }
  </h1>
) : (
  <p>No leads available</p>
)}
 

 
</div>

     )}
     {selectedUserType === "Executive" &&(
<div>
  <h6>Executive's leads</h6>
                    { matchingExecutives.length > 0 && (
                      <div className="executives-box p-3">
                        <ul className="list-unstyled mt-2">
                        {matchingExecutives.map((executive, index) => {
                                const executiveLeads = getFilteredLeads(
                                  leads.filter(
                                    (lead) => lead.assignedto === executive.id && filteredStages.includes(lead.status)
                                  ),
                                  selectedStage
                                );
                                return (
                              <li key={index} className="mb-2">
                                {executive.fname} {executive.lname}
                                {executiveLeads.length > 0 && (
                                  <ul className="list-unstyled">
                                    {executiveLeads.map((lead, idx) => (
                                      <div className="swaplead_card" key={idx}>
                                        <p>{lead.name}</p>
                                        <p>{lead.status}</p>
                                        <p>{lead.assignedto}</p>
                                        <p>updated at: {moment().diff(moment(lead.updatedAt), 'days')} days ago</p>
                                      </div>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                    <div className="d-flex align-items-center justify-content-center">
                      <button
                        className="mb-3"
                        onClick={() => handleToggleOtherSubUsers(index)}
                      >
                        Swap button
                      </button>
                    </div>
                    {visibleOtherSubUsers[index] && (
                      <div className="other-subusers ps-3">
                        <ul className="list-unstyled">
                          {filteredSubUsers
                            .filter((otherSubUser) => otherSubUser !== subUser)
                            .map((otherSubUser, idx) => (
                              <button
                                key={idx}
                                onClick={() =>
                                  allExecutiveLeads.forEach((lead) =>
                                    handleSwapLead(lead._id, otherSubUser.key1)
                                  )
                                }
                              >
                                {otherSubUser.fname} {otherSubUser.lname}
                              </button>
                            ))}
                        </ul>
                      </div>
                    )}
                    </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SwapLeads;
