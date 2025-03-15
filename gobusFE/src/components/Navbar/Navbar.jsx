import { DownOutlined, UpOutlined } from "@ant-design/icons";
import logo from "../../assets/images/logo-no-background.png";
import "./style.css";
import { useState } from "react";

export default function Navbar() {
  const [isBusinessOpen, setIsBusinessOpen] = useState(false);

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
                Business{" "}
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
            <button className="user-button">
              User <DownOutlined className="dropdown-icon" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
