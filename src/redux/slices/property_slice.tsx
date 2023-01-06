import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
  cities: [],
};

const product_slice = createSlice({
  name: "property",
  initialState,
  reducers: {
    SET_CITIES: (state, action) => {
      const properties = action.payload;
      let cities_array: any = [];
      properties?.map((property: any) => {
        const { city } = property;
        return cities_array.push(city);
      });
      const cities = [...new Set(cities_array)];

      //@ts-ignore
      state.cities = cities;
    },
  },
});

export const { SET_CITIES } = product_slice.actions;

export const selectCities = (state: RootState) => state.property.cities;

export default product_slice.reducer;
