import { useQuery } from "react-query";
import axios from "axios";
import { server_url } from "../../../utils/junk";
import { GiHouseKeys } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import {
  selectProperties,
  SET_CITIES,
  SET_PROPERTIES,
} from "../../../redux/slices/property_slice";
import Loader from "../../../utils/Loader";
import styles from "./properties.module.scss";
import PropertiesLayout from "../../properties_layout/PropertiesLayout";
import { useEffect } from "react";

export default function PropertiesForSale() {
  const dispatch = useDispatch();
  const fetchProperties = async () => {
    return await axios.get(`${server_url}/api/properties`);
  };

  const { data, isLoading, isSuccess, refetch } = useQuery(
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

  refetch();

  if (isSuccess) {
    dispatch(SET_CITIES(properties));
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
