import axios from "axios";

const BASE_URL =
  "https://6a8d-2402-4000-2300-573-859e-6069-56a5-e7e4.ngrok-free.app";

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
export const handleStart = async (id, data) => {
  try {
    const response = await api.put(`/public/bus/employee/update/${id}`, data);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};
