import axiosInstance from "../services/axios instance";

const headers = {
  "Content-Type": "application/json",
  Authorization: "",
};

const options = {
  header: headers,
};

export const passengerRegister = async (data) => {
 return await axiosInstance.post("public/passenger/register", data);
};
