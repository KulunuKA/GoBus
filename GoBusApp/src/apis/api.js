import axios from "axios";

const BASE_URL =
  "https://63ef-2402-4000-2110-43e6-819a-984d-e486-303.ngrok-free.app";

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
