import React from "react";
import "./style.css";
import logo from "../../assets/images/logo-no-background.png";
import { useHashTab } from "../../hooks/useHashTab";

export default function NavTabs({ pageName, pageIcon, tabList }) {
  const activeTab = useHashTab("upcomings");

  const handleTabClick = (tabName) => {
    window.location.hash = tabName;
  };

  return (
    <>
      <div className="navTabs">
        <div className="navTabs-container">
          <div className="navTabs-logo">
            <img src={logo} alt="" />
          </div>
          <div className="navTabs-tabs">
            {tabList.map((tab) => (
              <div
                key={tab.tabName}
                className={`navTabs-tab ${
                  activeTab === tab.tabName ? "activeTab" : ""
                }`}
                onClick={() => {
                  handleTabClick(tab.tabName);
                }}
              >
                <p>{tab.name}</p>
              </div>
            ))}
          </div>
          <div className="navTabs-page-signout">
            <p>Sign Out</p>
          </div>
          <div className="navTabs-page-title">
            <img src={pageIcon} alt="" />
            <p>{pageName}</p>
          </div>
        </div>
      </div>
    </>
  );
}
