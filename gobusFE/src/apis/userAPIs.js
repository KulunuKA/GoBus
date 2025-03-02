import axiosInstance from "../services/axios instance";

// const headers = {
//   "Content-Type": "application/json",
//   Authorization: "",
// };

// const option = {
//   header: headers,
// };

export const login = async (data) => {
  await axiosInstance.post("public/login", data);
};
