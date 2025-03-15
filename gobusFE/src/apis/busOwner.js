import { data } from "react-router-dom";
import axiosInstance from "../services/axios instance";

const headers = {
  "Content-Type": "application/json",
  Authorization: "",
};

const options = {
  header: headers,
};

export const busOwnerRegister = async (data) => {
  return await axiosInstance.post("public/busOwner/register", data);
};

//get all buses
export const getBuses = async (id) => {
  return await axiosInstance.get(`auth/busowner/getbuses/${id}`, options);
};

export const addBus = async (data) => {
  return await axiosInstance.post("auth/bus/add", data, options);
};

export const deleteBusAPI = async (id) => {
  return await axiosInstance.delete(`auth/bus/delete/${id}`, options);
};

export const updateBusAPI = async (id, data) => {
  return await axiosInstance.put(`auth/bus/update/${id}`, data, options);
};

export const getEmployees = async (id) => {
  return await axiosInstance.get(`auth/employee/get/${id}`, options);
};

export const addEmployee = async (data) => {
  return await axiosInstance.post("auth/employee/add", data, options);
};

export const deleteEmployee = async (id) => {
  return await axiosInstance.delete(`auth/employee/delete/${id}`, options);
};