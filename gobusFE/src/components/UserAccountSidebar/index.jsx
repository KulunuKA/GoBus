import React from "react";
import "./style.css";
import { useHashTab } from "../../hooks/useHashTab.js";

export default function UserAccountSidebar() {
  const activatedTab = useHashTab("user");

  const tablist = [
    {
      name: "user",
      title: "Home",
    },
    {
      name: "account",
      title: "Personal Info",
    },
    {
      name: "security",
      title: "Security",
    },
    {
      name: "activities",
      title: "Activities",
    },
  ];
  const handleTabClick = (tabName) => {
    window.location.hash = tabName;
  };

  return (
    <>
      <div className="account-sidebar">
        <div className="account-sidebar-tabs">
          <ul>
            {tablist.map((tab) => (
              <li
                className={activatedTab === tab.name ? "active" : ""}
                key={tab.name}
                onClick={() => {
                  handleTabClick(tab.name);
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
