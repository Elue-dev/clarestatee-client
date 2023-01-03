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
import PropertiesLayout from "../../properties_layout/PropertiesLayout";

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
        <PropertiesLayout filteredProperties={filteredProperties} />
      </section>
    </>
  );
}
