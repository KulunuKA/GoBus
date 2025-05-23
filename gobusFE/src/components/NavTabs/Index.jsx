import React from "react";
import "./style.css";
import logo from "../../assets/images/logo-no-background.png";
import { useHashTab } from "../../hooks/useHashTab";

export default function NavTabs({
  pageName,
  pageIcon,
  tabList,
  initialTab = "upcomings",
}) {
  const activeTab = useHashTab(initialTab);

  const handleTabClick = (tabName) => {
    window.location.hash = tabName;
  };

  return (
    <>
      <div className="navTabs">
        <div className="navTabs-container">
          <div
            className="navTabs-logo"
            onClick={() => (window.location.href = "/")}
          >
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

          <div className="navTabs-page-title">
            <img src={pageIcon} alt="" />
            <p>{pageName}</p>
          </div>
        </div>
      </div>
    </>
  );
}
