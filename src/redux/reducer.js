import { createSlice } from "@reduxjs/toolkit";
import data from "../data.json";

const initialState = {};

const mapOption = createSlice({
  name: "mapOption",
  initialState,
  reducers: {},
});

// export const { setActiveOptionAction } = mapOption.actions;

export default mapOption.reducer;
