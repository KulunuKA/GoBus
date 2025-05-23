import { DownOutlined, UpOutlined } from "@ant-design/icons";
import logo from "../../assets/images/logo-no-background.png";
import man from "../../assets/images/passenger.jpg";
import favourite from "../../assets/images/favourite.png";
import question from "../../assets/images/question.png";
import activity from "../../assets/images/activity.png";
import user from "../../assets/images/user.png";
import support from "../../assets/images/support.png";
import chatting from "../../assets/images/chatting.png";
import "./style.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearStorePassenger, passengerData } from "../../store/passengerSlice";
import { busOwnerData, clearStore } from "../../store/busOwnerSlice";
import { useLocation } from "react-router-dom";

export default function Navbar() {
  const [isBusinessOpen, setIsBusinessOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const passengerRedux = useSelector(passengerData);
  const busOwnerRedux = useSelector(busOwnerData);
  const [lastScroll, setLastScroll] = useState(0);
  const [visible, setVisible] = useState(true);
  const dispatch = useDispatch();

  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? "activeLink" : "");

  const role = passengerRedux?.role || busOwnerRedux?.role;

  const logout = () => {
    window.location.href = "/login";
    dispatch(clearStore());
    dispatch(clearStorePassenger());
  };

  function truncateUsername(username) {
    if (username.length > 14) {
      return username.substring(0, 14) + "...";
    }
    return username;
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScroll]);

  const username =
    passengerRedux?.username || busOwnerRedux?.authorityName || "User";

  return (
    <nav className={`navbar ${visible ? "visible" : "hidden"}`}>
      <div className="navbar-container">
        <div className="navbar-left">
          <div className="navbar-logo">
            <a href="/">
              <img src={logo} alt="logo image" />
            </a>
          </div>
          <div className="navbar-links">
            <a href="/" className={`nav-link  ${isActive("/")}`}>
              Home
            </a>
            <a
              href="/public-buses"
              className={`nav-link  ${isActive("/public-buses")}`}
            >
              Public
            </a>
            <a href="/special" className={`nav-link  ${isActive("/special")}`}>
              Special
            </a>
            <a href="#" className={`nav-link  ${isActive("/#")}`}>
              Shuttles
            </a>
            <div className="dropdown">
              <button
                onClick={() => {
                  setIsBusinessOpen(!isBusinessOpen);
                }}
                className="nav-link"
              >
                About{" "}
                {isBusinessOpen ? (
                  <UpOutlined className="dropdown-icon" />
                ) : (
                  <DownOutlined className="dropdown-icon" />
                )}
              </button>

              {isBusinessOpen && (
                <div className="dropdown-menu">
                  <a href="#" className="dropdown-link">
                    About us
                  </a>
                  <a href="#" className="dropdown-link">
                    Privacy policy
                  </a>
                  <a href="#" className="dropdown-link">
                    How GoBus works
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="navbar-right">
          <a href="/help" className={`nav-link  ${isActive("/help")}`}>
            Help
          </a>
          <div className="dropdown">
            {role ? (
              <button
                onClick={() => {
                  setIsUserDropdownOpen(!isUserDropdownOpen);
                }}
                className="user-button"
              >
                User{" "}
                {isUserDropdownOpen ? (
                  <UpOutlined className="dropdown-icon" />
                ) : (
                  <DownOutlined className="dropdown-icon" />
                )}
              </button>
            ) : (
              <a href="/login" className="nav-link">
                Sign in
              </a>
            )}

            <div
              className={`user-dropdown-menu ${
                isUserDropdownOpen ? "show" : ""
              }`}
            >
              <div className="user-data-dropdown">
                <div className="user-name-image-dropdown">
                  <div className="user-name-dropdown">
                    <h2>{truncateUsername(username)}</h2>
                  </div>
                  <div className="user-image-dropdown">
                    <img src={man} alt="" />
                  </div>
                </div>
                <div className="user-data-btn-dropdown">
                  <div className="user-data-btn">
                    <a href="/help">
                      <img src={question} alt="" />
                      <p>Help</p>
                    </a>
                  </div>
                  <div className="user-data-btn">
                    <a href="#">
                      <img src={favourite} alt="" />
                      <p>Favourite</p>
                    </a>
                  </div>
                  <div className="user-data-btn">
                    <a href="/activity">
                      <img src={activity} alt="" />
                      <p>Activity</p>
                    </a>
                  </div>
                </div>
              </div>
              <div className="hr-line"></div>
              <div className="user-dropdown-links">
                <a href="/userprofile" className="dropdown-link">
                  <img src={user} alt="" />
                  <p>Manage Account</p>
                </a>
                <a href="#" className="dropdown-link">
                  <img src={chatting} alt="" />
                  <p>Messages</p>
                </a>
                <a
                  href="/customer-support/support-inbox"
                  className="dropdown-link"
                >
                  <img src={support} alt="" />
                  <p>Support Inbox</p>
                </a>
              </div>
              <div className="user-dropdown-btn" onClick={logout}>
                <button>Sign out</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
