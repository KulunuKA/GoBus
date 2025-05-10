import axios from "axios";
import { NGROK_URL } from "../Keys";

const BASE_URL =NGROK_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Login API Call
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/public/employee/login", credentials);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const handleStatus = async (id, data) => {
  try {
    console.log(id, data);
    const response = await api.put(`/public/bus/employee/update/${id}`, data);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getIncomeHistory = async () => {
  try {
    const response = await api.get("/public/bus/employee/income");
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

//addincome
export const addIncome = async (id, data) => {
  try {
    const response = await api.post(`/public/employee/addincome/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};
