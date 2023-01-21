import { useEffect, useState } from "react";
import axios from "axios";
import { server_url } from "../../../utils/junk";
import Loader from "../../../utils/Loader";
import ReactPaginate from "react-paginate";
import { motion } from "framer-motion";
import {
  FILTER_BY_SEARCH,
  selectFilteredProperties,
} from "../../../redux/slices/filter_slice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Notiflix from "notiflix";
import "./viewProperties.scss";
import { removeProperty } from "../../../services/property_service";
import { getUserToken } from "../../../redux/slices/auth_slice";

export default function ViewProperties() {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const filteredProperties = useSelector(selectFilteredProperties);
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 9;
  const token: any = useSelector(getUserToken);

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

  useEffect(() => {
    dispatch(
      FILTER_BY_SEARCH({
        properties,
        search,
      })
    );
  }, [dispatch, properties, search]);

  const handlePageClick = (event: any) => {
    const newOffset =
      (event.selected * itemsPerPage) % filteredProperties?.length;
    setItemOffset(newOffset);
    window.scrollTo(0, 0);
  };

  const deleteProperty = async (propertyID: string) => {
    try {
      const res = await removeProperty(propertyID, token);
      if (res) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;

    setCurrentItems(filteredProperties?.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredProperties?.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, filteredProperties]);

  const confirmDelete = (propertyID: string) => {
    Notiflix.Confirm.show(
      "Delete Property",
      "Are you sure you want to delete this property?",
      "DELETE",
      "CLOSE",
      function okCb() {
        deleteProperty(propertyID);
      },
      function cancelCb() {},
      {
        width: "320px",
        borderRadius: "5px",
        titleColor: "crimson",
        okButtonBackground: "crimson",
        cssAnimationStyle: "zoom",
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="view__prop__admin"
    >
      <label>
        <input
          type="search"
          className="search__field"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Property location or name"
        />
      </label>
      {search && (
        <>
          <h3>
            Property locations including{" "}
            <b>
              <em>'{search}'</em>
            </b>{" "}
          </h3>
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
      <div className="table">
        {filteredProperties.length === 0 ? (
          <h2>
            <b>No Product(s) Found.</b>
          </h2>
        ) : (
          <table>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Reference ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Location</th>
                <th>Date Added</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems?.map((property, index) => {
                const {
                  id,
                  name,
                  price,
                  images,
                  createdAt,
                  location,
                  slug,
                  purpose,
                } = property;
                return (
                  <tr key={id}>
                    <td>{index + 1}</td>
                    <td>{id}</td>
                    <td>
                      <img
                        src={images[0]}
                        alt={name}
                        style={{ width: "100px" }}
                      />
                    </td>
                    <td>{name}</td>
                    <td>{location}</td>
                    <td>{new Date(createdAt).toDateString()}</td>
                    <td>
                      ₦{new Intl.NumberFormat().format(price)}
                      {purpose === "Rent"
                        ? "/year"
                        : purpose === "Shortlet"
                        ? "/night"
                        : null}
                    </td>
                    <td className="icons">
                      <Link to={`/admin/edit-property/${slug}/${id}`}>
                        <FaEdit size={20} color="green" />
                      </Link>
                      &nbsp;
                      <FaTrashAlt
                        size={18}
                        color="red"
                        onClick={() => confirmDelete(id)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
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
            containerClassName="pagination"
            pageLinkClassName="page-num"
            previousLinkClassName="page-num"
            nextLinkClassName="page-num"
            activeLinkClassName="activePage"
          />
        ) : null}
      </div>
    </motion.div>
  );
}
