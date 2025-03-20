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
import { useState } from "react";
import { useSelector } from "react-redux";
import { passengerData } from "../../store/passengerSlice";
import { busOwnerData } from "../../store/busOwnerSlice";

export default function Navbar() {
  const [isBusinessOpen, setIsBusinessOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const passengerRedux = useSelector(passengerData);
  const busOwnerRedux = useSelector(busOwnerData);

  const role = passengerRedux?.role || busOwnerRedux?.role || "passenger";

  function truncateUsernmae(username) {
    if (username.length > 14) {
      return username.substring(0, 14) + "...";
    }
    return username;
  }

  const truncatedUsername = truncateUsernmae("Dilshan Karunarathna");

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <div className="navbar-logo">
            <a href="#">
              <img src={logo} alt="logo image" />
            </a>
          </div>
          <div className="navbar-links">
            <a href="#" className="nav-link">
              Public
            </a>
            <a href="#" className="nav-link">
              Special
            </a>
            <a href="#" className="nav-link">
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
          <a href="#" className="nav-link">
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
                    <h2>{truncatedUsername}</h2>
                  </div>
                  <div className="user-image-dropdown">
                    <img src={man} alt="" />
                  </div>
                </div>
                <div className="user-data-btn-dropdown">
                  <div className="user-data-btn">
                    <a href="#">
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
                    <a href="#">
                      <img src={activity} alt="" />
                      <p>Activity</p>
                    </a>
                  </div>
                </div>
              </div>
              <div className="hr-line"></div>
              <div className="user-dropdown-links">
                <a href="#" className="dropdown-link">
                  <img src={user} alt="" />
                  <p>Manage Account</p>
                </a>
                <a href="#" className="dropdown-link">
                  <img src={chatting} alt="" />
                  <p>Messages</p>
                </a>
                <a href="#" className="dropdown-link">
                  <img src={support} alt="" />
                  <p>Support Inbox</p>
                </a>
              </div>
              <div className="user-dropdown-btn">
                <button>Sign out</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
