import { useQuery } from "react-query";
import axios from "axios";
import { server_url } from "../../../utils/junk";
import { Link } from "react-router-dom";
import { MdDateRange } from "react-icons/md";
import { ImLocation2 } from "react-icons/im";
import { BsCamera } from "react-icons/bs";
import styles from "../for_sale/properties.module.scss";
import { useDispatch } from "react-redux";
import { SET_CAREGORIES } from "../../../redux/slices/property_slice";
import Loader from "../../../utils/Loader";
import { FaLaptopHouse } from "react-icons/fa";

export default function PropertiesForShortLet() {
  const dispatch = useDispatch();

  const fetchProperties = async () => {
    return await axios.get(`${server_url}/api/properties`);
  };

  const { data, isLoading, isSuccess } = useQuery(
    "properties",
    fetchProperties,
    {
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) {
    return <Loader />;
  }

  const properties = data?.data.properties;

  if (isSuccess) {
    dispatch(SET_CAREGORIES(properties));
  }

  const filteredProperties = properties?.filter(
    (property: any) => property.purpose === "Shortlet"
  );

  return (
    <>
      <section className={styles.properties}>
        <h2>
          <FaLaptopHouse />
          Featured Properties for Shortlet
        </h2>
        <div className={styles["properties__contents"]}>
          {filteredProperties?.slice(0, 4)?.map((property: any) => {
            const {
              _id,
              name,
              price,
              createdAt,
              availability,
              location,
              images,
              slug,
              purpose,
            } = property;
            return (
              <div key={_id}>
                <Link
                  to={`/property/${slug}`}
                  style={{ textDecoration: "none" }}
                >
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
                      <p className={styles["property__price"]}>
                        <span>NGN{new Intl.NumberFormat().format(price)}</span>
                        /night
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
