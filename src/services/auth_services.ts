import { loginType, registerType, resetType } from "@/types/auth_types";
import { errorHotToast, successHotToast } from "../utils/alerts";
import axios from "axios";

//@ts-ignore
export const server_url = import.meta.env.VITE_REACT_APP_SERVER_URL;

export const validateEmail = (email: string) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

export const registerUser = async (credentials: registerType) => {
  try {
    const response = await axios.post(
      `${server_url}/api/auth/signup`,
      credentials
    );
    return response.data;
  } catch (error: any) {
    errorHotToast(error.response.data.message);
  }
};

export const verifyEmail = async (code: string, userID: string | undefined) => {
  try {
    const response = await axios.post(
      `${server_url}/api/auth/verify-email/${userID}`,
      { code }
    );
    return response.data;
  } catch (error: any) {
    errorHotToast(error.response.data.message);
  }
};

export const sendVerificationCode = async (email: string) => {
  try {
    const response = await axios.post(
      `${server_url}/api/auth/send-verification-code`,
      { email }
    );
    if (response?.data.status === "success") {
      successHotToast(response?.data.message);
    }
    return response.data;
  } catch (error: any) {
    errorHotToast(error.response.data.message);
  }
};

export const loginUser = async (credentials: loginType) => {
  try {
    const response = await axios.post(
      `${server_url}/api/auth/login`,
      credentials
    );
    return response.data;
  } catch (error: any) {
    errorHotToast(error.response.data.message);
  }
};

export const logoutUser = async () => {
  try {
    await axios.get(`${server_url}/api/auth/logout`);
  } catch (error: any) {
    errorHotToast(error.response.data.message);
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await axios.post(
      `${server_url}/api/auth/forgot-password`,
      { email }
    );
    if (response?.data.status === "success") {
      successHotToast(response?.data.message);
    }
    return response.data;
  } catch (error: any) {
    errorHotToast(error.response.data.message);
  }
};

export const restorePassword = async (
  credentials: resetType,
  token: string | undefined
) => {
  try {
    const response = await axios.post(
      `${server_url}/api/auth/reset-password/${token}`,
      credentials
    );
    if (response?.data.status === "success") {
      successHotToast(response?.data.message);
    }
    return response.data;
  } catch (error: any) {
    errorHotToast(error.response.data.message);
  }
};

export const updatePassword = async (token: string, credentials: any) => {
  try {
    const response = await axios.put(
      `${server_url}/api/auth/update-password`,
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

export const emergencyReset = async (userID: any, email: string) => {
  try {
    const response = await axios.put(
      `${server_url}/api/auth/emergency-password-reset/${userID}`,
      { email }
    );
    if (response?.data.status === "success") {
      successHotToast(response?.data.message);
    }

    return response.data;
  } catch (error: any) {
    errorHotToast(error.response.data.message);
  }
};
