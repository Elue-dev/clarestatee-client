import { useState, useRef, FormEvent, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerType } from "@/types/auth_types";
import { TiUserOutline } from "react-icons/ti";
import { HiOutlineMail } from "react-icons/hi";
import { TbPhone } from "react-icons/tb";
import { MdOutlinePassword } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "./auth.module.scss";
import { PulseLoader } from "react-spinners";
import { registerUser, validateEmail } from "../../services/auth_services";

const initialState: registerType = {
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  password: "",
};

export default function Signup() {
  const [credentials, setCredentials] = useState(initialState);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const passwordRef = useRef<any | undefined>();

  const { first_name, last_name, phone, email, password } = credentials;

  const validateForm = () => {
    if (!first_name) {
      setError("First Name is required");
      setTimeout(() => setError(""), 4000);
      return;
    } else if (!last_name) {
      setError("Last Name is required");
      setTimeout(() => setError(""), 4000);
      return;
    } else if (!phone || !/^\d+$/.test(phone)) {
      setError("Phonne Number is required and must be numbers");
      setTimeout(() => setError(""), 4000);
      return;
    } else if (!email) {
      setError("Email Address is required");
      setTimeout(() => setError(""), 4000);
      return;
    } else if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setTimeout(() => setError(""), 4000);
      return;
    } else if (!password) {
      setError("Password is required");
      setTimeout(() => setError(""), 4000);
      return;
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

  const addUser = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      if (validateForm()) {
        const user = await registerUser(credentials);
        if (user) {
          navigate(`/auth/verify-code/${user.userID}`);
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
          <h1>Create An Account</h1>
          {error && (
            <p className={`${styles.alert} ${styles["error__msg"]}`}>{error}</p>
          )}
          <form onSubmit={addUser}>
            <label>
              <span>First Name</span>
              <div className={styles["auth__wrap"]}>
                <TiUserOutline />
                <input
                  type="text"
                  name="first_name"
                  value={first_name}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                />
              </div>
            </label>
            <label>
              <span>Last Name</span>
              <div className={styles["auth__wrap"]}>
                <TiUserOutline />
                <input
                  type="text"
                  name="last_name"
                  value={last_name}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                />
              </div>
            </label>
            <label>
              <span>Phone Number</span>
              <div className={styles["auth__wrap"]}>
                <TbPhone />
                <input
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              </div>
            </label>
            <label>
              <span>Email Address</span>
              <div className={styles["auth__wrap"]}>
                <HiOutlineMail />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                  placeholder="Enter your valid email"
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

                <b
                  onClick={handlePasswordVisibility}
                  style={{ cursor: "pointer" }}
                >
                  {visible ? (
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
            <div className={styles["auth__redirect"]}>
              <p>
                Own a Clarestate Account? <Link to="/auth/login">Login</Link>
              </p>
            </div>
          </form>
        </div>
        <div className={styles["right__section"]}>
          <h1></h1>
        </div>
      </div>
    </section>
  );
}
