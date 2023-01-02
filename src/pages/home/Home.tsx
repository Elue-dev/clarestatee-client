import PropertiesForSale from "../../components/properties/for_sale/PropertiesForSale";
import Hero from "../../components/hero/Hero";
import PropertiesForRent from "../../components/properties/for_rent/PropertiesForRent";
import PropertiesForShortLet from "../../components/properties/for_shortlet/PropertiesForShortlet";

export default function Home() {
  return (
    <section>
      <Hero />
      <PropertiesForSale />
      <PropertiesForRent />
      <PropertiesForShortLet />
    </section>
  );
}
