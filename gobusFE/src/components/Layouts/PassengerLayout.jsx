import React from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";

export default function PassengerLayout() {
  return (
    <main className="main">
      <Navbar />
      <Outlet />
      <Footer />
    </main>
  );
}
