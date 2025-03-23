import React from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { Outlet, useLocation } from "react-router-dom";

export default function PassengerLayout() {
  const location = useLocation();

  const isUserProfile = location.pathname.startsWith("/userProfile");

  return (
    <main className="main">
      {!isUserProfile && <Navbar />}
      <Outlet />
      {!isUserProfile && <Footer />}
    </main>
  );
}
