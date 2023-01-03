import { FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { FiUsers } from "react-icons/fi";
import { SiHomeadvisor } from "react-icons/si";
import { MdAddBusiness } from "react-icons/md";
import { getUser } from "../../../redux/slices/auth_slice";
import "./navbar.scss";

export default function Navbar() {
  const user: any = useSelector(getUser);
  return (
    <div className="admin__nav">
      <div className="admin__user">
        {user?.photo ? (
          <img
            src={user.photo}
            alt={user.displayName}
            className="admin__user__photo"
          />
        ) : (
          <FaUserCircle size={40} color="#fff" />
        )}

        <h3>{`${user.first_name} ${user.last_name}`}</h3>
        <p>
          <b>ADMINISTRATOR</b>
        </p>
      </div>
      <nav>
        <ul>
          <li>
            <NavLink to="/admin/view-properties">
              <SiHomeadvisor />
              View Properties
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/add-property">
              <MdAddBusiness />
              Add Property
            </NavLink>
          </li>
          <li style={{ display: "none" }}>
            <NavLink to="/admin/edit-property">
              <MdAddBusiness />
              Edit Property
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/users">
              <FiUsers />
              Users
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
