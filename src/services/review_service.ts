import { errorHotToast, successHotToast } from "../utils/alerts";
import axios from "axios";

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

    return response.data;
  } catch (error: any) {
    errorHotToast(error.response.data.message);
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
    return response.data;
  } catch (error: any) {
    errorHotToast(error.response.data.message);
  }
};
