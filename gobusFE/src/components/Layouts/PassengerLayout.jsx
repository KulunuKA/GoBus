import React from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { Outlet, useLocation } from "react-router-dom";

export default function PassengerLayout() {
  const location = useLocation();
  const pathName = location.pathname;
  const hidePages = [
    "/userprofile",
    "/activity",
    "/customer-support/support-inbox",
  ];

  const hideNavBar = hidePages.includes(pathName);

  return (
    <main className="main">
      {!hideNavBar && <Navbar />}
      <Outlet />
      {!pathName.includes("/userprofile") && <Footer />}
    </main>
  );
}
