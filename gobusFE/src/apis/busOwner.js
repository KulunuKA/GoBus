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

export const updateEmployee = async (id, data) => {
  return await axiosInstance.put(`auth/employee/update/${id}`, data, options);
};

export const getRoutes = async (id) => {
  return await axiosInstance.get(`auth/route/get/${id}`, options);
};

export const addRoute = async (data) => {
  return await axiosInstance.post("auth/route/add", data, options);
};

export const deleteRoute = async (id) => {
  return await axiosInstance.delete(`auth/route/delete/${id}`, options);
};

export const updateRoute = async (id, data) => {
  return await axiosInstance.put(`auth/route/update/${id}`, data, options);
};

export const getRequests = async(id)=>{
  return await axiosInstance.get(`auth/busowner/trip/${id}`, options);
}