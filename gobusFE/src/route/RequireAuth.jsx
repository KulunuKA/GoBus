import React from "react";
import { useSelector } from "react-redux";
import { busOwnerData } from "../store/busOwnerSlice";
import { passengerData } from "../store/passengerSlice";
import { Navigate, Outlet } from "react-router-dom";

export default function RequireAuth({ allowedRole }) {
  const passengerRedux = useSelector(passengerData);
  const busOwnerRedux = useSelector(busOwnerData);

  const role = passengerRedux?.role || busOwnerRedux?.role;
  const hasAllowsRole =
    (passengerRedux?.role || busOwnerRedux?.role) && allowedRole.includes(role);

  return hasAllowsRole ? (
    <Outlet />
  ) : role ? (
    <Navigate to="/" />
  ) : (
    <Navigate to="/login" />
  );
}
