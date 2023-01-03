import { Link } from "react-router-dom";
import styles from "./errorPage.module.scss";

export default function ErrorPage() {
  return (
    <div className={styles.error}>
      <div className={styles.content}>
        <h1>Oops!</h1>
        <h2>We couldn't find the page you are looking for</h2>
        <p>But here are some useful links instead:</p>
        <ul>
          <li>
            <Link to="/">
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link to="/all-properties">
              <a>All Properties</a>
            </Link>
          </li>
          <li>
            <Link to="/user/dashboard">
              <a>Dashboard</a>
            </Link>
          </li>
          <li>
            <Link to="/contact">
              <a>Contact Us</a>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
