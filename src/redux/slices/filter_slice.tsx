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

      switch (sort) {
        case "latest":
          tempProperties = properties;
          break;
        case "lowest-price":
          tempProperties = properties.slice().sort((a: any, b: any) => {
            return a.price - b.price;
          });
          break;
        case "highest-price":
          tempProperties = properties.slice().sort((a: any, b: any) => {
            return b.price - a.price;
          });
          break;
        case "Available":
          tempProperties = properties.filter(
            (property: any) => property.availability === "Available"
          );
          break;
        case "Not Available":
          tempProperties = properties.filter(
            (property: any) => property.availability === "Not Available"
          );
          break;
        case "For Sale":
          tempProperties = properties.filter(
            (property: any) => property.purpose === "Sale"
          );
          break;
        case "For Rent":
          tempProperties = properties.filter(
            (property: any) => property.purpose === "Rent"
          );
          break;
        case "For Shortlet":
          tempProperties = properties.filter(
            (property: any) => property.purpose === "Shortlet"
          );
          break;
        default:
          tempProperties = properties;
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
