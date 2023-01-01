import { useState, useRef, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlinePassword } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { PulseLoader } from "react-spinners";
import styles from "./auth.module.scss";
import { restorePassword } from "../../services/auth_services";
import { useParams } from "react-router-dom";

const initialState = {
  newPassword: "",
  confirmNewPassword: "",
};

export default function ResetPassword() {
  const [credentials, setCredentials] = useState(initialState);
  const [visible, setVisible] = useState(false);
  const [visible_sec, setVisible_Sec] = useState(false);
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<any | undefined>();
  const confirmPasswordRef = useRef<any | undefined>();
  const { token } = useParams();
  const navigate = useNavigate();

  const { newPassword, confirmNewPassword } = credentials;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handlePasswordVisibility = (): void => {
    setVisible(!visible);
    if (passwordRef.current.type === "password") {
      passwordRef.current.setAttribute("type", "text");
    } else {
      passwordRef.current.setAttribute("type", "password");
    }
  };

  const handleConfirmPasswordVisibility = (): void => {
    setVisible_Sec(!visible_sec);
    if (confirmPasswordRef.current.type === "password") {
      confirmPasswordRef.current.setAttribute("type", "text");
    } else {
      confirmPasswordRef.current.setAttribute("type", "password");
    }
  };

  const resetPassword = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await restorePassword(credentials, token);
      if (response) {
        navigate("/auth/login");
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
          <h1>LET'S GET YOU BACK</h1>
          <form onSubmit={resetPassword}>
            <label>
              <span>New Password</span>
              <div className={styles["password__field"]}>
                <MdOutlinePassword />
                <input
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  ref={passwordRef}
                  onChange={handleInputChange}
                  placeholder="Enter your email or phone number"
                />

                <b onClick={handlePasswordVisibility}>
                  {visible ? (
                    <AiOutlineEye size={20} />
                  ) : (
                    <AiOutlineEyeInvisible size={20} />
                  )}
                </b>
              </div>
            </label>
            <label>
              <span>Confirm New Password</span>
              <div className={styles["password__field"]}>
                <MdOutlinePassword />
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={confirmNewPassword}
                  ref={confirmPasswordRef}
                  onChange={handleInputChange}
                  placeholder="At least 6 characters"
                />

                <b onClick={handleConfirmPasswordVisibility}>
                  {visible_sec ? (
                    <AiOutlineEye size={20} />
                  ) : (
                    <AiOutlineEyeInvisible size={20} />
                  )}
                </b>
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
