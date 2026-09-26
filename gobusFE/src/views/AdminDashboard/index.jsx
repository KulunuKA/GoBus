import React, { useState, useEffect } from "react";
import "./style.css";
import PieCharts from "../../components/PieChart";
import { getPassengersAD, getAuthoritiesAD } from "../../apis/adminAPIs";
import Loading from "../../components/Loading";
import { getPublicBuses, getSpecialBuses } from "../../apis/passengerAPIs";

export default function AdminDashboard() {
  const [passengers, setPassengers] = useState([]);
  const [authorities, setAuthorities] = useState([]);
  const [publicBusses, setPublicBusses] = useState([]);
  const [specialBusses, setSpecialBusses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [userData, setUserData] = useState([
    { name: "Passengers", value: 0, color: "#7BC4A0" },
    { name: "Bus Owners", value: 0, color: "#05944F" },
  ]);
  const [busData, setBusData] = useState([
    { name: "Public Service", value: 0, color: "#7BC4A0" },
    { name: "Special Service", value: 0, color: "#05944F" },
  ]);

  const fetchAuthorities = async () => {
    try {
      setIsError("");
      setLoading(true);
      const { data, code, msg } = await getAuthoritiesAD();
      if (code === 0) {
        setAuthorities(data);
      } else {
        setIsError(msg || "Failed to fetch authorities.");
      }
    } catch (error) {
      setIsError("Something went wrong while fetching authorities!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPassengers = async () => {
    try {
      setIsError("");
      setLoading(true);
      const { data, code, msg } = await getPassengersAD();
      if (code === 0) {
        setPassengers(data);
      } else {
        setIsError(msg || "Failed to fetch passengers.");
      }
    } catch (error) {
      setIsError("Something went wrong while fetching passengers!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPublicBuses = async (
    type = "public transport",
    start,
    end,
    condition
  ) => {
    try {
      setIsError("");
      setLoading(true);
      const { data, code, msg } = await getPublicBuses(
        type,
        start,
        end,
        condition
      );
      if (code === 0) {
        setPublicBusses(data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setIsError("Something went wrong!");
      console.log(error);
    }
  };

  const fetchSpecialBuses = async (type = "special service", dis, cit) => {
    try {
      setIsError("");
      setLoading(true);
      const { data, code, msg } = await getSpecialBuses(type, dis, cit);
      if (code === 0) {
        setSpecialBusses(data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setIsError("Something went wrong!");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPassengers();
    fetchAuthorities();
    fetchPublicBuses();
    fetchSpecialBuses();
  }, []);

  useEffect(() => {
    setUserData([
      {
        name: "Passengers",
        value: passengers.length,
        color: "#7BC4A0",
      },
      {
        name: "Bus Owners",
        value: authorities.length,
        color: "#05944F",
      },
    ]);

    setBusData([
      { name: "Public Service", value: publicBusses.length, color: "#7BC4A0" },
      {
        name: "Special Service",
        value: specialBusses.length,
        color: "#05944F",
      },
    ]);
  }, [passengers, authorities]);

  if (loading) {
    return <Loading />;
  }

  if (isError) {
    return <div className="error-message">Error: {isError}</div>;
  }

  return (
    <div className="admin-dashboard-container">
      <main className="admin-main-content">
        <header className="admin-header">
          <h1>Admin Dashboard</h1>
        </header>
        <div className="ad-main-charts">
          <div className="chart-card">
            <h3>Total Users</h3>
            <PieCharts data={userData} title={"User Insights"} />
          </div>
          <div className="chart-card">
            <h3>Total Buses</h3>
            <PieCharts data={busData} title={"Bus Insights"} />{" "}
          </div>
        </div>
      </main>
    </div>
  );
}
