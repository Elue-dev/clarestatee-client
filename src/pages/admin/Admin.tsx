import { Routes, Route } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import ViewProperties from "./view_properties/ViewProperties";
import AddProperty from "./add_property/AddProperty";
import "./admin.scss";
import EditProduct from "./edit_property/EditProperty";
import Users from "./users/Users";

export default function Admin() {
  return (
    <div className="admin">
      <div className="admin__navbar">
        <Navbar />
      </div>
      <div className="admin__contents">
        <Routes>
          <Route path="view-properties" element={<ViewProperties />} />
          <Route path="add-property" element={<AddProperty />} />
          <Route
            path="edit-property/:propertySlug/:propertyID"
            element={<EditProduct />}
          />
          <Route path="users" element={<Users />} />
        </Routes>
      </div>
    </div>
  );
}
