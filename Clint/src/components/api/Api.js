import axios from 'axios';

const API_URL = process.env.REACT_APP_PORT;

export const fetchLeads = async () => {
    try {
      const response = await axios.get(`${API_URL}/leads`);
      return response.data;
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
  };
  export const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/getAllUser`);
      if (response.data.status === 'ok') {
        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };
  export const updateLeadStatus = async (leadId, newStatus) => {
    try {
      const response = await axios.put(`${API_URL}/leads/update/${leadId}`, { status: newStatus });
      return response.data;
    } catch (error) {
      console.error('Error updating lead status:', error);
      throw error;
    }
  };
  export const deleteDeal = async (dealId) => {
    try {
      const response = await axios.delete(`${API_URL}/leads/delete/${dealId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting deal:', error);
      throw error;
    }
  };
  export const moveCard = async (draggedId, droppedStage) => {
    try {
      const response = await axios.put(`${API_URL}/leads/move/${draggedId}`, { newStatus: droppedStage });
      return response.data;
    } catch (error) {
      console.error('Error moving card:', error);
      throw error;
    }
  };