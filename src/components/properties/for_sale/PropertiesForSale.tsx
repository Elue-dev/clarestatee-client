import { useQuery } from "react-query";
import axios from "axios";
import { server_url } from "../../../utils/junk";
import { GiHouseKeys } from "react-icons/gi";
import { useDispatch } from "react-redux";
import { SET_CAREGORIES } from "../../../redux/slices/property_slice";
import Loader from "../../../utils/Loader";
import styles from "./properties.module.scss";
import PropertiesLayout from "../../properties_layout/PropertiesLayout";

export default function PropertiesForSale() {
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

  const filteredProperties = properties?.filter(
    (property: any) => property.purpose === "Sale"
  );

  if (isSuccess) {
    dispatch(SET_CAREGORIES(properties));
  }

  return (
    <>
      <section className={styles.properties}>
        <h2>
          <GiHouseKeys />
          Featured Properties for Sale
        </h2>
        <PropertiesLayout filteredProperties={filteredProperties} />
      </section>
    </>
  );
}
