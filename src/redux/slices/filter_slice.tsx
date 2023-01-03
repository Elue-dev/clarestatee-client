import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
  filteredProperties: [],
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    FILTER_BY_CITY: (state, action) => {
      const { properties, city } = action.payload;
      let tempProperties = [];
      if (city === "All") {
        tempProperties = properties;
      } else {
        tempProperties = properties.filter(
          (property: any) => property.city.toLowerCase() === city.toLowerCase()
        );
      }
      state.filteredProperties = tempProperties;
    },
    FILTER_BY_SEARCH: (state, action) => {
      const { properties, search } = action.payload;

      let tempProperties = properties.filter(
        (property: any) =>
          property.location.toLowerCase().includes(search.toLowerCase()) ||
          property.name.toLowerCase().includes(search.toLowerCase()) ||
          property.city.toLowerCase().includes(search.toLowerCase())
      );
      state.filteredProperties = tempProperties;
    },
    SORT_PROPERTIES: (state, action) => {
      const { properties, sort } = action.payload;

      let tempProperties = [];
      if (sort === "latest") {
        tempProperties = properties;
      }
      if (sort === "lowest-price") {
        tempProperties = properties.slice().sort((a: any, b: any) => {
          return a.price - b.price;
        });
      }
      if (sort === "highest-price") {
        tempProperties = properties.slice().sort((a: any, b: any) => {
          return b.price - a.price;
        });
      }
      if (sort === "Available") {
        tempProperties = properties.filter(
          (property: any) => property.availability === "Available"
        );
      }
      if (sort === "Not Available") {
        tempProperties = properties.filter(
          (property: any) => property.availability === "Not Available"
        );
      }
      if (sort === "For Sale") {
        tempProperties = properties.filter(
          (property: any) => property.purpose === "Sale"
        );
      }
      if (sort === "For Rent") {
        tempProperties = properties.filter(
          (property: any) => property.purpose === "Rent"
        );
      }
      if (sort === "For Shortlet") {
        tempProperties = properties.filter(
          (property: any) => property.purpose === "Shortlet"
        );
      }

      state.filteredProperties = tempProperties;
    },
  },
});

export const { FILTER_BY_CITY, FILTER_BY_SEARCH, SORT_PROPERTIES } =
  filterSlice.actions;

export const selectFilteredProperties = (state: RootState) =>
  state.filter.filteredProperties;

export default filterSlice.reducer;
