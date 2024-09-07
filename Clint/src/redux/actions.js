export const SET_DEALS = 'SET_DEALS';
export const SET_LEADS = 'SET_LEADS';
export const SET_IS_ADD_LEADS = 'SET_IS_ADD_LEADS';
export const SET_USERS = 'SET_USERS';
export const SET_SELECTED_USER = 'SET_SELECTED_USER';
export const SET_EXECUTIVES = 'SET_EXECUTIVES';
export const SET_SUB_USERS = 'SET_SUB_USERS';
export const SET_IS_LOADING = 'SET_IS_LOADING';
export const SET_TOTAL_LEADS = 'SET_TOTAL_LEADS';
export const SET_IS_POPUP_VISIBLE = 'SET_IS_POPUP_VISIBLE';
export const SET_SELECTED_LEAD_ID = 'SET_SELECTED_LEAD_ID';
export const SET_STAGES = 'SET_STAGES';
export const SET_NEW_STAGE = 'SET_NEW_STAGE';
export const SET_IS_ADDING_STAGE = 'SET_IS_ADDING_STAGE';
export const SET_IS_ASSIGN_LEAD = 'SET_IS_ASSIGN_LEAD'
export const SET_IS_MODAL_OPEN = 'SET_IS_MODAL_OPEN';
export const SET_IS_DROPDOWN_OPEN = ' SET_IS_DROPDOWN_OPEN';
export const SET_IS_USER_DROPDOWN = 'SET_IS_USER_DROPDOWN';
export const SET_IS_TEAM_DROPDOWN = 'SET_IS_TEAM_DROPDOWN';
export const SET_IS_DRAGGING = 'SET_IS_DRAGGING'
export const TOGGLE_POPUP_ADD = 'TOGGLE_POPUP_ADD';

export const setDeals = (deals) => ({ 
    type: SET_DEALS, 
    payload: deals
});
export const setLeads = (leads) => ({ 
    type: SET_LEADS, 
    payload: leads
});
export const setIsAddLeads = (isAddLeads) => ({ 
    type: SET_IS_ADD_LEADS, 
    payload: isAddLeads
});
export const setUsers = (users) => ({ 
    type: SET_USERS, 
    payload: users
 });
 export const setSelectedUser = (selectedUser) => ({ 
    type: SET_SELECTED_USER, 
    payload: selectedUser
 });
export const setExecutives = ( executives) => ({ 
    type: SET_EXECUTIVES, 
    payload: executives 
});
export const setSubUsers = (subUsers) => ({ 
    type: SET_SUB_USERS, 
    payload: subUsers 
});
export const setIsLoading = (isLoading) => ({ 
    type: SET_IS_LOADING, 
    payload: isLoading 
});
export const setTotalLeads = (totalLeads) => ({ 
    type: SET_TOTAL_LEADS, 
    payload: totalLeads 
});

export const setIsPopupVisible = (isPopupVisible) => ({ 
    type: SET_IS_POPUP_VISIBLE,
    payload: isPopupVisible
});
export const setIsAssignLead = (isAssignLead) => ({ 
    type: SET_IS_ASSIGN_LEAD,
    payload: isAssignLead
 });
 export const setIsModalOpen = (isModalOpen) => ({ 
    type: SET_IS_MODAL_OPEN,
    payload: isModalOpen
 });
 export const setIsDropdownOpen = (isDropdownOpen) => ({ 
    type: SET_IS_DROPDOWN_OPEN,
    payload: isDropdownOpen
 });
 export const setIsUserDropdown = (isUserDropdown) => ({ 
    type: SET_IS_USER_DROPDOWN,
    payload: isUserDropdown
 });
 export const setIsTeamDropdown = (isTeamDropdown) => ({ 
    type: SET_IS_TEAM_DROPDOWN,
    payload: isTeamDropdown
 });
export const setSelectedLeadId = (id) => ({ 
    type: SET_SELECTED_LEAD_ID, 
    payload: id 
});
export const setStages = (stages) => ({ 
    type: SET_STAGES,
     payload: stages 
    });
export const setNewStage = (newStage) => ({ 
    type: SET_NEW_STAGE, 
    payload: newStage
});
export const setIsDragging =(isDragging) => ({
    type: SET_IS_DRAGGING,
    payload: isDragging
})
export const setIsAddingStage = (isAdding) => ({
     type: SET_IS_ADDING_STAGE, 
     payload: isAdding 
    });
export const togglePopupVisible = () => ({ 
    type: TOGGLE_POPUP_ADD
 });
