import axiosInstance from "../services/axios instance";

const headers = {
  "Content-Type": "application/json",
  Authorization: "",
};

const options = {
  header: headers,
};

export const getComplaintsAD = async () => {
  return await axiosInstance.get("auth/admin/complaints");
};

export const updateComplaintsAD = async (id, data) => {
  return await axiosInstance.put(`auth/admin/complaints/${id}`, data);
};
export const closeTicketAD = async (id, data) => {
  return await axiosInstance.put(`auth/admin/closeTickets/${id}`, data);
};
export const deactivateChatAD = async (ticketId, data) => {
  return await axiosInstance.put(
    `auth/admin/deactivateChatRooms/${ticketId}`,
    data
  );
};

export const getPassengersAD = async () => {
  return await axiosInstance.get("auth/admin/passengers");
};

export const deletePassengerAD = async (id) => {
  return await axiosInstance.delete(`auth/admin/passengers/${id}`);
};

export const getSupportTicketsAD = async () => {
  return await axiosInstance.get("auth/admin/supportTickets");
};

export const getAllChatsAD = async () => {
  return await axiosInstance.get("auth/admin/chatRoom");
};


export const updateTicketInProgressAD = async (id, data) => {
  try {
    console.log(`Updating ticket ${id} with data:`, data);
    const response = await axiosInstance.put(
      `auth/admin/supportTickets/${id}`,
      data
    );
    console.log("Update ticket response:", response);

    return response.data || { success: true };
  } catch (error) {
    console.error("Error updating ticket status:", error);

    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }

    
    throw new Error(
      `Failed to update ticket: ${error.response?.data?.msg || error.message}`
    );
  }
};


export const createOrOpenChatAD = async (ticketId, userId) => {
  try {
    console.log(
      `Creating/opening chat for ticket ${ticketId} and user ${userId}`
    );
    
    const response = await axiosInstance.put(
      `auth/admin/chatRoom/${ticketId}`,
      { userId }
    );
    console.log("Create chat response:", response);

    
    return response.data || { success: true, ticketId, userId };
  } catch (error) {
    console.error("Error creating/opening chat:", error);

    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }

    
    throw new Error(
      `Failed to create chat: ${error.response?.data?.msg || error.message}`
    );
  }
};
