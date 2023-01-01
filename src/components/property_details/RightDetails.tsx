import {
  MdOutlineAlternateEmail,
  MdOutlineDeleteForever,
  MdOutlineRealEstateAgent,
  MdOutlineSubject,
} from "react-icons/md";
import { FaUser } from "react-icons/fa";
import StarRatings from "react-star-ratings";
import StarsRating from "react-star-rate";
import styles from "./rightDetails.module.scss";
import { BsTelephoneForwardFill } from "react-icons/bs";
import { BeatLoader, ClipLoader } from "react-spinners";
import { TiUserAddOutline } from "react-icons/ti";
import { useState } from "react";
import { createReview, removeReview } from "../../services/review_service";
import { useSelector } from "react-redux";
import {
  getUser,
  getUserToken,
  selectIsLoggedIn,
} from "../../redux/slices/auth_slice";
import moment from "moment";
import { errorToast } from "../../utils/alerts";
import { useNavigate } from "react-router-dom";
import Notiflix from "notiflix";

export default function RightDetails({ property, refetch }: any) {
  const [revLoading, setRevLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number | undefined>(0);
  const [review, setReview] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const token: any = useSelector(getUserToken);
  const currentUser: any = useSelector(getUser);
  const navigate = useNavigate();

  const addReview = async () => {
    if (!isLoggedIn) {
      errorToast("You have to be logged in to add reviews", "addreverror");
      navigate("/auth/login");
      return;
    } else if (!review) {
      return errorToast("Please add your review", "addreverror2");
    } else if (!rating) {
      return errorToast("Please leave a rating", "addrateerror");
    }

    const revData = {
      review,
      rating,
    };

    try {
      setRevLoading(true);
      await createReview(revData, property._id, token);
      refetch();
      setReview("");
      setRating(0);
      setRevLoading(false);
      setShowInput(false);
    } catch (error) {
      setRevLoading(false);
      console.log(error);
    }
  };

  const deleteReview = async (revewID: string) => {
    try {
      setDelLoading(true);
      await removeReview(revewID, token);
      refetch();
      setDelLoading(false);
    } catch (error) {
      setDelLoading(false);
      console.log(error);
    }
  };

  const confirmDelete = (revewID: string) => {
    Notiflix.Confirm.show(
      "Delete Review",
      "Are you sure you want to delete your review on this property?",
      "DELETE",
      "CLOSE",
      function okCb() {
        deleteReview(revewID);
      },
      function cancelCb() {},
      {
        width: "320px",
        borderRadius: "5px",
        titleColor: "crimson",
        okButtonBackground: "crimson",
        cssAnimationStyle: "zoom",
      }
    );
  };

  return (
    <div>
      <div className={styles["right__contents"]}>
        <div className={styles["contact__info"]}>
          <div className={styles["contact__info__details"]}>
            <h2>
              <MdOutlineRealEstateAgent style={{ color: "#888" }} />
              Contact Agent
            </h2>
            <div className={styles.admin}>
              <p>{property.agentName}</p>
              <div className={styles.contact}>
                <a href={`tel:${property.agentContact}`}>
                  <BsTelephoneForwardFill />
                  &nbsp; {property.agentContact}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3>Need to reach out?</h3>
          <form>
            <label>
              <FaUser />
              <input
                type="text"
                name="user_name"
                placeholder="Full Name"
                required
              />
            </label>
            <label>
              <MdOutlineAlternateEmail />
              <input
                type="email"
                name="user_email"
                placeholder="Your email"
                required
              />
            </label>
            <label>
              <MdOutlineSubject />
              <input
                type="text"
                name="subject"
                placeholder="Subject, e.g Enquiry about a property"
                required
              />
            </label>
            <label>
              <textarea
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                cols={0}
                rows={6}
                required
              ></textarea>
            </label>
            {loading ? (
              <button
                type="button"
                disabled
                className={styles["property__message__btn"]}
              >
                <BeatLoader loading={loading} size={10} color={"#fff"} />
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
          <p>
            By proceeding, you consent to receive texts at the email you
            provided. We promise not to spam you.
          </p>
        </div>
        <br />
        <div className={styles["rev__wrapper"]}>
          <div className={styles["rev__head"]}>
            <h1>Reviews</h1>
            <span>
              <TiUserAddOutline
                onClick={() => setShowInput(!showInput)}
                color="rgb(18, 140, 200)"
                size={22}
              />
            </span>
          </div>
          {showInput ? (
            <div className={styles["add_rev"]}>
              <StarsRating
                value={rating}
                onChange={(rating) => {
                  setRating(rating);
                }}
              />
              <textarea
                //@ts-ignore
                cols="2"
                //@ts-ignore
                rows="2"
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
              {revLoading ? (
                <button disabled>Processing...</button>
              ) : (
                <button onClick={addReview}>Add review</button>
              )}
            </div>
          ) : null}

          {property.reviews.length > 0 ? (
            property.reviews?.map((customerReview: any, index: number) => {
              const { rating, review, user, createdAt, _id } = customerReview;

              return (
                <div key={_id} className={styles.reviews}>
                  <div className={styles.reviewer}>
                    <img src={user?.photo} alt={user?.first_name} />
                    <div>
                      <b>{`${user?.first_name} ${user?.last_name}`}</b>
                      <br />
                      <span className={styles.desc}>
                        <b>{moment(createdAt).fromNow()}</b>
                      </span>{" "}
                      {currentUser?._id === user._id && (
                        <span
                          className={styles["del__rev"]}
                          onClick={() => confirmDelete(_id)}
                        >
                          {delLoading ? (
                            <ClipLoader
                              loading={delLoading}
                              //@ts-ignore
                              size={12}
                              color="crimson"
                            />
                          ) : (
                            <MdOutlineDeleteForever color="crimson" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <StarRatings
                      rating={rating}
                      starDimension="20px"
                      starRatedColor="gold"
                      starSpacing="0px"
                    />
                    <div className={styles.review}>
                      <span>{review}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <h3>No reviews for this property yet.</h3>
          )}
        </div>
        {/* <SimilarProducts /> */}
      </div>
    </div>
  );
}
