import { useEffect, useState } from "react";
import axios from "axios";
import { server_url } from "../../../utils/junk";
import Loader from "../../../utils/Loader";
import ReactPaginate from "react-paginate";
import { motion } from "framer-motion";
import { selectFilteredProperties } from "../../../redux/slices/filter_slice";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Notiflix from "notiflix";
import "../view_properties/viewProperties.scss";
import { getUserToken } from "../../../redux/slices/auth_slice";
import { deleteUser } from "../../../services/users_services";

export default function Users() {
  const [users, setUsers] = useState([]);
  const filteredProperties = useSelector(selectFilteredProperties);
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 9;
  const token: any = useSelector(getUserToken);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    const { data } = await axios.get(`${server_url}/api/users`, {
      headers: { authorization: `Bearer ${token}` },
    });
    setUsers(data.users);
  };

  if (!users) {
    return <Loader />;
  }

  const handlePageClick = (event: any) => {
    const newOffset =
      (event.selected * itemsPerPage) % filteredProperties?.length;
    setItemOffset(newOffset);
    window.scrollTo(0, 0);
  };

  const removeUser = async (userID: string) => {
    try {
      const res = await deleteUser(userID, token);
      if (res) {
        fetchAllUsers();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;

    setCurrentItems(users?.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(users?.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, users]);

  const confirmDelete = (userID: string) => {
    Notiflix.Confirm.show(
      "Delete User",
      "Are you sure you want to delete this user?",
      "DELETE",
      "CLOSE",
      function okCb() {
        removeUser(userID);
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
      <div className="table">
        {users.length === 0 ? (
          <h2>
            <Loader />
          </h2>
        ) : (
          <table>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Photo</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Bio</th>
                <th>Date Joined</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems?.map((user, index) => {
                const {
                  _id,
                  photo,
                  first_name,
                  last_name,
                  email,
                  createdAt,
                  updatedAt,
                  phone,
                  bio,
                } = user;
                return (
                  <tr key={_id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={photo}
                        alt={first_name}
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                        }}
                      />
                    </td>
                    <td>{first_name}</td>
                    <td>{last_name}</td>

                    <td>{email}</td>
                    <td>{phone}</td>
                    <td>{bio}</td>
                    <td>{new Date(createdAt).toDateString()}</td>
                    <td>{new Date(updatedAt).toDateString()}</td>
                    <td className="icons">
                      <FaTrashAlt
                        size={18}
                        color="red"
                        onClick={() => confirmDelete(_id)}
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
