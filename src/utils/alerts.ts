import { toast as rToast } from "react-toastify";
import toast from "react-hot-toast";

export const successToast = (payload: string, id: string) => {
  return rToast.success(payload, {
    toastId: id,
    autoClose: 4000,
    pauseOnFocusLoss: false,
  });
};

export const errorToast = (payload: string, id: string) => {
  return rToast.error(payload, {
    toastId: id,
    autoClose: 4000,
    pauseOnFocusLoss: false,
  });
};

export const successHotToast = (payload: string) => {
  return toast.success(payload, {
    duration: 4000,
  });
};

export const errorHotToast = (payload: string) => {
  return toast.error(payload, {
    duration: 4000,
  });
};
