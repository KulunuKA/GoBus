import React from "react";
import "./style.css";
import UserAccountSidebar from "../../components/UserAccountSidebar/index";
import PassengerProfile from "../PassengerProfile/index";
import PassengerAccount from "../PassengerAccount/index";
import PassengerSecurity from "../PassengerSecurity/index";
import PassengerActivities from "../PassengerActivities/index";
import { useHashTab } from "../../hooks/useHashTab";
import { useNavigate } from "react-router-dom";

export default function UserAccount() {
  const navigate = useNavigate();

  const activatedTab = useHashTab("user");
  return (
    <>
      <div className="user-account-header">
        <p
          onClick={() => {
            navigate("/");
          }}
        >
          GoBus Account
        </p>
      </div>
      <div className="user-account-section">
        <div className="user-account-sidebar">
          <UserAccountSidebar />
        </div>
        <div className="user-account-content">
          {activatedTab === "user" && <PassengerProfile />}
          {activatedTab === "account" && (
            <PassengerAccount selectedTab={activatedTab} />
          )}
          {activatedTab === "security" && (
            <PassengerAccount selectedTab={activatedTab} />
          )}
          {activatedTab === "activities" && <PassengerActivities />}
        </div>
      </div>
    </>
  );
}
