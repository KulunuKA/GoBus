import React from "react";
import "./style.css";
import UserAccountSidebar from "../../components/UserAccountSidebar/index";
import PassengerProfile from "../PassengerProfile/index";
import PassengerAccount from "../PassengerAccount/index";
import PassengerSecurity from "../PassengerSecurity/index";
import PassengerActivities from "../PassengerActivities/index";
import { useHashTab } from "../../hooks/useHashTab";

export default function UserAccount() {
  const activatedTab = useHashTab("user");
  return (
    <>
      <div className="user-account-header">
        <p>GoBus Account</p>
      </div>
      <div className="user-account-section">
        <div className="user-account-sidebar">
          <UserAccountSidebar />
        </div>
        <div className="user-account-content">
          {activatedTab === "user" && <PassengerProfile />}
          {activatedTab === "account" && <PassengerAccount />}
          {activatedTab === "security" && <PassengerSecurity />}
          {activatedTab === "activities" && <PassengerActivities />}
        </div>
      </div>
    </>
  );
}
