import { useState, useRef, FormEvent, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginType } from "@/types/auth_types";
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlinePassword } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { PulseLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import {
  SAVE_URL,
  selectPreviousURL,
  SET_ACTIVE_USER,
  SET_USER_TOKEN,
} from "../../redux/slices/auth_slice";
import { loginUser } from "../../services/auth_services";
import styles from "./auth.module.scss";

const initialState: loginType = {
  emailOrPhone: "",
  password: "",
};

export default function Login() {
  const [credentials, setCredentials] = useState(initialState);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const passwordRef = useRef<any | undefined>();
  const previousURL = useSelector(selectPreviousURL);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { emailOrPhone, password } = credentials;

  const validateForm = () => {
    if (!emailOrPhone) {
      return setError("Email or Phone Number is required");
    } else if (!password) {
      return setError("Password is required");
    } else {
      setError("");
    }

    return true;
  };

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

  const redirectUser = () => {
    if (previousURL.includes("property")) {
      return navigate(-1);
    } else if (previousURL.includes("contact")) {
      return navigate(-1);
    }
    dispatch(SAVE_URL(""));
    navigate("/");
  };

  const signinUser = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      const loginDetails = {
        emailOrPhone: emailOrPhone.trim(),
        password: password.trim(),
      };
      if (validateForm()) {
        const response = await loginUser(loginDetails);
        if (response) {
          dispatch(SET_ACTIVE_USER(response.user));
          dispatch(SET_USER_TOKEN(response.token));
          redirectUser();
        }
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <section className={styles.auth}>
      <div className={styles["auth__wrapper"]}>
        <div className={styles["left__section"]}>
          <h1>Log Into Your Account</h1>
          {error && (
            <p className={`${styles.alert} ${styles["error__msg"]}`}>{error}</p>
          )}
          <form onSubmit={signinUser}>
            <label>
              <span>Email or Phone Number</span>
              <div className={styles["auth__wrap"]}>
                <HiOutlineMail />
                <input
                  type="text"
                  name="emailOrPhone"
                  value={emailOrPhone}
                  onChange={handleInputChange}
                  placeholder="Enter your email or phone number"
                />
              </div>
            </label>
            <label>
              <span>Password</span>
              <div className={styles["password__field"]}>
                <MdOutlinePassword />
                <input
                  type="password"
                  name="password"
                  value={password}
                  ref={passwordRef}
                  onChange={handleInputChange}
                  placeholder="At least 6 characters"
                />

                <b onClick={handlePasswordVisibility}>
                  {visible ? (
                    <AiOutlineEye size={20} />
                  ) : (
                    <AiOutlineEyeInvisible size={20} />
                  )}
                </b>
              </div>
              <br />
              <p
                onClick={() => navigate("/auth/forgot-password")}
                style={{ cursor: "pointer", textAlign: "right" }}
              >
                Forgot Password?
              </p>
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
              <p>
                Need a Clarestate Account?{" "}
                <Link to="/auth/register">Register</Link>
              </p>
            </div>
          </form>
          <p className={styles.home}>
            <Link to="/"> Home </Link>&nbsp; &nbsp;&copy;{" "}
            {new Date().getFullYear()}. Clarestate Inc.
          </p>
        </div>
        <div className={styles["right__section"]}>
          <span></span>
        </div>
      </div>
    </section>
  );
}
