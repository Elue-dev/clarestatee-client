import { errorToast, successToast } from "../utils/alerts";
import axios from "axios";
import { string } from "yup";

interface revDataType {
  review: string;
  rating: number | undefined;
}

//@ts-ignore
export const server_url = import.meta.env.VITE_REACT_APP_SERVER_URL;

export const createReview = async (
  revData: revDataType,
  propertyID: string,
  token: string | null
) => {
  try {
    const response = await axios.post(
      `${server_url}/api/properties/${propertyID}/reviews`,
      revData,
      { headers: { authorization: `Bearer ${token}` } }
    );
    if (response?.data.status === "success") {
      successToast(response?.data.message, "rsuccess");
    }
    return response.data;
  } catch (error: any) {
    errorToast(error.response.data.message, "rerror");
  }
};

export const removeReview = async (reviewID: string, token: string) => {
  try {
    const response = await axios.delete(
      `${server_url}/api/reviews/${reviewID}`,
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
