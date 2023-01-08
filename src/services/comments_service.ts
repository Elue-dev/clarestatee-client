import { errorHotToast, successHotToast } from "../utils/alerts";
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
    return response.data;
  } catch (error: any) {
    errorHotToast(error.response.data.message);
  }
};

export const removeComment = async (commenID: string, token: string) => {
  try {
    const response = await axios.delete(
      `${server_url}/api/comments/${commenID}`,
      { headers: { authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error: any) {
    errorHotToast(error.response.data.message);
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
    return response.data;
  } catch (error: any) {
    errorHotToast(error.response.data.message);
  }
};
