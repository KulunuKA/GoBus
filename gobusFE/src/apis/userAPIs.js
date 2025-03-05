import axiosInstance from "../services/axios instance";

export const login = async (data) => {
  return await axiosInstance.post("public/login", data);
};
