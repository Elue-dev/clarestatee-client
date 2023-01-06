import { selectCities } from "../../redux/slices/property_slice";
import { useState, FormEvent } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import styles from "./hero.module.scss";

export default function Hero() {
  const [city, setCity] = useState("");
  const [purpose, setPurpose] = useState("");
  const [purposeError, setPurposeError] = useState<string | null>("");
  const [citiesError, setCitiesError] = useState<string | null>("");
  const navigate = useNavigate();
  const cities = useSelector(selectCities);

  const purposeOptions = [
    { value: "Rent", label: "For Rent" },
    { value: "Shortlet", label: "For Shortlet" },
    { value: "Sale", label: "For Sale" },
  ];

  const cityOptions: any = [];
  let value: string;
  let label: string;

  cities?.map((city: string) => cityOptions.push({ value: city, label: city }));

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();

    setPurposeError(null);
    setCitiesError(null);

    if (!purpose) {
      return setPurposeError("Property Purpose is required");
    } else {
      setPurposeError(null);
    }
    if (!city) {
      return setCitiesError("Property Location is required");
    } else {
      setCitiesError(null);
    }

    navigate(`/property_search?city=${city}&purpose=${purpose}`);
  };

  return (
    <div className={styles.hero}>
      <div className={styles["hero__content"]}>
        <h1>Welcome to Clarestate</h1>
        <p>Let's find the perfect place for you</p>
        <form onSubmit={handleSearch}>
          {citiesError && (
            <p className={styles["select__err"]}>{citiesError}</p>
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
              options={cityOptions}
              placeholder="Select city"
              //@ts-ignore
              onChange={(option) => setCity(option.value)}
              className={styles["select__purpose"]}
            />
            <button type="submit">Search</button>
          </div>
        </form>
      </div>
    </div>
  );
}
