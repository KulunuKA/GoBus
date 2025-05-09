import React, { useState, useEffect } from "react";
import "./style.css";
import PieCharts from "../../components/PieChart";
import { getPassengersAD, getAuthoritiesAD } from "../../apis/adminAPIs";
import Loading from "../../components/Loading";

export default function AdminDashboard() {
  const [passengers, setPassengers] = useState([]);
  const [authorities, setAuthorities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [userData, setUserData] = useState([
    { name: "Passengers", value: 0, color: "#7BC4A0" },
    { name: "Bus Owners", value: 0, color: "#05944F" },
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

  useEffect(() => {
    fetchPassengers();
    fetchAuthorities();
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
            <PieCharts data={userData} title={"Bus Insights"} />{" "}
            {/* You might want different data for this chart */}
          </div>
          {/* You can add more chart cards here */}
        </div>
        {/* You can add other relevant information or components here */}
      </main>
    </div>
  );
}
