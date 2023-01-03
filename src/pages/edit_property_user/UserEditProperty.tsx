import {
  getSingleProperty,
  updateProperty,
} from "../../services/property_service";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { motion } from "framer-motion";
import { IoInformationCircleOutline } from "react-icons/io5";
import Select from "react-select";
import { useSelector } from "react-redux";
import { getUserToken } from "../../redux/slices/auth_slice";

const initialState = {
  name: "",
  price: "",
  location: "",
  city: "",
  bedrooms: "",
  bathrooms: "",
  toilets: "",
  agentName: "",
  agentContact: "",
};

const availabilityOptions = [
  { value: "Available", label: "Available " },
  { value: "Not Available", label: "Not Available" },
];

const purposeOptions = [
  { value: "Rent", label: "For Rent" },
  { value: "Shortlet", label: "For Shortlet" },
  { value: "Sale", label: "For Sale" },
];

export default function UserEditProperty() {
  const [property, setProperty] = useState<any>(null);
  const [images, setImages] = useState<any>([]);
  const [description, setDescription] = useState("");
  const [purpose, setPurpose] = useState("");
  const [availability, setAvailability] = useState("");
  const [features, setFeatures] = useState<any>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { propertySlug, propertyID }: any = useParams();
  const token: any = useSelector(getUserToken);
  const navigate = useNavigate();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const data = await getSingleProperty(propertySlug);
        setProperty(data.property);
      } catch (error) {
        console.log(error);
      }
    };

    getProduct();
  }, []);

  useEffect(() => {
    setDescription(
      property && property.description ? property.description : ""
    );
  }, [property]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProperty({ ...property, [name]: value });
  };

  const propertyData = new FormData();
  propertyData.append("name", property?.name);
  propertyData.append("price", property?.price);
  propertyData.append("description", property?.description);
  propertyData.append("location", property?.location);
  propertyData.append("city", property?.city);
  propertyData.append("bedrooms", property?.bedrooms);
  propertyData.append("bathrooms", property?.bathrooms);
  propertyData.append("toilets", property?.toilets);
  propertyData.append("agentName", property?.agentName);
  propertyData.append("agentContact", property?.agentContact);
  propertyData.append("purpose", purpose || property?.purpose);
  propertyData.append("availability", availability || property?.availability);
  if (images) {
    Array.from(images).forEach((image: any) => {
      propertyData.append("images", image);
    });
  }
  if (features) {
    Array.from(features).forEach((feature: any) => {
      propertyData.append("features", feature);
    });
  }

  const saveProperty = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await updateProperty(propertyData, propertyID, token);
      if (response) {
        navigate(`/property/${property.slug}`);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  if (!property) {
    return (
      <div className="loader">
        <PulseLoader
          color={"rgba(14, 16, 30, 0.937)"}
          loading={true}
          size={15}
        />
      </div>
    );
  }

  return (
    <motion.section
      className="add__property"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <form onSubmit={saveProperty}>
        {error && <p className="alert error">{error}</p>}
        <label>
          <span>Property Name:</span>
          <input
            type="text"
            name="name"
            value={property && property.name}
            onChange={(e) => handleInputChange(e)}
            placeholder="e.g: 3 Bedroom Duplex For rent"
            required
          />
        </label>
        <br />
        <label>
          <span>Property Price</span>
          <input
            type="number"
            name="price"
            min={0}
            value={property && property.price}
            onChange={(e) => handleInputChange(e)}
            placeholder="e.g: 70000"
            required
          />
        </label>
        <br />
        <label>
          <span>Availability of property</span>
          <Select
            options={availabilityOptions}
            placeholder="Select property availability"
            //@ts-ignore
            onChange={(option) => setAvailability(option.value)}
            className="select__style"
          />
        </label>
        <label>
          <span>Purpose of property</span>
          <Select
            options={purposeOptions}
            placeholder="Select property purpose"
            //@ts-ignore
            onChange={(option) => setPurpose(option.value)}
            className="select__style"
          />
        </label>

        <br />
        <label>
          <span>Property Location:</span>
          <input
            type="text"
            name="location"
            value={property && property.location}
            onChange={(e) => handleInputChange(e)}
            placeholder="e.g: Victoria Island"
            required
          />
        </label>
        <br />
        <label>
          <span>Property City:</span>
          <input
            type="text"
            name="city"
            value={property && property.city}
            onChange={(e) => handleInputChange(e)}
            placeholder="e.g: Victoria Island"
            required
          />
        </label>
        <label>
          <div className="flex__info">
            <label>
              <span>No. of Bedrooms</span>
              <input
                type="number"
                name="bedrooms"
                min={0}
                value={property && property.bedrooms}
                onChange={(e) => handleInputChange(e)}
                placeholder="No. of bedrooms"
                required
              />
            </label>
            <label>
              <span>No. of Bathrooms</span>
              <input
                type="number"
                name="bathrooms"
                min={0}
                value={property && property.bathrooms}
                onChange={(e) => handleInputChange(e)}
                placeholder="No. of bathrooms"
                required
              />
            </label>
            <label>
              <span>No. of Toilets</span>
              <input
                type="number"
                name="toilets"
                min={0}
                value={property && property.toilets}
                onChange={(e) => handleInputChange(e)}
                placeholder="No. of toilets"
                required
              />
            </label>
          </div>
        </label>
        <br />
        <label>
          <span>Agent Name</span>
          <input
            type="text"
            name="agentName"
            value={property && property.agentName}
            onChange={(e) => handleInputChange(e)}
            placeholder="ABC Housing Ltd"
            required
          />
        </label>
        <br />
        <label>
          <span>Agent Contact</span>
          <input
            type="tel"
            name="agentContact"
            value={property && property.agentContact}
            onChange={(e) => handleInputChange(e)}
            placeholder="Phone/Contact No. of the agent"
            required
          />
        </label>
        <br />

        <label>
          <span>Property Description:</span>
          <textarea
            name="description"
            value={property && property.description}
            onChange={(e) => handleInputChange(e)}
            placeholder="e.g: A beautiful 4 bedroom apartment with all en-suite private rooms, with 2 living room and a kitchen available for guests use. Apartment is in the centre of Abuja close to banks, Malls, shopping complex. It’s at a no distance from all key areas of... "
            cols={30}
            rows={10}
            required
          />
        </label>
        <p className="feature__info check">
          PLEASE CHECK THAT ALL INPUTS ARE FILLED AND CONFIRM ALL THE DETAILS
          BEFORE SUBMITTING...
        </p>
        {loading && (
          <button type="submit" className="submit__property__btn">
            <PulseLoader loading={loading} size={10} color={"#fff"} />
          </button>
        )}
        {!loading && (
          <button type="submit" className="submit__property__btn">
            Submit Property
          </button>
        )}
      </form>
    </motion.section>
  );
}
