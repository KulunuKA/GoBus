import React, { useState, useEffect } from "react";
import logo from "../../assets/images/logo-color.png";
import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdDashboard, MdOutlineRoute } from "react-icons/md";
import { FaBusAlt } from "react-icons/fa";
import { GrUserWorker } from "react-icons/gr";
import { TbMessagePlus } from "react-icons/tb";
import { ExclamationCircleFilled, LogoutOutlined } from "@ant-design/icons";

import "./style.css";
import MyButton from "../button";
import { busOwnerData, clearStore } from "../../store/busOwnerSlice";

export default function SideBar() {
  const [tab, setTab] = useState("dashboard");
  const busOwnerRedux = useSelector(busOwnerData);
  const tablist = [
    {
      name: "dashboard",
      title: "Dashboard",
      query: "dashboard",
      icon: <MdDashboard />,
    },
    {
      name: "bus",
      title: "Bus",
      query: "bus",
      icon: <FaBusAlt />,
    },
    {
      name: "route",
      title: "Route",
      query: "route",
      icon: <MdOutlineRoute />,
    },
    {
      name: "employee",
      title: "Employee",
      query: "employee",
      icon: <GrUserWorker />,
    },
    {
      name: "requests",
      title: "Requests",
      query: "requests",
      icon: <TbMessagePlus />,
    },
  ];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { confirm } = Modal;

  const logout = () => {
    window.location.href = "/login";
    dispatch(clearStore());
  };

  useEffect(() => {
    const path = window.location.pathname.split("/")[2];
    setTab(path);
  }, []);

  return (
    <div className="sidebar">
      <img src={logo} alt="" className="s-logo" />
      <div className="profile">
        <img src={busOwnerRedux.logo} alt="Logo" />
        <section>
          <h3>{busOwnerRedux.authorityName}</h3>
          <p>{busOwnerRedux.email}</p>
        </section>
      </div>
      <div className="tabs">
        <ul>
          {tablist.map((e) => (
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

      <MyButton
        name="Logout"
        color={"#e74c3c"}
        width={"200px"}
        onClick={() => {
          confirm({
            title: "Are you sure?",
            icon: <ExclamationCircleFilled />,
            content: "Do you want to log out?",
            onOk() {
              logout();
            },
            onCancel() {},
          });
        }}
        icon={<LogoutOutlined />}
      />
      <div className="dashboard-copyright">
        <p>© 2025 - GoBus Digital Mobility Solutions Limited.</p>
      </div>
    </div>
  );
}
