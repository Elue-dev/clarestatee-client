import Authenticated from "../components/protect_routes/authenticated";
import Signup from "../pages/auth/Signup";
import Login from "../pages/auth/Login";
import Home from "../pages/home/Home";
import { Routes, Route } from "react-router-dom";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import VerifyCode from "../pages/auth/VerifyCode";
import EmergencyReset from "../pages/auth/EmergencyReset";
import Unauthenticated from "../components/protect_routes/unauthenticated";
import PropertyDetail from "../pages/properties/property_details/PropertyDetails";
import QueriedProperty from "../pages/properties/queried_properties/QueriedProperty";
import Dashboard from "../components/dashboard/Dashboard";
import Contact from "../pages/contact/Contact";
import AllProperties from "../pages/all_properties/AllProperties";
import AdminOnlyRoute from "../components/admin_only/AdminOnlyRoute";
import Admin from "../pages/admin/Admin";
import AddProperty from "../pages/admin/add_property/AddProperty";
import UserEditProperty from "../pages/edit_property_user/UserEditProperty";
import ErrorPage from "../pages/error_page/Errorpage";

export default function AllRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/property/:slug" element={<PropertyDetail />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/all-properties" element={<AllProperties />} />
      <Route
        path="/add-property"
        element={
          <Unauthenticated>
            <AddProperty />
          </Unauthenticated>
        }
      />
      <Route
        path="/edit-property/:propertySlug/:propertyID"
        element={
          <Unauthenticated>
            <UserEditProperty />
          </Unauthenticated>
        }
      />
      <Route
        path="/admin/*"
        element={
          <AdminOnlyRoute>
            <Admin />
          </AdminOnlyRoute>
        }
      />
      <Route
        path="/user/dashboard"
        element={
          <Unauthenticated>
            <Dashboard />
          </Unauthenticated>
        }
      />
      <Route
        path="/auth/login"
        element={
          <Authenticated>
            <Login />
          </Authenticated>
        }
      />
      <Route
        path="/auth/register"
        element={
          <Authenticated>
            <Signup />
          </Authenticated>
        }
      />
      <Route
        path="/auth/forgot-password"
        element={
          <Authenticated>
            <ForgotPassword />
          </Authenticated>
        }
      />
      <Route
        path="/auth/reset-password/:token"
        element={
          <Authenticated>
            <ResetPassword />
          </Authenticated>
        }
      />
      <Route
        path="/auth/emergency-reset/:userID"
        element={
          <Authenticated>
            <EmergencyReset />
          </Authenticated>
        }
      />
      <Route
        path="/auth/verify-code/:userID"
        element={
          <Authenticated>
            <VerifyCode />
          </Authenticated>
        }
      />

      <Route path="/property_search" element={<QueriedProperty />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}
