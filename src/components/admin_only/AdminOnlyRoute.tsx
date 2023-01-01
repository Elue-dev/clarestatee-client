import { getUser } from "../../redux/slices/auth_slice";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./adminOnlyRoute.scss";

const admin_email = import.meta.env.VITE_REACT_APP_ADMIN_EMAIL;

export default function AdminOnlyRoute({ children }: any) {
  const user: any = useSelector(getUser);

  const userEmail = user.email;

  if (userEmail === admin_email || userEmail === admin_email) {
    return children;
  } else {
    return (
      <section style={{ minHeight: "80vh" }} className="admin__only">
        <div className="container">
          <h2>PERMISSION DENIED</h2>
          <p>This page can only be viewed by an admin.</p>
          <br />
          <Link to="/">
            <button className="--btn --btn-primary">&larr; Back to Home</button>
          </Link>
        </div>
      </section>
    );
  }
}

export function AdminOnlyLink({ children }: any) {
  const user: any = useSelector(getUser);

  const userEmail = user.email;

  if (userEmail === admin_email) {
    return children;
  } else {
    return null;
  }
}
