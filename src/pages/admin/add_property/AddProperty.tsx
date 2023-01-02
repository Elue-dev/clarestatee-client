import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GrFormAdd } from "react-icons/gr";
import PropertyForm from "../../../components/property_form/PropertyForm";
import { createProperty } from "../../../services/property_service";
import { useSelector } from "react-redux";
import { getUserToken } from "../../../redux/slices/auth_slice";
import { errorToast } from "../../../utils/alerts";

const initialState = {
  name: "",
  price: "",
  location: "",
  bedrooms: "",
  bathrooms: "",
  toilets: "",
  agentName: "",
  agentContact: "",
};

export default function AddProperty() {
  const [property, setProperty] = useState<any>(initialState);
  const [images, setImages] = useState<any>([]);
  const [description, setDescription] = useState("");
  const [purpose, setPurpose] = useState("");
  const [availability, setAvailability] = useState("");
  const [newFeature, setNewFeature] = useState("");
  const [features, setFeatures] = useState<any>([]);
  const featuresInput = useRef<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const token: any = useSelector(getUserToken);
  const navigate = useNavigate();

  const {
    name,
    price,
    location,
    bedrooms,
    bathrooms,
    toilets,
    agentName,
    agentContact,
  } = property;

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProperty({ ...property, [name]: value });
  };

  const handleImageChange = (e: any) => {
    const files = e.target.files;
    setImages(files);
  };

  const handleAddFeature = (e: any) => {
    e.preventDefault();
    const feat = newFeature.trim();

    if (feat && !features.includes(feat)) {
      setFeatures((prevFeatures: any) => [...prevFeatures, feat]);
    }

    setNewFeature("");
    featuresInput.current.focus();
  };

  const propertyData = new FormData();
  propertyData.append("name", name);
  propertyData.append("price", price);
  propertyData.append("description", description);
  propertyData.append("location", location);
  propertyData.append("bedrooms", bedrooms);
  propertyData.append("bathrooms", bathrooms);
  propertyData.append("toilets", toilets);
  propertyData.append("agentName", agentName);
  propertyData.append("purpose", purpose);
  propertyData.append("availability", availability);
  propertyData.append("agentContact", agentContact);
  Array.from(images).forEach((image: any) => {
    propertyData.append("images", image);
  });
  Array.from(features).forEach((feature: any) => {
    propertyData.append("features", feature);
  });

  const saveProperty = async (e: FormEvent) => {
    e.preventDefault();

    if (!images.length) {
      return errorToast("Please add images for this property", "uierr");
    }

    // if (images.length <= 4) {
    //   return errorToast(
    //     "Please add at least 5 images for this property",
    //     "uierr2"
    //   );
    // }

    if (features.length <= 4) {
      return errorToast(
        "Please add at least 5 features of this property",
        "ferr"
      );
    }

    if (availability === "") {
      return errorToast("Please select property availability", "averr");
    }

    if (purpose === "") {
      return errorToast("Please select property purpose", "puerr");
    }

    console.log(...propertyData);

    try {
      setLoading(true);
      await createProperty(propertyData, token);
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <>
      <h2 style={{ textAlign: "center" }}>
        <GrFormAdd /> Add New Property
      </h2>
      <PropertyForm
        property={property}
        description={description}
        setDescription={setDescription}
        newFeature={newFeature}
        features={features}
        featuresInput={featuresInput}
        setFeatures={setFeatures}
        setNewFeature={setNewFeature}
        handleAddFeature={handleAddFeature}
        setAvailability={setAvailability}
        setPurpose={setPurpose}
        images={images}
        loading={loading}
        error={error}
        saveProperty={saveProperty}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
      />
    </>
  );
}
