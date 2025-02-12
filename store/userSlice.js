"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  boarding: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload; // Set the full user object
    },
    onBoarding(state, action) {
      console.log("Redux onBoarding hit with:", action.payload);
      state.boarding = action.payload; 
      if (state.user) {
        state.user.boarding = action.payload; // Update user-specific onboarding status
      }
    },
    clearUser(state) {
      state.user = null;
      state.boarding = false; // Reset onboarding status
    },
  },
});

export const { setUser, onBoarding, clearUser } = userSlice.actions;
export default userSlice.reducer;
