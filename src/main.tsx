import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
// import { QueryClientProvider, QueryClient } from "react-query";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import store from "./redux/store";

let persistor = persistStore(store);
// const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/* <QueryClientProvider client={queryClient}> */}
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
    {/* </QueryClientProvider> */}
  </React.StrictMode>
);
