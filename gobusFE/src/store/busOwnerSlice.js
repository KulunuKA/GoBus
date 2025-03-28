import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  info: {
    authorityName: "",
    logo: "",
    email: "",
    phone: "",
    address: "",
    busesId: [],
    employeesId: [],
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
    updateBusOwnerInfo: (state, action) => {
      state.info = { ...state.info, ...action.payload };
    },
    updateBusId: (state, action) => {
      state.info.busesId.push(action.payload);
    },
    updateEmployeeId: (state, action) => {
      state.info.employeesId.push(action.payload);
    },
    updateRouteId: (state, action) => {
      state.info.routesId.push(action.payload);
    },
    clearStore: (state) => {
      state.info = initialState.info;
    },
  },
});

export const {
  setUserInfo,
  clearStore,
  updateRouteId,
  updateBusId,
  updateEmployeeId,
} = busOwnerSlice.actions;
export const busOwnerData = (state) => state.busOwner.info;
export default busOwnerSlice.reducer;
