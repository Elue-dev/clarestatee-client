import { errorToast, successToast } from "../utils/alerts";
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
      successToast(response?.data.message, "rsuccess");
    }

    return response.data;
  } catch (error: any) {
    errorToast(error.response.data.message, "rerror");
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
    if (response?.data.status === "success") {
      successToast(response?.data.message, "rsuccess");
    }

    return response.data;
  } catch (error: any) {
    errorToast(error.response.data.message, "rerror");
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
      successToast(response?.data.message, "rsuccess");
    }

    return response.data;
  } catch (error: any) {
    errorToast(error.response.data.message, "rerror");
  }
};
