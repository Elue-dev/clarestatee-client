import {
  getSingleProperty,
  updateProperty,
} from "../../../services/property_service";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { getUserToken } from "../../../redux/slices/auth_slice";
import PropertyForm from "../../../components/property_form/PropertyForm";
import { AiOutlineEdit } from "react-icons/ai";

export default function EditProduct() {
  const [property, setProperty] = useState<any | null>(null);
  const [images, setImages] = useState<any>(property?.images || []);
  const [description, setDescription] = useState("");
  const [purpose, setPurpose] = useState("");
  const [availability, setAvailability] = useState("");
  const [newFeature, setNewFeature] = useState("");
  const [features, setFeatures] = useState<any>(property?.features);
  const featuresInput = useRef<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const token: any = useSelector(getUserToken);
  const { propertySlug, propertyID }: any = useParams();
  const navigate = useNavigate();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  const saveProperty = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const propertyData = new FormData();
      propertyData.append("name", property?.name);
      propertyData.append("price", property?.price);
      propertyData.append("description", property?.description);
      propertyData.append("location", property?.location);
      propertyData.append("bedrooms", property?.bedrooms);
      propertyData.append("bathrooms", property?.bathrooms);
      propertyData.append("toilets", property?.toilets);
      propertyData.append("agentName", property?.agentName);
      propertyData.append("agentContact", property?.agentContact);
      propertyData.append("purpose", purpose || property?.purpose);
      propertyData.append(
        "availability",
        availability || property?.availability
      );
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

      const res = await updateProperty(propertyData, propertyID, token);
      res ? navigate("/admin/view-properties") : null;
    } catch (error) {
      console.log(error);
      setLoading(false);
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
    <div>
      <h3
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "1rem",
        }}
      >
        <AiOutlineEdit /> &nbsp;Edit Property
      </h3>
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
    </div>
  );
}
