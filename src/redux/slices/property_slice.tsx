import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
  categories: [],
};

const product_slice = createSlice({
  name: "property",
  initialState,
  reducers: {
    SET_CAREGORIES: (state, action) => {
      const properties = action.payload;
      let locations_array: any = [];
      properties?.map((property: any) => {
        const { location } = property;
        return locations_array.push(location);
      });
      const locations = [...new Set(locations_array)];

      //@ts-ignore
      state.categories = locations;
    },
  },
});

export const { SET_CAREGORIES } = product_slice.actions;

export const selectLocations = (state: RootState) => state.property.categories;

export default product_slice.reducer;
