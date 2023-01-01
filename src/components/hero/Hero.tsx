import { selectLocations } from "../../redux/slices/property_slice";
import { useState, FormEvent } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import styles from "./hero.module.scss";

export default function Hero() {
  const [location, setLocation] = useState("");
  const [purpose, setPurpose] = useState("");
  const [purposeError, setPurposeError] = useState<string | null>("");
  const [locationError, setLocationError] = useState<string | null>("");
  const navigate = useNavigate();
  const locations = useSelector(selectLocations);

  const purposeOptions = [
    { value: "Rent", label: "For Rent" },
    { value: "Shortlet", label: "For Shortlet" },
    { value: "Sale", label: "For Sale" },
  ];

  const locationOptions: any = [];
  let value: string;
  let label: string;

  locations?.map((location: string) =>
    locationOptions.push({ value: location, label: location })
  );

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();

    setPurposeError(null);
    setLocationError(null);

    if (!purpose) {
      return setPurposeError("Property Purpose is required");
    } else {
      setPurposeError(null);
    }
    if (!location) {
      return setLocationError("Property Location is required");
    } else {
      setLocationError(null);
    }

    navigate(`/property_search?location=${location}&purpose=${purpose}`);
  };

  return (
    <div className={styles.hero}>
      <div className={styles["hero__content"]}>
        <h1>Welcome to Clarestate</h1>
        <p>Let's find the perfect place for you</p>
        <form onSubmit={handleSearch}>
          {locationError && (
            <p className={styles["select__err"]}>{locationError}</p>
          )}
          {purposeError && (
            <p className={styles["select__err"]}>{purposeError}</p>
          )}
          <div className={styles["select__wrapper"]}>
            <Select
              options={purposeOptions}
              placeholder="Select purpose"
              //@ts-ignore
              onChange={(option) => setPurpose(option.value)}
              className={styles["select__purpose"]}
            />
            <Select
              options={locationOptions}
              placeholder="Select location"
              //@ts-ignore
              onChange={(option) => setLocation(option.value)}
              className={styles["select__purpose"]}
            />
            <button type="submit">Search</button>
          </div>
        </form>
      </div>
    </div>
  );
}
