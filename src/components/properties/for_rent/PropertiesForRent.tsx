import { useQuery } from "react-query";
import axios from "axios";
import { server_url } from "../../../utils/junk";
import { BsFillHouseFill } from "react-icons/bs";
import styles from "../for_sale/properties.module.scss";
import { useDispatch } from "react-redux";
import { SET_CITIES } from "../../../redux/slices/property_slice";
import Loader from "../../../utils/Loader";
import PropertiesLayout from "../../properties_layout/PropertiesLayout";

export default function PropertiesForRent() {
  const dispatch = useDispatch();

  const fetchProperties = async () => {
    return await axios.get(`${server_url}/api/properties`);
  };

  const { data, isLoading, refetch } = useQuery("properties", fetchProperties, {
    refetchOnWindowFocus: false,
    onSuccess: () => {
      dispatch(SET_CITIES(data?.data.properties));
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  const properties = data?.data.properties;

  const filteredProperties = properties?.filter(
    (property: any) => property.purpose === "Rent"
  );

  refetch();

  return (
    <>
      <section className={styles.properties}>
        <h2>
          <BsFillHouseFill />
          Featured Properties for Rent
        </h2>
        <PropertiesLayout filteredProperties={filteredProperties} />
      </section>
    </>
  );
}
