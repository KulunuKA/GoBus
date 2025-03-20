import React, { useState, useEffect } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";

export default function UserAccountSidebar() {
  const [selectedTab, setSelectedTab] = useState("user");

  const navigate = useNavigate();
  const tablist = [
    {
      name: "user",
      title: "Home",
      query: "user",
    },
    {
      name: "account",
      title: "Personal Info",
      query: "account",
    },
    {
      name: "security",
      title: "Security",
      query: "security",
    },
    {
      name: "activities",
      title: "Activities",
      query: "activities",
    },
  ];

  useEffect(() => {
    const path = window.location.pathname.split("/")[2];
    setSelectedTab(path || "user");
  }, []);

  return (
    <>
      <div className="account-sidebar">
        <div className="account-sidebar-tabs">
          <ul>
            {tablist.map((tab) => (
              <li
                className={selectedTab === tab.name ? "active" : ""}
                key={tab.name}
                onClick={() => {
                  setSelectedTab(tab.name);
                  navigate(`/userProfile/${tab.query}`);
                }}
              >
                <span>{tab.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
