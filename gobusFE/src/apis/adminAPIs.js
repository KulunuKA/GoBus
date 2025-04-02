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

export const updateComplaintsAD = async (id,data) => {
  return await axiosInstance.put(`auth/admin/complaints/${id}`,data);
};

export const getPassengersAD = async () => {
  return await axiosInstance.get("auth/admin/passengers");
};

export const deletePassengerAD = async (id) => {
  return await axiosInstance.delete(`auth/admin/passengers/${id}`);
};

