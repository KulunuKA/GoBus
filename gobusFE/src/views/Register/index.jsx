import React from "react";
import { useParams } from "react-router-dom";
import Passenger from "./Passenger";
import BusOwner from "./BusOwner";

export default function Register() {
  const { role } = useParams();

  return <>{role === "passenger" ? <Passenger /> : <BusOwner />}</>;
}
