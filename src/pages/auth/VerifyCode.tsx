import {
  sendVerificationCode,
  verifyEmail,
} from "../../services/auth_services";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import styles from "./auth.module.scss";
import { useDispatch } from "react-redux";
import { SET_ACTIVE_USER, SET_USER_TOKEN } from "../../redux/slices/auth_slice";
import { HiOutlineMail } from "react-icons/hi";
import { protectVerify } from "../../utils/junk";

export default function VerifyCode() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading_sec, setLoading_sec] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const { userID } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    protectVerify(userID);
  }, []);

  const handleChange = (element: any, index: number) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const clearField = () => {
    setError("");
    setOtp([...otp.map((v) => "")]);
  };

  const verifyCode = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const code = otp.join("");

    if (code.length === 0) {
      return setError("Please enter your verification code");
    } else if (code.length < 6) {
      return setError("You verification code should be 6 digits");
    } else {
      setError("");
    }

    setLoading(true);
    const response = await verifyEmail(code, userID);
    if (response) {
      console.log(response);
      setOtp([...otp.map((v) => "")]);
      dispatch(SET_ACTIVE_USER(response.user));
      dispatch(SET_USER_TOKEN(response.token));
      navigate("/");
      console.log(loading);
    }
    setLoading(false);
  };

  const resendCode = async () => {
    setEmailError(false);

    if (!email) {
      return setEmailError(true);
    } else {
      setEmailError(false);
    }

    try {
      setLoading_sec(true);
      const response = await sendVerificationCode(email);
      if (response) {
        setShowInput(false);
      }
      setLoading_sec(false);
    } catch (error) {
      setLoading_sec(false);
    }

    setLoading_sec(true);
    const response = await sendVerificationCode(email);
    if (response) {
      setShowInput(false);
    }
    setLoading_sec(false);
  };

  return (
    <section className={styles.auth}>
      <div className={styles["auth__wrapper"]}>
        <div className={styles["left__section"]}>
          <h1>Verify Your Email</h1>
          <form onSubmit={verifyCode}>
            <p>Please enter the verification code sent to your email</p>
            <br />
            {error && (
              <p className={`${styles.alert} ${styles["error__msg"]}`}>
                {error}
              </p>
            )}
            <div className={styles["otp__wrapper"]}>
              {otp.map((data, index) => {
                return (
                  <input
                    className={styles["otp__field"]}
                    type="text"
                    name="otp"
                    //@ts-ignore
                    maxLength="1"
                    key={index}
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onFocus={(e) => e.target.select()}
                  />
                );
              })}
            </div>

            {otp.join("").length > 0 && (
              <p className={styles.clear} onClick={clearField}>
                Clear All
              </p>
            )}

            {loading && (
              <button type="button" disabled className={styles["submit__btn"]}>
                <PulseLoader loading={loading} size={10} color={"#000"} />
              </button>
            )}
            {!loading && (
              <button type="submit" className={styles["submit__btn"]}>
                Verify
              </button>
            )}
          </form>
          <br />
          <p onClick={() => setShowInput(!showInput)}>
            Didn't get a code? <b className={styles.resend}>Resend Code</b>
          </p>
          <br />
          <form
            style={{
              position: "relative",
              transition: "left .3s ease",
              left: showInput ? 0 : "-35rem",
            }}
          >
            <label className={styles["resend__label"]}>
              <div
                className={styles["auth__wrap"]}
                style={{
                  border: emailError ? "2px solid red" : "",
                }}
              >
                <HiOutlineMail />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailError(false)}
                  placeholder="Enter your valid email"
                />
              </div>
            </label>

            {loading_sec && (
              <button
                type="button"
                disabled
                className={`${styles["submit__btn"]} ${styles["resend__btn"]}`}
              >
                Processing...
              </button>
            )}
            {!loading_sec && (
              <button
                type="button"
                onClick={resendCode}
                className={`${styles["submit__btn"]} ${styles["resend__btn"]}`}
              >
                Proceed
              </button>
            )}
          </form>
        </div>
        <div className={styles["right__section"]}>
          <span></span>
        </div>
      </div>
    </section>
  );
}
