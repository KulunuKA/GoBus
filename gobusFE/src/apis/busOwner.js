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
