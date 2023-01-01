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
      successToast(response?.data.message, "addcsuccess");
    }
    return response.data;
  } catch (error: any) {
    errorToast(error.response.data.message, "addcerr");
  }
};
