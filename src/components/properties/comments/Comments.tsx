import { useState, FormEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaCommentMedical, FaUserEdit } from "react-icons/fa";
import { MdOutlineDateRange, MdOutlineDeleteForever } from "react-icons/md";
import { FaRegComment } from "react-icons/fa";
import { BiDotsHorizontal } from "react-icons/bi";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import styles from "./comments.module.scss";
import { useQuery } from "react-query";
import axios from "axios";
import BeatLoader from "react-spinners/BeatLoader";
import { server_url } from "../../../utils/junk";
import {
  getUser,
  getUserToken,
  SAVE_URL,
  selectIsLoggedIn,
} from "../../../redux/slices/auth_slice";
import { errorToast } from "../../../utils/alerts";
import {
  createComment,
  removeComment,
  updateComment,
} from "../../../services/comments_service";
import { ClipLoader, PulseLoader } from "react-spinners";
import Notiflix from "notiflix";
import { TbEdit } from "react-icons/tb";
import moment from "moment";

interface idType {
  propertyID: string;
  slug: string;
}

export default function Comments({ propertyID }: idType) {
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [ID, setID] = useState("");
  const commentRef = useRef<any | undefined>();

  const [loading, setLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const currentUser: any = useSelector(getUser);
  const token: any = useSelector(getUserToken);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  let currCommID: string;

  const fetchComments = async () => {
    return await axios.get(
      `${server_url}/api/properties/${propertyID}/comments`
    );
  };

  const { data, isLoading, refetch } = useQuery("comments", fetchComments, {
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  const comments = data?.data.comments;

  const wrapper = showComments
    ? `${styles["comments__section__details"]}`
    : `${styles["comments__section__details"]} ${styles["reduce__height"]}`;
  const contents = showComments ? null : `${styles.hide}`;

  const hanndleShowComments = () => {
    setShowComments(!showComments);
    setShowCommentForm(false);
  };

  const handleClose = () => {
    setShowCommentForm(false);
  };

  const url = window.location.href;

  const handleCommentForm = () => {
    if (!isLoggedIn) {
      dispatch(SAVE_URL(url));
      navigate("/auth/login");
      setLoading(false);
      setComment("");
      errorToast("You have to be logged in to add comments", "unauthcomm");
    } else {
      setShowCommentForm(true);
    }
  };

  const addComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!comment) {
      return errorToast("Please add your comment", "addcommerror");
    }
    try {
      setLoading(true);
      const response = await createComment(propertyID, { comment }, token);
      if (response) {
        refetch();
        setShowCommentForm(false);
        setComment("");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const deleteComment = async (commentID: string) => {
    try {
      setDelLoading(true);
      await removeComment(commentID, token);
      refetch();
      setDelLoading(false);
    } catch (error) {
      setDelLoading(false);
      console.log(error);
    }
  };

  const confirmDelete = (commentID: string) => {
    Notiflix.Confirm.show(
      "Delete Comment",
      "Are you sure you want to delete your comment on this property?",
      "DELETE",
      "CLOSE",
      function okCb() {
        deleteComment(commentID);
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

  const editComment = async (comment: string, commentID: string) => {
    setID(commentID);

    setShowCommentForm(!showCommentForm);
    setIsEditing(!isEditing);
    window.scrollBy(0, 390);
    setComment(comment);
  };

  const submitUpdatedComment = async () => {
    if (!comment) {
      return errorToast("Please add your comment", "updtcommerror");
    }

    try {
      setEditLoading(true);
      const response = await updateComment(ID, token, { comment });
      if (response) {
        setShowCommentForm(false);
        setIsEditing(false);
        setComment("");
        refetch();
      }
      setEditLoading(false);
    } catch (error) {
      setEditLoading(false);
      console.log(error);
    }
  };

  return (
    <div className={styles["comments__section"]}>
      <div className={wrapper}>
        <h2 onClick={hanndleShowComments}>
          <span>
            <FaRegComment />
            COMMENTS ({comments.length})
          </span>

          <div onClick={hanndleShowComments} className={styles["toggle__icon"]}>
            {showComments ? <BsChevronUp /> : <BsChevronDown />}
          </div>
        </h2>
        {comments.length === 0 ? (
          <>
            <p className={`${styles["toggle__icon"]} ${contents}`}>
              Be the first to add a comment
            </p>
            {!showComments ? (
              <button
                className={`${styles.cb} ${styles["add__comment__btn__none"]} ${contents}`}
                onClick={handleCommentForm}
              >
                Add a comment
              </button>
            ) : null}
          </>
        ) : (
          comments.map((com: any, index: number) => {
            const { comment, user, createdAt, _id, updatedAt } = com;
            return (
              //@ts-ignore
              <ul key={index} className={contents}>
                <li>
                  <p>{comment}</p>
                  <br />
                  <div className={styles["comment__name"]}>
                    <FaUserEdit /> {`${user.first_name} ${user.last_name}`}
                  </div>
                  <div className={styles["comment__date"]}>
                    {currentUser?._id === user._id ? (
                      <>
                        <MdOutlineDateRange />
                        Added by you: {moment(createdAt).fromNow()}
                      </>
                    ) : (
                      <>
                        <MdOutlineDateRange />
                        {moment(createdAt).fromNow()}
                      </>
                    )}
                  </div>
                </li>
                <div className={styles["del__comm"]}>
                  {currentUser?._id === user._id && (
                    <>
                      <span
                        className={styles["del__rev"]}
                        onClick={() => editComment(comment, _id)}
                      >
                        <TbEdit color="green" size="20px" />
                      </span>
                      <span
                        className={styles["del__rev"]}
                        onClick={() => confirmDelete(_id)}
                      >
                        {delLoading ? (
                          <ClipLoader
                            loading={delLoading}
                            //@ts-ignore
                            size={20}
                            className={styles.FadeLoader}
                            color="crimson"
                          />
                        ) : (
                          <MdOutlineDeleteForever color="crimson" size="20px" />
                        )}
                      </span>
                    </>
                  )}
                </div>
              </ul>
            );
          })
        )}
        {showComments && (
          <button
            className={`${styles.cb} ${styles["add__comment__btn"]}`}
            onClick={handleCommentForm}
          >
            Add a comment
          </button>
        )}

        <form
          onSubmit={addComment}
          //@ts-ignore
          style={{ display: showCommentForm ? null : "none" }}
        >
          <h2>
            <FaCommentMedical />
            Add a comment
          </h2>

          <label>
            <span>Your comment</span>
          </label>
          <textarea
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your Comment"
            ref={commentRef}
            //@ts-ignore
            cols=""
            //@ts-ignore
            rows="8"
          />
          {loading ? (
            <button
              type="submit"
              className={styles["submit__comment__btn"]}
              disabled
            >
              <PulseLoader loading={loading} size={10} color={"#000"} />
            </button>
          ) : (
            <>
              {isEditing ? (
                <>
                  {editLoading ? (
                    <p
                      className={styles["submit__comment__btn"]}
                      style={{ display: "inline" }}
                    >
                      <PulseLoader
                        loading={editLoading}
                        size={10}
                        color={"#000"}
                      />
                    </p>
                  ) : (
                    <p
                      onClick={submitUpdatedComment}
                      className={styles["submit__comment__btn"]}
                      style={{ display: "inline" }}
                    >
                      Edit comment
                    </p>
                  )}
                </>
              ) : (
                <button
                  type="submit"
                  className={styles["submit__comment__btn"]}
                >
                  Submit comment
                </button>
              )}
            </>
          )}

          <button
            onClick={handleClose}
            type="button"
            className={styles["close__comment__btn"]}
          >
            Close comment
          </button>
        </form>
      </div>
    </div>
  );
}
