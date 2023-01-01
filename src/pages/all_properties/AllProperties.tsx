import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  FILTER_BY_LOCATION,
  FILTER_BY_SEARCH,
  selectFilteredProperties,
  SORT_PROPERTIES,
} from "../../redux/slices/filter_slice";
import { Link } from "react-router-dom";
import { CiRead } from "react-icons/ci";
import { TbHomeOff } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import { ImMenu2 } from "react-icons/im";
import { server_url } from "../../utils/junk";
import axios from "axios";
import { useQuery } from "react-query";
import Loader from "../../utils/Loader";
import ReactPaginate from "react-paginate";
import Select from "react-select";
import styles from "./allProperties.module.scss";
// import GoBack from "../../components/utilities/GoBack";
// import { animateScroll as scroll } from "react-scroll";

const sortOptions = [
  { value: "latest", label: "Sorting: Latest" },
  { value: "lowest-price", label: "Sort by Lowest Price" },
  { value: "highest-price", label: "Sort by Highest Price" },
  { value: "Available", label: "Sort: Available" },
  { value: "Not Available", label: "Sort: Not Available" },
];

export default function AllProperties() {
  const [properties, setProperties] = useState([]);
  const [locations, setLocations] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [showFilter, setShowFilter] = useState(false);
  const [scrollPage, setScrollpage] = useState(false);
  const dispatch = useDispatch();
  const filteredProperties = useSelector(selectFilteredProperties);
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 3;

  useEffect(() => {
    fetchAllProperties();
  }, []);

  const fetchAllProperties = async () => {
    const { data } = await axios.get(`${server_url}/api/properties`);
    setProperties(data.properties);
  };

  if (!properties) {
    return <Loader />;
  }

  const allLocations = [
    "All",
    ...new Set(properties.map((property: any) => property.location)),
  ];

  const handlePageClick = (event: any) => {
    const newOffset =
      (event.selected * itemsPerPage) % filteredProperties?.length;
    setItemOffset(newOffset);
    window.scrollTo(0, 0);
  };

  const fixNavbar = () => {
    if (window.scrollY > 150) {
      setScrollpage(true);
    } else {
      setScrollpage(false);
    }
  };
  window.addEventListener("scroll", fixNavbar);

  const clearFilters = () => {
    setLocations("All");
    setSearch("");
    setSort("latest");
    setShowFilter(false);
  };

  const filterByLocation = (loc: string) => {
    setLocations(loc);
    window.scrollTo(0, 0);
    setSearch("");
    setSort("latest");
    setPageCount(1);
    dispatch(FILTER_BY_LOCATION({ properties, location: loc }));
    setShowFilter(false);
  };

  const handleSelectChange = (option: any) => {
    setSort(option.value);
    setSearch("");
    setShowFilter(false);
    setPageCount(1);
  };

  useEffect(() => {
    dispatch(FILTER_BY_LOCATION({ properties, location: locations }));
  }, [dispatch, properties, locations]);

  useEffect(() => {
    dispatch(
      FILTER_BY_SEARCH({
        properties,
        search,
      })
    );
  }, [dispatch, properties, search]);

  useEffect(() => {
    dispatch(
      SORT_PROPERTIES({
        properties,
        sort,
      })
    );
  }, [dispatch, properties, sort]);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;

    setCurrentItems(filteredProperties?.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredProperties?.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, filteredProperties]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className={styles["all__properties"]}
    >
      <div className={styles["hero__all-p-wrapper"]}>
        <div className={styles["hero__all-p"]}>
          <h2>EXPLORE OUR PROPERTIES</h2>
          <label>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH BY LOCATION OR PROPERTY NAME..."
            />
          </label>
        </div>
      </div>
      {showFilter && (
        <div className={styles.layer} onClick={() => setShowFilter(false)} />
      )}
      <div
        className={
          showFilter
            ? `${styles["property__filters"]} ${styles.show}`
            : `${styles["property__filters"]}`
        }
      >
        <div className={styles["close__filter"]}>
          <IoClose onClick={() => setShowFilter(false)} />
        </div>

        <div className={styles["locations__list"]}>
          <h2>Filter by location</h2>
          {allLocations.map((loc: any, index: number) => (
            <div>
              <button
                key={index}
                //@ts-ignore
                className={`${locations}` === loc ? `${styles.active}` : null}
                type="button"
                onClick={() => filterByLocation(loc)}
              >
                {loc}
              </button>
            </div>
          ))}
        </div>
        <button onClick={clearFilters} className={styles["clear__filters"]}>
          CLEAR ALL FILTERS
        </button>
      </div>
      <div className={styles["all__properties__wrapper"]}>
        <div
          className={
            scrollPage
              ? `${styles["menu__filter"]} ${styles["fix_menu"]}`
              : `${styles["menu__filter"]}`
          }
        >
          <ImMenu2 onClick={() => setShowFilter(true)} />
        </div>
        <div className={styles["properties__"]}>
          <label>
            <Select
              options={sortOptions}
              placeholder="Select sorting parameter"
              //@ts-ignore
              onChange={(option) => handleSelectChange(option)}
              className={styles["select__purpose"]}
            />
            {/* <select value={sort} onChange={handleSelectChange}>
              <option value="latest">Sorting: Latest</option>
              <option value="lowest-price">Sort by Lowest Price</option>
              <option value="highest-price">Sort by Highest Price</option>
              <option value="Available">Sort: Available</option>
              <option value="Not Available">Sort: Not Available</option>
            </select> */}
          </label>
          {search && (
            <>
              {filteredProperties.length !== 0 && (
                <h3>
                  Search results for{" "}
                  <b>
                    <em>'{search}'</em>
                  </b>{" "}
                </h3>
              )}

              {filteredProperties.length !== 0 && (
                <h3>
                  <>
                    ({filteredProperties.length}{" "}
                    {filteredProperties.length === 1 ? "RESULT" : "RESULTS"})
                  </>
                </h3>
              )}
            </>
          )}
          <motion.div
            className={styles["prop__grid"]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {filteredProperties.length === 0 && (
              <div className={styles["no__property"]}>
                <TbHomeOff className={styles["empty__icon"]} />
                <h2>No properties found for '{search}'</h2>
              </div>
            )}
            {currentItems?.map((property: any) => {
              const {
                id,
                name,
                location,
                description,
                price,
                images,
                availability,
                slug,
              } = property;
              return (
                <div className={styles["wrap_p"]} key={id}>
                  <div className={styles["image_"]}>
                    <img src={images[0]} alt={name} />
                    <p
                      className={styles["p_availability"]}
                      style={{
                        background:
                          availability === "Available"
                            ? "rgba(136, 229, 29, 0.575)"
                            : "rgba(243, 90, 52, 0.411)",
                      }}
                    >
                      {availability}
                    </p>
                    <p className={styles["p_location"]}>{location}</p>
                  </div>
                  <div className={styles["inner_c"]}>
                    <div className={styles["name_"]}>
                      <h2>{name}</h2>
                    </div>
                    <div className={styles["desc_"]}>
                      <p>{description.substring(0, 60)}...</p>
                    </div>
                    <div className={styles["price_"]}>
                      <p>
                        NGN {new Intl.NumberFormat().format(price)}
                        <span>/night</span>
                      </p>
                    </div>
                    <Link to={`/property/${slug}`}>
                      <button className={styles["more_"]}>
                        <CiRead />
                        MORE DETAILS
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </motion.div>
          {filteredProperties.length ? (
            <ReactPaginate
              breakLabel="..."
              nextLabel="Next"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              pageCount={pageCount}
              previousLabel="Prev"
              //@ts-ignore
              renderOnZeroPageCount={null}
              containerClassName={styles["pagination"]}
              pageLinkClassName={styles["page-num"]}
              previousLinkClassName={styles["page-num"]}
              nextLinkClassName={styles["page-num"]}
              activeLinkClassName={styles.activePage}
            />
          ) : null}
        </div>
      </div>
    </motion.section>
  );
}
