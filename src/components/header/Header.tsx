import React, { useState, useEffect } from "react";
import { BiHomeAlt, BiLogInCircle } from "react-icons/bi";
import {
  MdAddBusiness,
  MdOutlineAdminPanelSettings,
  MdOutlinePermContactCalendar,
} from "react-icons/md";
import { RiDashboardLine } from "react-icons/ri";
import { SiHomebridge } from "react-icons/si";
import { useDispatch, useSelector } from "react-redux";
import { CgMenuGridO } from "react-icons/cg";
import { BsDot } from "react-icons/bs";
import { FaRegUserCircle } from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";
import { NavLink, useNavigate, useLocation, Link } from "react-router-dom";
import { getUser } from "../../redux/slices/auth_slice";
import { logoutUser } from "../../services/auth_services";
import logo from "../../assets/logo2.jpg";
import {
  REMOVE_ACTIVE_USER,
  SET_USER_TOKEN,
} from "../../redux/slices/auth_slice";
import styles from "./header.module.scss";
import { AdminOnlyLink } from "../admin_only/AdminOnlyRoute";

export default function Header() {
  const [scrollPage, setScrollpage] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [showBottomNav, setShowBottomNav] = useState(false);
  const user: any = useSelector(getUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const defaultImg = "https://a0.muscache.com/defaults/user_pic-50x50.png?v=3";

  let initials;

  if (user) {
    const { first_name, last_name } = user;
    const first = first_name?.substring(0, 1);
    const last = last_name?.substring(0, 1);
    initials = first + last;
  }

  useEffect(() => {
    location.pathname.includes("auth")
      ? setShowHeader(false)
      : setShowHeader(true);
  }, [location.pathname]);

  useEffect(() => {
    if (!location.pathname.includes("property")) {
      setShowBottomNav(true);
    } else {
      setShowBottomNav(false);
    }
  }, [location.pathname]);

  const fixNavbar = () => {
    if (window.scrollY > 150) {
      setScrollpage(true);
    } else {
      setScrollpage(false);
    }
  };
  window.addEventListener("scroll", fixNavbar);

  const logout = async () => {
    await logoutUser();
    navigate("/");
    dispatch(REMOVE_ACTIVE_USER());
    dispatch(SET_USER_TOKEN(null));
  };

  return (
    <div>
      {showHeader ? (
        <>
          <header
            className={
              scrollPage
                ? `${styles["header__wrapper"]} ${styles.fixed}`
                : `${styles["header__wrapper"]}`
            }
            //@ts-ignore
            style={{ transition: scrollPage && "all 1s ease" }}
          >
            <div className={styles["header__contents"]}>
              <div className={styles.logo}>
                <Link to="/">
                  <img src={logo} alt="clarestate logo" />
                </Link>
                <Link to="/">
                  <h2>Clarestate</h2>
                </Link>
              </div>

              <ul>
                <AdminOnlyLink>
                  <NavLink to="/admin/view-properties">
                    <li>
                      <MdOutlineAdminPanelSettings />
                      <p>Admin</p>
                    </li>
                  </NavLink>
                </AdminOnlyLink>
                <NavLink to="/">
                  <li>
                    <BiHomeAlt />
                    <p>Home</p>
                  </li>
                </NavLink>
                <NavLink to="/all-properties">
                  <li>
                    <SiHomebridge />
                    <p>Properties</p>
                  </li>
                </NavLink>
                <NavLink to="/contact">
                  <li>
                    <MdOutlinePermContactCalendar />
                    <p>Contact</p>
                  </li>
                </NavLink>
                <NavLink to="/add-property">
                  <li>
                    <MdAddBusiness />
                    <p>Add Property</p>
                  </li>
                </NavLink>
              </ul>
              <div
                className={styles.auth}
                onClick={() => setShowAuthModal(!showAuthModal)}
              >
                <CgMenuGridO />

                {user ? (
                  <>
                    {user.photo === defaultImg ? (
                      <div className={styles["user__initials"]}>{initials}</div>
                    ) : (
                      <img
                        src={user.photo}
                        alt={user.first_name}
                        className={styles["user__img"]}
                      />
                    )}
                  </>
                ) : (
                  <FaRegUserCircle />
                )}

                {user && <BsDot className={styles.dot} />}
                <>
                  <div
                    className={
                      showAuthModal
                        ? `${styles["auth__popup"]} ${styles.show}`
                        : `${styles["auth__popup"]} `
                    }
                  >
                    {!user ? (
                      <div className={styles["auth_n_logged__in"]}>
                        <p>
                          <FiUserPlus />
                          <NavLink to="/auth/register">Sign up</NavLink>
                        </p>
                        <p>
                          <BiLogInCircle />
                          <NavLink to="/auth/login">Log in</NavLink>
                        </p>
                      </div>
                    ) : (
                      <div className={styles["auth_n_logged__in"]}>
                        <p onClick={() => navigate("user/dashboard")}>
                          <RiDashboardLine />
                          Dashboard
                        </p>
                        <p>
                          <BiLogInCircle />
                          <span onClick={logout}>Log Out</span>
                        </p>
                      </div>
                    )}
                  </div>
                </>
              </div>
            </div>
          </header>
        </>
      ) : null}

      {!location.pathname.includes("auth") && (
        <div className={styles["nav__bottom"]}>
          <ul>
            <NavLink to="/">
              <li>
                <BiHomeAlt />
                <p>Home</p>
              </li>
            </NavLink>
            <NavLink to="/all-properties">
              <li>
                <SiHomebridge />
                <p>Properties</p>
              </li>
            </NavLink>

            <NavLink to="/contact">
              <li>
                <MdOutlinePermContactCalendar />
                <p>Contact</p>
              </li>
            </NavLink>

            <NavLink to="/add-property">
              <li>
                <MdAddBusiness />
                <p>Add </p>
              </li>
            </NavLink>

            <AdminOnlyLink>
              <NavLink to="admin/view-properties">
                <li>
                  <div />
                  <button className={styles["admin__btn"]}>Admin</button>
                </li>
              </NavLink>
            </AdminOnlyLink>
          </ul>
        </div>
      )}
    </div>
  );
}
