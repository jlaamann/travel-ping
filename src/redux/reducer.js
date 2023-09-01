import { createSlice } from "@reduxjs/toolkit";
import data from "../data.json";

const options = [
  {
    name: "Option 1",
    description: "Estimated total population",
  },
  {
    name: "Option 2",
    description: "Estimate total GDP in millions of dollars",
  },
];

const initialState = {
  data,
  options,
  active: options[0],
};

const mapOption = createSlice({
  name: "mapOption",
  initialState,
  reducers: {
    setActiveOptionAction(state, action) {
      state.active = action.payload;
    },
  },
});

export const { setActiveOptionAction } = mapOption.actions;

export default mapOption.reducer;
