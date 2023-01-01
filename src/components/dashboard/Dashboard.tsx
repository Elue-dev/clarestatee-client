import {
  getUser,
  getUserToken,
  REMOVE_ACTIVE_USER,
  SET_ACTIVE_USER,
} from "../../redux/slices/auth_slice";
import { useDispatch, useSelector } from "react-redux";
import styles from "./dashboard.module.scss";
import { useState, ChangeEvent, FormEvent } from "react";
import { MdAddAPhoto, MdOutlinePassword } from "react-icons/md";
import { TiUserOutline } from "react-icons/ti";
import { TbPhone } from "react-icons/tb";
import { HiOutlineMail } from "react-icons/hi";
import { RiFolderUserLine } from "react-icons/ri";
import { server_url, updateUser } from "../../services/users_services";
import { FadeLoader } from "react-spinners";
import axios from "axios";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye } from "react-icons/ai";
import Loader from "../../utils/Loader";
import { motion } from "framer-motion";
import { updatePassword } from "../../services/auth_services";
import { errorToast } from "../../utils/alerts";

const passwordStates = {
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

export default function Dashboard() {
  const user: any = useSelector(getUser);
  const token: any = useSelector(getUserToken);
  const { first_name, last_name, photo, isVerified, email, phone, bio, _id } =
    user;
  const [credentials, setCredentials] = useState({
    fName: first_name,
    lName: last_name,
    uEmail: email,
    uPhone: phone,
    uBio: bio,
  });
  const [passwords, setPasswords] = useState(passwordStates);
  const [imagePreview, setImagePreview] = useState(null);
  const [userPhoto, setUserPhoto] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loading_sec, setLoading_Sec] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { fName, lName, uPhone, uEmail, uBio } = credentials;
  const { oldPassword, newPassword, confirmNewPassword } = passwords;

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handlePasswordsChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    setUserPhoto(file);
    //@ts-ignore
    setImagePreview(URL.createObjectURL(file));
  };

  const updateAccount = async (e: FormEvent) => {
    e.preventDefault();

    let imageUrl;
    if (userPhoto && userPhoto?.type.includes("image")) {
      const image = new FormData();
      image.append("file", userPhoto);
      image.append("cloud_name", "dwdsjbetu");
      image.append("upload_preset", "oj28w9l5");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dwdsjbetu/image/upload",
        { method: "post", body: image }
      );
      const imageData = await response.json();
      imageUrl = imageData.url.toString();
    }

    const userData = {
      _id,
      first_name: fName,
      last_name: lName,
      phone: uPhone,
      email: uEmail,
      bio: uBio,
      //@ts-ignore
      photo: userPhoto ? imageUrl : photo,
    };

    try {
      setLoading(true);
      const response = await updateUser(_id, token, userData);
      if (response) {
        dispatch(SET_ACTIVE_USER(userData));
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const changePassword = async (e: FormEvent) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return errorToast(
        "Please provide all three password credentials",
        "uperror"
      );
    }

    try {
      setLoading_Sec(true);
      const response = await updatePassword(token, passwords);
      if (response) {
        dispatch(REMOVE_ACTIVE_USER());
        navigate("/auth/login");
      }
      setLoading_Sec(false);
    } catch (error) {
      setLoading_Sec(false);
    }
  };

  const fetchUserProperties = async () => {
    return await axios.get(`${server_url}/api/users/my-properties`, {
      headers: { authorization: `Bearer ${token}` },
    });
  };

  const { data, isLoading, refetch } = useQuery(
    "properties",
    fetchUserProperties,
    {
      refetchOnWindowFocus: false,
    }
  );

  const properties = data?.data.properties;

  if (isLoading || !properties) {
    return (
      <h1>
        <Loader />
      </h1>
    );
  }

  return (
    <motion.section
      className={styles.dashboard}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <div className={styles["dashboard__wrapper"]}>
        <div className={styles["left__dashboard"]}>
          <div className={styles["user__det"]}>
            <div>
              {!imagePreview ? (
                <>
                  <img src={photo} alt={first_name} />
                  <label
                    htmlFor="photo"
                    className={`${styles["form__label"]} ${styles["photo__label"]}`}
                  >
                    <MdAddAPhoto />
                  </label>
                </>
              ) : (
                <>
                  <img src={imagePreview} alt="new photo" />
                  <label
                    htmlFor="photo"
                    className={`${styles["form__label"]} ${styles["photo__label"]}`}
                  >
                    <MdAddAPhoto />
                  </label>
                </>
              )}

              <input
                type="file"
                onChange={(e) => handleImageChange(e)}
                accept="image/*"
                className={styles["form__upload"]}
                name="photo"
                id="photo"
              />
            </div>
          </div>
          <h2>{`${first_name} ${last_name}`}</h2>
          <form onSubmit={updateAccount}>
            <div className={styles.fields}>
              <label>
                <span>First Name</span>
                <div className={styles["auth__wrap"]}>
                  <TiUserOutline />
                  <input
                    type="text"
                    name="fName"
                    value={fName}
                    onChange={handleInputChange}
                  />
                </div>
              </label>
              <label>
                <span>Last Name</span>
                <div className={styles["auth__wrap"]}>
                  <TiUserOutline />
                  <input
                    type="text"
                    name="lName"
                    value={lName}
                    onChange={handleInputChange}
                  />
                </div>
              </label>
              <label>
                <span>Phone Number</span>
                <div className={styles["auth__wrap"]}>
                  <TbPhone />
                  <input
                    type="tel"
                    name="uPhone"
                    value={uPhone}
                    onChange={handleInputChange}
                  />
                </div>
              </label>
              <label>
                <span>Email Address</span>
                <div className={styles["auth__wrap"]}>
                  <HiOutlineMail />
                  <input
                    type="email"
                    name="uEmail"
                    value={uEmail}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
              </label>
              <label>
                <span>Bio</span>
                <div className={styles["auth__wrap"]}>
                  <RiFolderUserLine />
                  <textarea
                    name="uBio"
                    value={uBio}
                    onChange={handleInputChange}
                  />
                </div>
              </label>
            </div>
            {loading ? (
              <button type="button" className={styles["submit__btn"]}>
                Updating...
              </button>
            ) : (
              <button type="submit" className={styles["submit__btn"]}>
                Update Credentials
              </button>
            )}
          </form>
        </div>
        <div className={styles["right__dashboard"]}>
          <h1>Properties you added</h1>
          {isLoading ? (
            <h2 className={styles["no__results"]}>
              <FadeLoader
                loading={loading}
                //@ts-ignore
                size={10}
                speedMultiplie={3}
                color="rgb(18, 140, 200)"
              />
            </h2>
          ) : (
            <>
              {properties.length === 0 ? (
                <h3>You have not added any properties yet</h3>
              ) : (
                <div className={styles["users__prop"]}>
                  <h3>
                    You have added {properties.length}{" "}
                    {properties.length === 1 ? "property" : "properties"} to
                    Clarestate.
                  </h3>
                  {properties.map((property: any) => {
                    const { name, price, slug, purpose } = property;
                    return (
                      <div className={styles.card}>
                        <div>
                          <b>Property Name:</b>
                          &nbsp;{name}
                        </div>
                        <div>
                          <b>Property Price:</b>
                          &nbsp;NGN {new Intl.NumberFormat().format(price)}
                        </div>
                        <div
                          className={
                            purpose === "Sale"
                              ? `${styles.sale} ${styles.purpose}`
                              : purpose === "Rent"
                              ? `${styles.rent}  ${styles.purpose}`
                              : `${styles.shortlet}  ${styles.purpose}`
                          }
                        >
                          <span> For {purpose}</span>
                        </div>
                        <Link to={`/property/${slug}`}>
                          <span className={styles.details}>
                            <AiOutlineEye />
                          </span>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
              <form onSubmit={changePassword}>
                <h2>Password Update</h2>
                <div className={styles.fields}>
                  <label>
                    <span>Old Password</span>
                    <div className={styles["auth__wrap"]}>
                      <MdOutlinePassword />
                      <input
                        type="password"
                        name="oldPassword"
                        value={oldPassword}
                        onChange={handlePasswordsChange}
                      />
                    </div>
                  </label>
                  <label>
                    <span> New Password</span>
                    <div className={styles["auth__wrap"]}>
                      <MdOutlinePassword />
                      <input
                        type="password"
                        name="newPassword"
                        value={newPassword}
                        onChange={handlePasswordsChange}
                      />
                    </div>
                  </label>
                  <label>
                    <span>Confirm New Password</span>
                    <div className={styles["auth__wrap"]}>
                      <MdOutlinePassword />
                      <input
                        type="password"
                        name="confirmNewPassword"
                        value={confirmNewPassword}
                        onChange={handlePasswordsChange}
                      />
                    </div>
                  </label>
                </div>
                {loading_sec ? (
                  <button type="button" className={styles["submit__btn2"]}>
                    Updating...
                  </button>
                ) : (
                  <button type="submit" className={styles["submit__btn2"]}>
                    Update Password
                  </button>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </motion.section>
  );
}
