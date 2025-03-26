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

export const getSpecialBuses = async (type, district, city) => {
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
export const getPublicBuses = async (type, start, end,condition) => {
  let url = "public/bus/get";
  if (type) {
    url += `?type=${type}`;
  }
  if (start) {
    url += `&start=${start}`;
  }
  if (end) {
    url += `&end=${end}`;
  }

  if (condition) {
    url += `&ac=${condition}`;
  }

  return await axiosInstance.get(url);
};

export const getBus = async (id) => {
  return await axiosInstance.get(`public/bus/get/${id}`);
};

export const requestTrip = async (data) => {
  return await axiosInstance.post(`auth/trip/request/`, data, options);
};

export const getTrips = async (id) => {
  return await axiosInstance.get(`auth/trip/get/${id}`);
};
