import { useState } from "react";
import "./style.css";
import UserAccountSidebar from "../UserAccountSidebar/index";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import PassengerProfile from "../../views/PassengerProfile/index";
import PassengerAccount from "../../views/PassengerAccount/index";
import PassengerSecurity from "../../views/PassengerSecurity/index";
import PassengerActivities from "../../views/PassengerActivities/index";

export default function UserAccount() {
  return (
    <>
      <div className="user-account-header">
        <p>GoBus Account</p>
      </div>
      <div className="user-account-section">
        <UserAccountSidebar />
        <div className="user-account-content">
          <Routes>
            <Route path="/" element={<Navigate to="user" />} />
            <Route path="user" element={<PassengerProfile />} />
            <Route path="account" element={<PassengerAccount />} />
            <Route path="account" element={<PassengerAccount />} />
            <Route path="security" element={<PassengerSecurity />} />
            <Route path="activities" element={<PassengerActivities />} />
          </Routes>
          <Outlet />
        </div>
      </div>
    </>
  );
}
