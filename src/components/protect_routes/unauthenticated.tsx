import { selectIsLoggedIn } from "../../redux/slices/auth_slice";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function Unauthenticated({ children }: any) {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" />;
  }

  return children;
}
