import { errorToast, successToast } from "../utils/alerts";
import axios from "axios";

//@ts-ignore
const server_url = import.meta.env.VITE_REACT_APP_SERVER_URL;

export const createProperty = async (propertyData: any, token: string) => {
  try {
    const response = await axios.post(
      `${server_url}/api/properties`,
      propertyData,
      { headers: { authorization: `Bearer ${token}` } }
    );
    if (response?.data.status === "success") {
      successToast(response?.data.message, "addpsuccess");
    }
    return response.data;
  } catch (error: any) {
    errorToast(error.response.data.message, "addperr");
  }
};

export const getAllProperties = async () => {
  try {
    const response = await axios.get(`${server_url}/api/properties`);
    return response.data;
  } catch (error: any) {
    errorToast(error.response.data.message, "addperr");
  }
};

export const removeProperty = async (propertyID: string, token: string) => {
  try {
    const response = await axios.delete(
      `${server_url}/api/properties/${propertyID}`,
      {
        headers: { authorization: `Bearer ${token}` },
      }
    );
    if (response?.data.status === "success") {
      successToast(response?.data.message, "delcsuccess");
    }
    return response.data;
  } catch (error: any) {
    errorToast(error.response.data.message, "delperr");
  }
};

export const getSingleProperty = async (propertySlug: string) => {
  try {
    const response = await axios.get(
      `${server_url}/api/properties/${propertySlug}`
    );
    if (response?.data.status === "success") {
      successToast(response?.data.message, "delcsuccess");
    }
    return response.data;
  } catch (error: any) {
    errorToast(error.response.data.message, "delperr");
  }
};

export const updateProperty = async (
  propertyData: any,
  propertyID: string,
  token: string
) => {
  try {
    const response = await axios.patch(
      `${server_url}/api/properties/${propertyID}`,
      propertyData,
      {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.data.status === "success") {
      successToast(response?.data.message, "delcsuccess");
    }
    return response.data;
  } catch (error: any) {
    errorToast(error.response.data.message, "delperr");
  }
};
