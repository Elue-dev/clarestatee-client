import { useState, FormEvent } from "react";
import { BsInstagram, BsLinkedin } from "react-icons/bs";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { IoChatbubbles } from "react-icons/io5";
import { MdOutlineSubject } from "react-icons/md";
import { motion } from "framer-motion";
import { PulseLoader } from "react-spinners";
import styles from "./contact.module.scss";
import { useSelector } from "react-redux";
import { getUserToken, selectIsLoggedIn } from "../../redux/slices/auth_slice";
import { sendContactEmail } from "../../services/users_services";
import { errorHotToast } from "../../utils/alerts";
import { SiGmail } from "react-icons/si";
import { useNavigate } from "react-router-dom";

export default function Contact() {
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const token: any = useSelector(getUserToken);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const navigate = useNavigate();

  const sendEmail = async (e: FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      errorHotToast("Please log in first.");
      navigate("/auth/login");
      return;
    }

    if (!subject || !message) {
      return errorHotToast("Both subject and message are required");
    }

    const contactData = { message, subject };
    try {
      setLoading(true);
      const response = await sendContactEmail(token, contactData);
      if (response) {
        setSubject("");
        setMessage("");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <motion.section
      className={styles.contact}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <div className={styles["contact__hero"]}>
        <div className={styles["head__contact"]}>
          <h2>CONTACT US</h2>
        </div>
      </div>

      <div className={styles.socials}>
        <a href="mailto: eluewisdom@gmail.com">
          <SiGmail className={styles["c_icon"]} />
        </a>
        <a href="https://www.linkedin.com/in/wisdom-elue-8822a5188">
          <BsLinkedin className={styles["c_icon"]} />
        </a>
        <a href="https://www.instagram.com/wisdomelue">
          <BsInstagram className={styles["c_icon"]} />
        </a>
      </div>
      <div className={styles["contact__contents"]}>
        <div className={styles["flex__cards"]}>
          <div className={styles["left__info"]}>
            <div className={styles["phone__contact"]}>
              <FaPhoneSquareAlt className={styles["phone__contact__icon"]} />
              <p>Talk to administrators</p>
              <p>
                If you are interested in our property or have questions, talk to
                us directly
              </p>
              <p>
                <b style={{ fontSize: "1.1rem" }}>Admin Line:</b>
                &nbsp;&nbsp;<a href="tel:2349052014239">Call Admin</a>
              </p>
            </div>
            <br />
            <div className={styles["message__contact"]}>
              <IoChatbubbles className={styles["message__contact__icon"]} />
              <p>Have a private chat</p>
              <p>
                Prefer chats to phone calls? you can also talk to us via chat
              </p>
            </div>
          </div>
          <div className={styles["right__info"]}>
            <p>
              {" "}
              Fill this form with inquiries and get to us. We respond within 24
              hrs.
            </p>
            <form onSubmit={sendEmail}>
              <label>
                <MdOutlineSubject />
                <input
                  type="text"
                  name="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject"
                />
              </label>
              <label>
                <textarea
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  cols={0}
                  rows={3}
                  placeholder="Enter your message"
                ></textarea>
              </label>
              {loading ? (
                <button
                  type="button"
                  disabled
                  className={styles["property__message__btn"]}
                >
                  <PulseLoader loading={loading} size={10} color={"#000"} />
                </button>
              ) : (
                <button
                  type="submit"
                  className={styles["property__message__btn"]}
                >
                  SEND MESSAGE
                </button>
              )}
            </form>
          </div>
        </div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.45932730206!2d3.1438721683089748!3d6.548376809037112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos!5e0!3m2!1sen!2sng!4v1660353745009!5m2!1sen!2sng"
          width="100%"
          height="450"
          style={{ border: 0, paddingTop: "2rem" }}
          //@ts-ignore
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      {/* <Footer /> */}
    </motion.section>
  );
}
