import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  info: {
    role: "",
    username: "",
    email: "",
    address: "",
    mobile: "",
    token: "",
  },
};

const passengerSlice = createSlice({
  name: "passenger",
  initialState,
  reducers: {
    setPassengerInfo: (state, action) => {
      state.info = action.payload;
    },
  },
});

export const { setPassengerInfo } = passengerSlice.actions;
export const passengerData = (state) => state.passenger.info;
export default passengerSlice.reducer;
