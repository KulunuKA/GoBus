import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  info: {
    role: "Passenger",
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
export default passengerSlice.reducer;
