import { errorToast, successToast } from "../utils/alerts";
import axios from "axios";

//@ts-ignore
const server_url = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface commentData {
  comment: string;
}

export const createComment = async (
  propertyID: string,
  commentData: commentData,
  token: string
) => {
  try {
    const response = await axios.post(
      `${server_url}/api/properties/${propertyID}/comments`,
      commentData,
      { headers: { authorization: `Bearer ${token}` } }
    );
    if (response?.data.status === "success") {
      successToast(response?.data.message, "addcsuccess");
    }
    return response.data;
  } catch (error: any) {
    errorToast(error.response.data.message, "addcerr");
  }
};

export const removeComment = async (commenID: string, token: string) => {
  try {
    const response = await axios.delete(
      `${server_url}/api/comments/${commenID}`,
      { headers: { authorization: `Bearer ${token}` } }
    );
    if (response?.data.status === "success") {
      successToast(response?.data.message, "delcomsuccess");
    }
    return response.data;
  } catch (error: any) {
    errorToast(error.response.data.message, "delcomcerr");
  }
};

export const updateComment = async (
  commenID: string,
  token: string,
  comment: any
) => {
  try {
    const response = await axios.patch(
      `${server_url}/api/comments/${commenID}`,
      comment,
      { headers: { authorization: `Bearer ${token}` } }
    );
    if (response?.data.status === "success") {
      successToast(response?.data.message, "delcomsuccess");
    }
    return response.data;
  } catch (error: any) {
    errorToast(error.response.data.message, "delcomcerr");
  }
};
