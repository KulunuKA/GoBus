import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  info: {
    authorityName: "",
    logo: "",
    email: "",
    phone: "",
    address: "",
    busesId: [],
    employeeId: [],
    routesId: [],
    token: "",
  },
};

const busOwnerSlice = createSlice({
  name: "busOwner",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.info = action.payload;
    },
  },
});

export const { setUserInfo } = busOwnerSlice.actions;
export const busOwnerData = (state) => state.busOwner.info;
export default busOwnerSlice.reducer;
