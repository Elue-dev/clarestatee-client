import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { motion } from "framer-motion";
import { IoInformationCircleOutline } from "react-icons/io5";
import { PulseLoader } from "react-spinners";
import Select from "react-select";
import "./propertyForm.scss";

const availabilityOptions = [
  { value: "Available", label: "Available " },
  { value: "Not Available", label: "Not Available" },
];

const purposeOptions = [
  { value: "Rent", label: "For Rent" },
  { value: "Shortlet", label: "For Shortlet" },
  { value: "Sale", label: "For Sale" },
];

const PropertyForm = ({
  loading,
  error,
  property,
  setPurpose,
  setAvailability,
  saveProperty,
  images,
  handleInputChange,
  handleImageChange,
  features,
  newFeature,
  featuresInput,
  setNewFeature,
  handleAddFeature,
}: any) => {
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
          <span>Property Images:</span>
          <p className="images__info">
            <IoInformationCircleOutline />
            At least 5 images must be added
          </p>
          <div className="preview__wrapper">
            {Array.from(images).map((item: any, index: number) => (
              <span key={index}>
                <img
                  //@ts-ignore
                  src={item ? URL.createObjectURL(item) : null}
                  className="image__preview"
                />
              </span>
            ))}
          </div>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleImageChange(e)}
            placeholder="Images of the property"
          />
          <br />
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
        <label>
          <span>Property City:</span>
          <input
            type="text"
            name="city"
            value={property && property.city}
            onChange={(e) => handleInputChange(e)}
            placeholder="e.g: Abuja"
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
          <span>Property Features:</span>
          <p className="feature__info">
            <IoInformationCircleOutline />
            Must not be less than 5. Enter the features one after the other,
            start each with a capital letter (e.g: 24hrs Electricity, WiFi
            access, Great security)
          </p>
          <div className="features">
            <input
              type="text"
              name="features"
              value={newFeature}
              ref={featuresInput}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="ENTER ONE, THEN CLICK ADD BUTTON"
            />
            <button onClick={handleAddFeature} className="features__btn">
              Add
            </button>
          </div>
          <div className="features__list">
            <b>Features:</b>{" "}
            {features?.map((i: string, index: number) => (
              <li key={index}>
                <em key={i}>{i}.</em>
              </li>
            ))}
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
};

export default PropertyForm;
