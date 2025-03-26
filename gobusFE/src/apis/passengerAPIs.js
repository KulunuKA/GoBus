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

export const getSpecialBuses = async (type,district,city) => {

  let url = "public/bus/get";
  if (type) {
    url += `?type=${type}`;
  }
  if (district) {
    url += `&district=${district}`;
  }
  if (city) {
    url += `&city=${city}`;
  }

  return await axiosInstance.get(url);
};
