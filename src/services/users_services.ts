import { errorHotToast, successHotToast } from "../utils/alerts";
import axios from "axios";

//@ts-ignore
export const server_url = import.meta.env.VITE_REACT_APP_SERVER_URL;

export const updateUser = async (
  userID: string,
  token: string,
  credentials: any
) => {
  try {
    const response = await axios.patch(
      `${server_url}/api/users/${userID}`,
      credentials,
      {
        headers: { authorization: `Bearer ${token}` },
      }
    );
    if (response?.data.status === "success") {
      successHotToast(response?.data.message);
    }
    return response.data;
  } catch (error: any) {
    errorHotToast(error.response.data.message);
  }
};

export const deleteUser = async (userID: string, token: string) => {
  try {
    const response = await axios.delete(`${server_url}/api/users/${userID}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    if (response?.data.status === "success") {
      successHotToast(response?.data.message);
    }
    return response.data;
  } catch (error: any) {
    errorHotToast(error.response.data.message);
  }
};

export const getUserProperties = async (token: string, credentials: any) => {
  try {
    const response = await axios.patch(
      `${server_url}/api/users/my-properties`,
      credentials,
      {
        headers: { authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error: any) {
    errorHotToast(error.response.data.message);
  }
};

export const sendContactEmail = async (token: string, contactData: any) => {
  try {
    const response = await axios.post(
      `${server_url}/api/contact`,
      contactData,
      {
        headers: { authorization: `Bearer ${token}` },
      }
    );
    if (response?.data.status === "success") {
      successHotToast(response?.data.message);
    }

    return response.data;
  } catch (error: any) {
    errorHotToast(error.response.data.message);
  }
};
