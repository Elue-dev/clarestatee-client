import {
  MdOutlineDeleteForever,
  MdOutlineRealEstateAgent,
  MdOutlineSubject,
} from "react-icons/md";
import StarRatings from "react-star-ratings";
import StarsRating from "react-star-rate";
import styles from "./rightDetails.module.scss";
import { BsTelephoneForwardFill } from "react-icons/bs";
import { ClipLoader, PulseLoader } from "react-spinners";
import { TiUserAddOutline } from "react-icons/ti";
import { FormEvent, useState } from "react";
import { createReview, removeReview } from "../../services/review_service";
import { useSelector } from "react-redux";
import {
  getUser,
  getUserToken,
  selectIsLoggedIn,
} from "../../redux/slices/auth_slice";
import moment from "moment";
import { errorHotToast } from "../../utils/alerts";
import { useNavigate } from "react-router-dom";
import Notiflix from "notiflix";
import { Link } from "react-router-dom";
import { sendContactEmail } from "../../services/users_services";
import { FiEdit } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";
import { removeProperty } from "../../services/property_service";

export default function RightDetails({ property, refetch }: any) {
  const [revLoading, setRevLoading] = useState(false);
  const [revDelLoading, setRevDelLoading] = useState(false);
  const [delpropLoading, setDelPropLoading] = useState(false);
  const [rating, setRating] = useState<number | undefined>(0);
  const [review, setReview] = useState("");

  const [showInput, setShowInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const token: any = useSelector(getUserToken);
  const currentUser: any = useSelector(getUser);
  const navigate = useNavigate();

  const revUserIDS: string[] = [];

  property.reviews.map((review: any) => {
    revUserIDS.push(review.user._id);
  });

  const addReview = async () => {
    if (!isLoggedIn) {
      errorHotToast("You have to be logged in to add reviews");
      navigate("/auth/login");
      return;
    } else if (!rating) {
      return errorHotToast("Please leave a rating");
    } else if (!review) {
      return errorHotToast("Please add your review");
    } else if (currentUser._id === property.addedBy._id) {
      return errorHotToast("You cannot add reviews to properties you added");
    } else if (revUserIDS.includes(currentUser._id)) {
      return errorHotToast("You cannot add multiple reviews to a property");
    }

    const reviewData = {
      review,
      rating,
    };

    try {
      setRevLoading(true);
      await createReview(reviewData, property._id, token);
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
      setRevDelLoading(true);
      await removeReview(revewID, token);
      refetch();
      setRevDelLoading(false);
    } catch (error) {
      setRevDelLoading(false);
      console.log(error);
    }
  };

  const confirmRevDelete = (revewID: string) => {
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

  const deleteProperty = async (propertyID: string) => {
    try {
      setDelPropLoading(true);
      const response = await removeProperty(propertyID, token);
      if (response) {
        navigate("/");
      }
      setDelPropLoading(false);
    } catch (error) {
      setDelPropLoading(false);
      console.log(error);
    }
  };

  const confirmPropDelete = (propertyID: string) => {
    Notiflix.Confirm.show(
      "Delete Property",
      "Are you sure you want to delete this property?",
      "DELETE",
      "CLOSE",
      function okCb() {
        deleteProperty(propertyID);
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

  const sendEmail = async (e: FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      errorHotToast("Please log in first");
      navigate("/auth/login");
      return;
    }

    if (!subject || !message) {
      return errorHotToast("Both subject and message are required");
    }

    const contactData = { message, subject };
    try {
      setLoading(true);
      await sendContactEmail(token, contactData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div>
      <div className={styles["right__contents"]}>
        <div className={styles["contact__info"]}>
          <div className={styles["contact__info__details"]}>
            {currentUser?._id === property.addedBy._id ||
            currentUser?.role === "admin" ? (
              <div className={styles.actions}>
                <Link
                  to={`/edit-property/${property.slug}/${property._id}`}
                  style={{ fontWeight: 700, color: "#edb637" }}
                >
                  <FiEdit size={20} color="green" />
                </Link>
                <span onClick={() => confirmPropDelete(property._id)}>
                  {delpropLoading ? (
                    <ClipLoader
                      loading={delpropLoading}
                      //@ts-ignore
                      size={20}
                      color="crimson"
                    />
                  ) : (
                    <AiFillDelete size={23} color="crimson" />
                  )}
                </span>
              </div>
            ) : null}

            <h2>
              <MdOutlineRealEstateAgent style={{ color: "#888" }} />
              Contact Agent
            </h2>
            <div className={styles.admin}>
              <p>{property.agentName}</p>
              <div className={styles.contact}>
                <a href={`tel:${property.agentContact}`}>
                  <BsTelephoneForwardFill />
                  &nbsp; Call Agent
                </a>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h3>Need to reach out?</h3>
          <form onSubmit={sendEmail}>
            <label>
              <MdOutlineSubject />
              <input
                type="text"
                name="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject, e.g Enquiry about a property"
                required
              />
            </label>
            <label>
              <textarea
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g I want to book 2 bedroom apartment in Lekki"
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
                classNamePrefix="react-star-rate"
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
                <button disabled>PROCESSING...</button>
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
                          onClick={() => confirmRevDelete(_id)}
                        >
                          {revDelLoading ? (
                            <ClipLoader
                              loading={revDelLoading}
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
            <h3>No reviews for this property.</h3>
          )}
        </div>
        <div className={styles.adder}>
          <div>
            <img
              src={property.addedBy.photo}
              alt={property.addedBy.first_name}
            />
            <p>
              <b>{`${property.addedBy.first_name} ${property.addedBy.last_name}`}</b>{" "}
              added this property {moment(property.createdAt).fromNow()}.
            </p>
          </div>
        </div>
        <p className={styles.disclaimer}>
          DISCLAIMER: We do not own any property here. This site is just a
          personal project to showcase my skills. We are not selling or renting
          any of these properties
        </p>
      </div>
    </div>
  );
}
