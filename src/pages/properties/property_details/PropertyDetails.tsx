import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BsInfoCircle } from "react-icons/bs";
import { AiOutlineCalendar } from "react-icons/ai";
import { IoLocation } from "react-icons/io5";
import { AiFillCheckCircle } from "react-icons/ai";
import { MdBookmarkAdd } from "react-icons/md";
import { BiChevronsRight } from "react-icons/bi";
import { MdSwipe } from "react-icons/md";
import { FaBath, FaBed, FaRegEdit, FaToilet } from "react-icons/fa";
import { VscTypeHierarchy } from "react-icons/vsc";
import { motion } from "framer-motion";
import styles from "./propertyDetails.module.scss";
import { useQuery } from "react-query";
import axios from "axios";
import { server_url } from "../../../utils/junk";
import Comments from "../../../components/properties/comments/Comments";
import Loader from "../../../utils/Loader";
import RightDetails from "../../../components/property_details/RightDetails";
import DOMPurify from "dompurify";
import GoBack from "../../../utils/GoBack";

export default function PropertyDetail() {
  const { slug } = useParams();
  const [alert, setAlert] = useState(null);
  const [fixPropName, setFixPropName] = useState(false);

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
  refetch();

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
        <GoBack />
        <div className={styles["contacts__bottom__wrapper"]}>
          <div className={styles["contacts__bottom"]}></div>
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
                  {property.location}, {property.city}
                </p>
              </div>
              <h3>
                ₦{new Intl.NumberFormat().format(property.price)}
                {property.purpose === "Rent"
                  ? "/year"
                  : property.purpose === "Shortlet"
                  ? "/night"
                  : null}
              </h3>
            </div>
            <div className={styles["other__details"]}>
              <p className={styles["availability__texts"]}>
                <MdBookmarkAdd />
                <b>Availability status:</b>
                <span
                  className={
                    property.availability === "Available"
                      ? `${styles.available}`
                      : `${styles.navailable}`
                  }
                >
                  {property.availability}
                </span>
              </p>
              <p>
                <AiOutlineCalendar />
                <b>Date Added:</b> {new Date(property.createdAt).toDateString()}{" "}
              </p>

              <p>
                <FaRegEdit />
                <b>Last Updated:</b>{" "}
                {new Date(property.updatedAt).toDateString()}
              </p>

              <span>
                <VscTypeHierarchy />
                <b>Property Type:</b> {property.purpose}
              </span>
              {alert && (
                <p
                  className="alert message"
                  style={{ width: "fit-content", height: "1.6rem" }}
                >
                  {alert}
                </p>
              )}
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
              <div className={styles["interior__info"]}>
                <p>
                  <FaBed /> {property.bedrooms}
                </p>
                <p>
                  <FaToilet /> {property.toilets}
                </p>
                <p>
                  <FaBath /> {property.bathrooms}
                </p>
              </div>
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
              <h2>Description</h2>
              <p>
                {" "}
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(property.description),
                  }}
                ></div>
              </p>
            </div>
            <div></div>
            <Comments propertyID={property._id} slug={property.slug} />
          </div>
          <RightDetails property={property} refetch={refetch} />
        </div>
      </section>
    </motion.section>
  );
}
