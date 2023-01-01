import React, { useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { BsBookmarkPlus, BsInfoCircle, BsInfoLg } from "react-icons/bs";
import { AiOutlineCalendar, AiFillTags } from "react-icons/ai";
import { IoLocation } from "react-icons/io5";
import { TbListDetails } from "react-icons/tb";
import { AiFillCheckCircle } from "react-icons/ai";
import { MdBookmarkAdd } from "react-icons/md";
import { BiChevronsRight } from "react-icons/bi";
import { MdSwipe } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { motion } from "framer-motion";
import styles from "./propertyDetails.module.scss";
// import GoBack from "../utilities/GoBack";
// import Footer from "../footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { BeatLoader, ClipLoader } from "react-spinners";
import ReactWhatsapp from "react-whatsapp";
// import { SAVE_URL } from "../../redux/slice/authSlice";
import moment from "moment";
import { useQuery } from "react-query";
import axios from "axios";
import { server_url } from "../../../utils/junk";
import Comments from "../../../components/properties/comments/Comments";
import Loader from "../../../utils/Loader";
import RightDetails from "../../../components/property_details/RightDetails";

export default function PropertyDetail() {
  const { slug } = useParams();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const form = useRef();

  //   const [copied, setCopied] = useState(false);
  const [fixPropName, setFixPropName] = useState(false);

  const dispatch = useDispatch();

  //   useEffect(() => {
  //     setMessage(
  //       `I am interested in ${property?.name} with Reference ID of ${
  //         property?.id
  //       }, which goes for NGN${formatCurrency(property?.price)}/night...`
  //     );
  //   }, [property?.name, property?.id, property?.price, formatCurrency]);

  //   useEffect(() => {
  //     if (copied) {
  //       setAlert("Reference ID copied to clipboard");
  //       window.setTimeout(() => {
  //         setAlert("");
  //       }, 4000);
  //     }
  //   }, [copied]);

  const url = window.location.href;

  const fetchProperties = async () => {
    return await axios.get(`${server_url}/api/properties/${slug}`);
  };

  const { data, isLoading, refetch } = useQuery("properties", fetchProperties, {
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <Loader />;
  }

  const property = data?.data.property;

  if (!property) {
    return <Loader />;
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <div className={styles["popup"]}></div>
      <section className={styles["property__details"]}>
        {/* <GoBack /> */}
        <div className={styles["contacts__bottom__wrapper"]}>
          <div className={styles["contacts__bottom"]}>
            <div className={styles["single__item"]}></div>
            <div className={styles["single__item"]}></div>
          </div>
        </div>

        <p className={styles["details__links"]}>
          <Link to="/">Home</Link>
          <BiChevronsRight /> <span>{property?.name}</span>
        </p>

        <div className={styles["property__details__contents"]}>
          <div className={styles["left__contents"]}>
            <div className={styles["property__details__images"]}>
              {property?.images.map((image: string, index: number) => (
                <div key={index}>
                  <p className={styles["image__length"]}>
                    {property.images.indexOf(image) + 1} /{" "}
                    {property.images.length}{" "}
                  </p>
                  <img src={image} alt={property.name} />
                </div>
              ))}
            </div>
            <h3 style={{ cursor: "pointer", fontSize: ".9rem" }}>
              <MdSwipe />
              &nbsp; <b>Swipe to see all {property.images.length} images</b>
            </h3>
            <div
              className={
                fixPropName
                  ? `${styles["left__contents__card"]} ${styles.fix}`
                  : `${styles["left__contents__card"]}`
              }
            >
              <div className={styles["card__name"]}>
                {property && <h2>{property.name}</h2>}
                <p className={styles["property__location"]}>
                  <IoLocation />
                  {property.location}
                </p>
              </div>
              <h3>NGN{new Intl.NumberFormat().format(property.price)}/night</h3>
            </div>
            <div className={styles["other__details"]}>
              <p className={styles["availability__texts"]}>
                <MdBookmarkAdd />
                <b>Availability status:</b>
                <span
                  style={{
                    color:
                      property.availability === "Available"
                        ? `${styles.green}`
                        : `${styles.crimson}`,
                  }}
                >
                  {property.availability}
                </span>
              </p>
              <p>
                <AiOutlineCalendar />
                <b>Date Added:</b> {new Date(property.createdAt).toDateString()}
              </p>

              <p>
                <FaRegEdit />
                <b>Last Updated:</b> {moment(property.updatedAt).fromNow()}
              </p>

              <span>
                <AiFillTags />
                <b>Ref. ID:</b> {property._id}
              </span>
              {alert && (
                <p
                  className="alert message"
                  style={{ width: "fit-content", height: "1.6rem" }}
                >
                  {alert}
                </p>
              )}
              {/* <CopyToClipboard text={id} onCopy={() => setCopied(true)}>
                <button className="copy__btn">
                  Copy Reference ID to clipboard
                </button>
              </CopyToClipboard> */}
              {property.availability === "Not Available" && (
                <p className={styles["details__warning"]}>
                  <BsInfoCircle />
                  Properties like this that are unavilable can be available at
                  later dates, ensure to keep checking.
                </p>
              )}
            </div>

            <div className={styles["property__features"]}>
              <h2>Features</h2>
              <div className={styles["flex__features"]}>
                {property.features.map((feature: string, index: number) => (
                  <ul key={index}>
                    <li>
                      <AiFillCheckCircle />
                      {feature}.
                    </li>
                  </ul>
                ))}
              </div>
            </div>
            <div className={styles["property__description"]}>
              <h2>
                <TbListDetails />
                Description
              </h2>
              <p>{property.description}</p>
            </div>

            <Comments propertyID={property._id} slug={property.slug} />
          </div>
          <RightDetails property={property} refetch={refetch} />
        </div>
        {/* <Footer /> */}
      </section>
    </motion.section>
  );
}
