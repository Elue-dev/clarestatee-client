import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { REMOVE_ACTIVE_USER } from "./redux/slices/auth_slice";
import { d } from "./utils/junk";
import AllRoutes from "./utils/routes";
import Header from "./components/header/Header";
import ScrollToTop from "./utils/scroll_to_top";
import { logoutUser } from "./services/auth_services";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(async () => {
      await logoutUser();
      dispatch(REMOVE_ACTIVE_USER());
    }, d);
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Header />
        <AllRoutes />
        <ScrollToTop />
        <ToastContainer
          toastStyle={{
            backgroundColor: "rgba(44, 134, 179, 0.364)",
            color: "#fff",
          }}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
