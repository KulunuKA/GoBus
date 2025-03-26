import React from "react";
import "./style.css";
import start from "../../assets/images/departures.png";
import end from "../../assets/images/arrivals.png";

export default function PublicBusRouteCard({ route }) {
  const getStatusColor = (status) => {
    if (status === "In Route") return "#05944F";
    if (status === "In Stand") return "#F28C28";
    if (status === "Not Working") return "#D12C2C";
    return "gray";
  };

  return (
    <>
      <div
        key={`${route.bus.id} ${route.route.id} ${route.route.time}`}
        className="public-bus-card-box"
      >
        <div className="public-bus-card-content">
          <div
            className={`public-bus-card-status-indicator ${
              route.bus.status === "In Route" ? "flashing" : ""
            }`}
            style={{ backgroundColor: getStatusColor(route.bus.status) }}
          ></div>
          <div className="public-bus-card-bus-name">
            <h2>{route.bus.name}</h2>
          </div>
          <div className="public-bus-card-route-details">
            <div className="public-bus-card-route-details-from-to">
              <p className="public-bus-card-route-details-location">
                From: <span>{route.route.starting}</span>
              </p>
              <span className="public-bus-card-route-details-times">
                <p className="public-bus-card-route-details-time">
                  {route.route.time}
                </p>
                <img src={start} alt="" />
              </span>
            </div>
            <div className="public-bus-card-route-details-from-to">
              <p className="public-bus-card-route-details-location">
                To: <span>{route.route.end}</span>
              </p>
              <span className="public-bus-card-route-details-times">
                <p className="public-bus-card-route-details-time">
                  {route.route.arrivalTime}
                </p>
                <img src={end} alt="" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
