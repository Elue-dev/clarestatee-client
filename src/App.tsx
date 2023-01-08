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
import useNetworkStatus from "./hooks/useNetworkStatus";
import OfflinePage from "./pages/offline_page/OfflinePage";
import { Toaster } from "react-hot-toast";

function App() {
  const dispatch = useDispatch();
  const status = useNetworkStatus();

  // useEffect(() => {
  //   setTimeout(async () => {
  //     await logoutUser();
  //     dispatch(REMOVE_ACTIVE_USER());
  //   }, d);
  // }, []);

  return (
    <div>
      {!status ? (
        <OfflinePage />
      ) : (
        <>
          <BrowserRouter>
            <Header />
            <AllRoutes />
            <ScrollToTop />
            <Toaster />
            <ToastContainer
              toastStyle={{
                backgroundColor: "rgba(44, 134, 179, 0.364)",
                color: "#fff",
              }}
            />
          </BrowserRouter>
        </>
      )}
    </div>
  );
}

export default App;
