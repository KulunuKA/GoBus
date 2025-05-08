import React, { useState, useEffect } from "react";
import "./style.css";
import logo from "../../assets/images/logo-color.png";
import admin from "../../assets/images/admin.jfif";
import { GoSignOut } from "react-icons/go";
import MyInput from "../input";
import { SearchOutlined } from "@ant-design/icons";
import { FaBusAlt, FaUsers, FaUsersCog } from "react-icons/fa";
import { MdContactSupport, MdDashboard, MdOutlineRoute } from "react-icons/md";
import { LuBadgeAlert } from "react-icons/lu";
import { IoIosMore, IoIosNotifications, IoMdSettings } from "react-icons/io";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function ControllPanel() {
  const [tab, setTab] = useState("dashboard");
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);

  const adminData = {
    username: "dilshan02kr",
    image: admin,
    name: "Dilshan Karunarathna",
  };

  const handleshowMore = () => {
    setShowMore((prev) => !prev);
  };

  const tablistA = [
    {
      name: "dashboard",
      title: "Dashboard",
      query: "dashboard",
      icon: <MdDashboard />,
    },
    {
      name: "passengers",
      title: "Passenger Management",
      query: "passengers",
      icon: <FaUsers />,
    },
    {
      name: "authorities",
      title: "Authority Management",
      query: "authorities",
      icon: <FaUsersCog />,
    },
    {
      name: "buses",
      title: "Bus Inventory",
      query: "buses",
      icon: <FaBusAlt />,
    },
    {
      name: "routes",
      title: "Route Management",
      query: "routes",
      icon: <MdOutlineRoute />,
    },
    {
      name: "complaints",
      title: "Complaints",
      query: "complaints",
      icon: <LuBadgeAlert />,
    },
  ];

  const tablistB = [
    {
      name: "chatRoom",
      title: "Chat Room",
      query: "chatRoom",
      icon: <IoChatbubbleEllipsesSharp />,
    },
    {
      name: "support",
      title: "Help & Support",
      query: "supports",
      icon: <MdContactSupport />,
    },
    {
      name: "settings",
      title: "Settings",
      query: "settings",
      icon: <IoMdSettings />,
    },
  ];

  useEffect(() => {
    const path = window.location.pathname.split("/")[2];
    setTab(path);
  }, []);

  return (
    <>
      <div className="controll-panel">
        <div className="panel-logo-section">
          <img src={logo} alt="" className="panel-logo" />
        </div>
        <div className="panel-searchbar">
          <MyInput
            placeholder="Search"
            prefix={<SearchOutlined style={{ color: "#2D3436" }} />}
            borderRadius="50px"
            backgroundColor="transparent"
            borderColor="#2D3436"
          />
        </div>
        <div className="panel-tabs">
          <ul>
            {tablistA.map((e) => (
              <li
                key={e.name}
                className={tab === e.name ? "active" : ""}
                onClick={() => {
                  setTab(e.name);
                  navigate(`${e.query}`);
                }}
              >
                <div>{e.icon}</div>
                <span>{e.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="panel-seperator"></div>
        <div className="panel-tabs">
          <ul>
            {tablistB.map((e) => (
              <li
                key={e.name}
                className={tab === e.name ? "active" : ""}
                onClick={() => {
                  setTab(e.name);
                  navigate(`${e.query}`);
                }}
              >
                <div>{e.icon}</div>
                <span>{e.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="panel-profile-section">
          <div className="panel-admin-profil">
            <img src={adminData.image} alt="" />
            <p>{adminData.username}</p>
          </div>
          <IoIosMore
            style={{ color: "#2D3436", cursor: "pointer", fontSize: "20px" }}
            onClick={handleshowMore}
            className="admin-more-btn"
          />
        </div>
      </div>
      {showMore && (
        <div className="showmore-section">
          <ul>
            <li>
              <p>{adminData.name}</p>
            </li>
            <li>
              <p className="logout-btn-admin">Log out</p>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
