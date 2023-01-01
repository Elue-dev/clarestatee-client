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
import { QueryClientProvider, QueryClient } from "react-query";

const queryClient = new QueryClient();

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      dispatch(REMOVE_ACTIVE_USER());
    }, d);
  }, []);

  return (
    <div>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </div>
  );
}

export default App;
