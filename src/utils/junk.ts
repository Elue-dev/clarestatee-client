export const protectVerify = (userID: string | undefined) => {
  if (userID?.length !== 24) {
    location.assign("/auth/login");
  }
};

export const d = Date.now() + 60 * (60 * 1000);
//@ts-ignore
export const server_url = import.meta.env.VITE_REACT_APP_SERVER_URL;

// import {
//   createBrowserRouter,
//   createRoutesFromElements,
//   Route,
//   Routes,
// } from "react-router-dom";
// import Authenticated from "./components/protect_routes/authenticated";
// import Login from "./pages/auth/Login";
// import Signup from "./pages/auth/Signup";
// import ForgotPassword from "./pages/auth/ForgotPassword";
// import ResetPassword from "./pages/auth/ResetPassword";
// import VerifyCode from "./pages/auth/VerifyCode";
// import Unauthenticated from "./components/protect_routes/unauthenticated";
// import Home from "./pages/home/Home";
// import Header from "./components/header/Header";

// export const routes = createBrowserRouter([
//   // <Header />,
//   {
//     path: "/",
//     element: (
//       <Unauthenticated>
//         <Home />
//       </Unauthenticated>
//     ),
//   },
//   {
//     path: "/auth/login",
//     element: (
//       <Authenticated>
//         <Login />
//       </Authenticated>
//     ),
//   },
//   {
//     path: "/auth/register",
//     element: (
//       <Authenticated>
//         <Signup />
//       </Authenticated>
//     ),
//   },
//   {
//     path: "/auth/forgot-password",
//     element: (
//       <Authenticated>
//         <ForgotPassword />
//       </Authenticated>
//     ),
//   },
//   {
//     path: "/auth/reset-password",
//     element: (
//       <Authenticated>
//         <ResetPassword />
//       </Authenticated>
//     ),
//   },
//   {
//     path: "/auth/verify-code/:userID",
//     element: (
//       <Authenticated>
//         <VerifyCode />
//       </Authenticated>
//     ),
//   },
//   {
//     path: "*",
//     element: <h1>PAGE DOES NOT EXIST</h1>,
//   },
// ]);
