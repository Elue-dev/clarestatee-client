import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineMail } from "react-icons/hi";
import styles from "./auth.module.scss";
import { PulseLoader } from "react-spinners";
import { forgotPassword } from "../../services/auth_services";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const sendResetEmail = async (e: FormEvent) => {
    e.preventDefault();

    if (!email) {
      return setError("Please enter your email address");
    }

    try {
      setLoading(true);
      await forgotPassword(email);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <section className={styles.auth}>
      <div className={styles["auth__wrapper"]}>
        <div className={styles["left__section"]}>
          <h1>Let's get you back!</h1>
          <form onSubmit={sendResetEmail}>
            <p className={styles.info}>
              Ensure to check your spam folder. It may end up there.
            </p>
            <br />
            {error && (
              <p className={`${styles.alert} ${styles["error__msg"]}`}>
                {error}
              </p>
            )}
            <label>
              <span>Email </span>
              <div className={styles["auth__wrap"]}>
                <HiOutlineMail />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                />
              </div>
            </label>
            {loading && (
              <button type="button" disabled className={styles["submit__btn"]}>
                <PulseLoader loading={loading} size={10} color={"#000"} />
              </button>
            )}
            {!loading && (
              <button type="submit" className={styles["submit__btn"]}>
                Continue
              </button>
            )}
            <div className={styles["auth__redirect"]}>
              <p
                onClick={() => navigate("/auth/login")}
                style={{ cursor: "pointer" }}
              >
                Back to Login
              </p>
            </div>
          </form>
        </div>
        <div className={styles["right__section"]}>
          <span></span>
        </div>
      </div>
    </section>
  );
}
