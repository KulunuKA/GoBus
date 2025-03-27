import React from "react";
import "./style.css";
import start from "../../assets/images/departures.png";
import end from "../../assets/images/arrivals.png";
import { convertTo12HourFormat } from "../../util/time_format";
import { useNavigate } from "react-router-dom";

export default function PublicBusRouteCard({ bus }) {
  const navigate = useNavigate();
  const getStatusColor = (status) => {
    if (status === "In Route") return "#05944F";
    if (status === "In Stand") return "#F28C28";
    if (status === "Not Working") return "#D12C2C";
    return "gray";
  };

  return (
    <>
      <div
        key={`${bus._id}`}
        className="public-bus-card-box"
        onClick={() => navigate(`/bus/${bus._id}`)}
      >
        <div className="public-bus-card-content">
          <div
            className={`public-bus-card-status-indicator ${
              bus.start_trip === "In Route" ? "flashing" : ""
            }`}
            style={{ backgroundColor: getStatusColor(bus.start_trip) }}
          ></div>
          <div className="public-bus-card-bus-name">
            <h2>{bus.name}</h2>
          </div>
          <div className="public-bus-card-route-details">
            <div className="public-bus-card-route-details-from-to">
              <p className="public-bus-card-route-details-location">
                From: <span>{bus.timetable[0].startPlace}</span>
              </p>
              <span className="public-bus-card-route-details-times">
                <p className="public-bus-card-route-details-time">
                  {convertTo12HourFormat(bus.timetable[0].startTime)}
                </p>
                <img src={start} alt="" />
              </span>
            </div>
            <div className="public-bus-card-route-details-from-to">
              <p className="public-bus-card-route-details-location">
                To: <span>{bus.timetable[0].endPlace}</span>
              </p>
              <span className="public-bus-card-route-details-times">
                <p className="public-bus-card-route-details-time">
                  {convertTo12HourFormat(bus.timetable[0].endTime)}
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
