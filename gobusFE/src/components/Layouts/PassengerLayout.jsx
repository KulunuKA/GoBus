import React from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { Outlet, useLocation } from "react-router-dom";

export default function PassengerLayout() {
  const location = useLocation();

  const isUserProfile = location.pathname.startsWith("/userProfile");

  const hideNavBar =
    location.pathname.startsWith("/userProfile") ||
    location.pathname.startsWith("/trips");

  return (
    <main className="main">
      {!hideNavBar && <Navbar />}
      <Outlet />
      {!isUserProfile && <Footer />}
    </main>
  );
}
