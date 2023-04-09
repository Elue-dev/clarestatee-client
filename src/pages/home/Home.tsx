import PropertiesForSale from "../../components/properties/for_sale/PropertiesForSale";
import Hero from "../../components/hero/Hero";
import PropertiesForRent from "../../components/properties/for_rent/PropertiesForRent";
import PropertiesForShortLet from "../../components/properties/for_shortlet/PropertiesForShortlet";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { REMOVE_ACTIVE_USER } from "../../redux/slices/auth_slice";

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    const expirationTime = new Date().getTime() + 86400000;
    const now = new Date().getTime();
    const remainingTime = expirationTime ? expirationTime - now : 0;

    if (remainingTime <= 0) {
      dispatch(REMOVE_ACTIVE_USER());
    } else {
      const timeout = setTimeout(() => {
        dispatch(REMOVE_ACTIVE_USER());
      }, remainingTime);

      sessionStorage.setItem("timeout", timeout.toString());
    }

    return () => {
      const timeout = sessionStorage.getItem("timeout");
      if (timeout) {
        clearTimeout(parseInt(timeout));
        sessionStorage.removeItem("timeout");
      }
    };
  }, [dispatch]);

  return (
    <section>
      <Hero />
      <PropertiesForSale />
      <PropertiesForRent />
      <PropertiesForShortLet />
    </section>
  );
}
