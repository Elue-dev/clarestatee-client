import { server_url } from "../../../utils/junk";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { PulseLoader } from "react-spinners";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BsCamera } from "react-icons/bs";
import { MdDateRange } from "react-icons/md";
import { ImLocation2 } from "react-icons/im";
import styles from "./queriedProperties.module.scss";
import { FaBath, FaBed, FaToilet } from "react-icons/fa";
import Loader from "../../../utils/Loader";

export default function QueriedProperty() {
  const queryString = useLocation().search;
  const queryParams = new URLSearchParams(queryString);
  const city = queryParams.get("city");
  const purpose = queryParams.get("purpose");
  const [loading, setLoading] = useState(true);

  const [properties, setProperties] = useState([]);

  useEffect(() => {
    getQueriedProperties();
  }, []);

  const getQueriedProperties = async () => {
    const response = await axios.get(
      `${server_url}/api/properties?city=${city}&purpose=${purpose}`
    );
    setProperties(response.data?.properties);

    setLoading(false);
  };

  if (!properties) {
    return <Loader />;
  }

  return (
    <section className={styles.query}>
      <div className={styles.heading}>
        Properties in <span>{city}</span> for <span>{purpose}</span>
      </div>

      {loading ? (
        <h2 className={styles["no__results"]}>
          <PulseLoader loading={loading} size={10} color="rgb(18, 140, 200)" />
        </h2>
      ) : (
        <>
          {properties.length === 0 ? (
            <h2>No properties found. Try searching something else</h2>
          ) : (
            <h3>
              {properties.length}{" "}
              {properties.length === 1 ? "property" : "properties"} found
            </h3>
          )}

          <div className={styles["properties__wrap"]}>
            {properties?.map((property: any) => {
              const {
                _id,
                name,
                price,
                purpose,
                slug,
                images,
                availability,
                createdAt,
                toilets,
                bedrooms,
                bathrooms,
                location,
              } = property;
              return (
                <Link key={_id} to={`/property/${slug}`}>
                  <div className={styles["properties__details"]}>
                    <div className={styles["properties__details__image"]}>
                      <img src={images[0]} alt={name} />
                      <p
                        className={styles["property__availability"]}
                        style={{
                          background:
                            availability === "Available"
                              ? "rgba(136, 229, 29, 0.575)"
                              : "rgba(243, 90, 52, 0.411)",
                        }}
                      >
                        {" "}
                        {availability}
                      </p>
                      <p className={styles["property__purpose"]}>
                        <span>{purpose}</span>
                      </p>
                      <span className={styles["camera__icon"]}>
                        <BsCamera />
                        <span>{images.length}</span>
                      </span>
                    </div>
                    <div className={styles["properties__details__texts"]}>
                      <p className={styles["property__name"]}>
                        <span>{name}</span>
                      </p>

                      <p className={styles["property__id"]}>
                        <MdDateRange />
                        {new Date(createdAt).toDateString()}
                      </p>
                      <p className={styles["property__location"]}>
                        <ImLocation2 />
                        {location}
                      </p>
                      <div className={styles["interior__info"]}>
                        <p>
                          <FaBed /> {bedrooms}
                        </p>
                        <p>
                          <FaToilet /> {toilets}
                        </p>
                        <p>
                          <FaBath /> {bathrooms}
                        </p>
                      </div>
                      <p className={styles["property__price"]}>
                        <span>NGN{new Intl.NumberFormat().format(price)}</span>
                        /night
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
