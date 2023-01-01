import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
  filteredProperties: [],
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    // FILTER_BY_PURPOSE: (state, action) => {
    //   const { blogPosts, category } = action.payload;
    //   console.log(action.payload);
    //   let tempBlogs = [];
    //   if (category === "All") {
    //     tempBlogs = blogPosts;
    //   } else {
    //     tempBlogs = blogPosts.filter((post: any) => post.category === category);
    //   }
    //   state.filteredBlogs = tempBlogs;
    // },
    FILTER_BY_LOCATION: (state, action) => {
      const { properties, location } = action.payload;
      let tempProperties = [];
      if (location === "All") {
        tempProperties = properties;
      } else {
        tempProperties = properties.filter(
          (property: any) =>
            property.location.toLowerCase() === location.toLowerCase()
        );
      }
      state.filteredProperties = tempProperties;
    },
    FILTER_BY_SEARCH: (state, action) => {
      const { properties, search } = action.payload;

      let tempProperties = properties.filter(
        (property: any) =>
          property.location.toLowerCase().includes(search.toLowerCase()) ||
          property.name.toLowerCase().includes(search.toLowerCase())
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

      state.filteredProperties = tempProperties;
    },
  },
});

export const {
  //   FILTER_BY_PURPOSE,
  FILTER_BY_LOCATION,
  FILTER_BY_SEARCH,
  SORT_PROPERTIES,
} = filterSlice.actions;

export const selectFilteredProperties = (state: RootState) =>
  state.filter.filteredProperties;

export default filterSlice.reducer;
