import {
    SET_DEALS,
    SET_LEADS,
    SET_IS_ADD_LEADS,
    SET_USERS,
    SET_SELECTED_USER,
    SET_SUB_USERS,
    SET_EXECUTIVES,
    SET_IS_LOADING,
    SET_TOTAL_LEADS,
    SET_IS_POPUP_VISIBLE,
    SET_IS_ASSIGN_LEAD,
    SET_IS_MODAL_OPEN,
    SET_STAGES,
    SET_ADMINSTAGES,
    SET_NEW_STAGE,
    SET_IS_ADDING_STAGE,
    SET_IS_DROPDOWN_OPEN,
    SET_IS_USER_DROPDOWN,
    SET_IS_TEAM_DROPDOWN,
    SET_IS_DRAGGING,
    SET_SELECTED_LEAD_ID,
    TOGGLE_POPUP_ADD,
  } from '../redux/actions';
  
  const initialState = {
    deals: [],
    leads: null,
    isAddLeads: false,
    users: [],
    subUsers: [],
    setSelectedUser: null,
    executives: [],
    isLoading: true,
    totalLeads: 0,
    isPopupVisible: false,
    isAssignLead: false,
    isModalOpen: false,
    isDropdownOpen: false,
    isUserDropdown: false,
    isTeamDropdown: false,
    selectedLeadId: null,
    stages: [ 'Lead In', 
        'Contact Made', 
        'Switch Off', 
        'Wrong Number', 
        'Call Back', 
        'Interested', 
        'Not Interested', 
        'Broker'
    ],
    adminstages: [ 'Lead In', 
      'Contact Made', 
      'Switch Off', 
      'Wrong Number', 
      'Call Back', 
      'Interested', 
      'Not Interested', 
      'Broker',
      'Lost',
      'won'
  ],
    newStage: '',
    isAddingStage: false,
  };
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_DEALS:
        return { ...state, deals: action.payload };
        case SET_LEADS:
          return { ...state, leads: action.payload };
          case SET_IS_ADD_LEADS:
            return { ...state, isAddLeads: action.payload };
      case SET_USERS:
        return { ...state, users: action.payload };
        case SET_SELECTED_USER:
          return { ...state, setSelectedUser: action.payload };
        case SET_EXECUTIVES:
          return { ...state, executives: action.payload };
      case SET_SUB_USERS:
        return { ...state, subUsers: action.payload };
      case SET_IS_LOADING:
        return { ...state, isLoading: action.payload };
        case SET_TOTAL_LEADS:
          return { ...state, totalLeads: action.payload };
    case SET_IS_POPUP_VISIBLE:
        return { ...state, isPopupVisible: action.payload };
    case SET_IS_ASSIGN_LEAD:
        return { ...state,  isAssignLead: action.payload };
    case SET_IS_MODAL_OPEN:
        return { ...state, isModalOpen: action.payload };
        case SET_IS_USER_DROPDOWN:
            return { ...state, isUserDropdown: action.payload };
        case SET_IS_DROPDOWN_OPEN:
            return { ...state, isDropdownOpen: action.payload };
        case SET_IS_TEAM_DROPDOWN:
            return { ...state, isTeamDropdown: action.payload };
            case SET_IS_DRAGGING:
                return { ...state, dragging: action.payload };
      case SET_STAGES:
        return { ...state, stages: action.payload };
        case SET_ADMINSTAGES:
          return { ...state, adminstages: action.payload };
      case SET_NEW_STAGE:
        return { ...state, newStage: action.payload };
      case SET_IS_ADDING_STAGE:
        return { ...state, isAddingStage: action.payload };
        case SET_SELECTED_LEAD_ID:
          return { ...state, selectedLeadId: action.payload };
        case TOGGLE_POPUP_ADD:
          return { ...state, isPopupVisible: !state.isPopupVisible };
      default:
        return state;
    }
  };
  
  export default reducer;
  