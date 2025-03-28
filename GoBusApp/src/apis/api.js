import axios from "axios";

const BASE_URL =
  "https://fd0e-2402-4000-2300-573-254a-3857-b51-1f50.ngrok-free.app";

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
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};
