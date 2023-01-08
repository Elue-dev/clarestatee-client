import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import styles from "./auth.module.scss";
import { emergencyReset } from "../../services/auth_services";
import { HiOutlineMail } from "react-icons/hi";
import { useParams } from "react-router-dom";
import { errorHotToast } from "../../utils/alerts";

export default function EmergencyReset() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { userID } = useParams();
  const navigate = useNavigate();

  const resetPassword = async (e: FormEvent) => {
    e.preventDefault();

    if (!email) {
      return errorHotToast("Please enter your email");
    }

    try {
      setLoading(true);
      const response = await emergencyReset(userID, email);
      if (response) {
        navigate("/");
      }
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
          <h1>Reset your password</h1>
          <form onSubmit={resetPassword}>
            <label>
              <span>Email Address</span>
              <div className={styles["auth__wrap"]}>
                <HiOutlineMail />
                <input
                  type="text"
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
            <br />
            <br />
            <p
              onClick={() => navigate("/auth/login")}
              style={{
                cursor: "pointer",
                textAlign: "center",
                fontWeight: 700,
              }}
            >
              Back to Login
            </p>
          </form>
        </div>
        <div className={styles["right__section"]}>
          <span></span>
        </div>
      </div>
    </section>
  );
}
