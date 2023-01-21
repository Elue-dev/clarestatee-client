import Loader from "../../utils/Loader";
import { BsCamera } from "react-icons/bs";
import { ImLocation2 } from "react-icons/im";
import { MdDateRange } from "react-icons/md";
import { Link } from "react-router-dom";
import styles from "../properties/for_sale/properties.module.scss";

export default function PropertiesLayout({ filteredProperties }: any) {
  if (!filteredProperties) {
    return <Loader />;
  }

  return (
    <div className={styles["properties__contents"]}>
      {filteredProperties?.length === 0 ? (
        <Loader />
      ) : (
        <>
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
                        <span>₦{new Intl.NumberFormat().format(price)}</span>
                        {purpose === "Rent"
                          ? "/year"
                          : purpose === "Shortlet"
                          ? "/night"
                          : null}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
