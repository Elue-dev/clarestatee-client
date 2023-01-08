import styles from "./skeleton.module.scss";

export default function Skeleton({ count }: any) {
  const PropertySkeleton = () => {
    <div className={styles["properties__details"]}>
      <div className={styles["properties__details__image"]}>
        <img src={""} alt={""} />
        <p
          className={styles["property__availability"]}
          style={{
            background: "#313131",
          }}
        >
          {""}
        </p>
        <span className={styles["camera__icon"]}>
          {/* <BsCamera /> */}
          <span>{""}</span>
        </span>
      </div>
      <div className={styles["properties__details__texts"]}>
        <p className={styles["property__name"]}>
          <span>{""}</span>
        </p>

        <p className={styles["property__id"]}>
          {/* <MdDateRange /> */}
          {""}
        </p>
        <p className={styles["property__location"]}>
          {/* <ImLocation2 /> */}
          {""}
        </p>
        <p className={styles["property__price"]}>
          <span>{""}</span>
        </p>
      </div>
    </div>;
  };
  //@ts-ignore
  return Array(count).fill(<PropertySkeleton />);
}
