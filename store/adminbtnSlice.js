// adminbtnSlice.js
"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "",
  add: null,
  refresh: null,
  excel: null,
  // New flag to signal that the Excel button was clicked.
  excelClicked: false,
};

const adminbtnSlice = createSlice({
  name: "adminBtn",
  initialState,
  reducers: {
    setTitle(state, action) {
      state.title = action.payload;
    },
    clearTitle(state) {
      state.title = "";
    },
    showAdd(state, action) {
      state.add = action.payload;
    },
    hideAdd(state) {
      state.add = null;
    },
    showRefresh(state, action) {
      state.refresh = action.payload;
    },
    hideRefresh(state) {
      state.refresh = null;
    },
    showExcel(state, action) {
      state.excel = action.payload;
    },
    hideExcel(state) {
      state.excel = null;
    },
    // New actions to trigger and reset Excel generation.
    triggerExcel(state) {
      state.excelClicked = true;
    },
    resetExcel(state) {
      state.excelClicked = false;
    },
  },
});

export const {
  setTitle,
  clearTitle,
  showAdd,
  hideAdd,
  showRefresh,
  hideRefresh,
  showExcel,
  hideExcel,
  triggerExcel,
  resetExcel,
} = adminbtnSlice.actions;
export default adminbtnSlice.reducer;
