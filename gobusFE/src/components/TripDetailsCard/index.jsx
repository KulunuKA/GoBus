import React, { useState } from "react";
import "./style.css";

export default function TripDetailsCard({ trip }) {
  const [showPopup, setShowPopup] = useState(false);
  const [tripDetails, setTripDetails] = useState(trip);
  const [isEditing, setIsEditing] = useState(false);
  const [tempDetails, setTempDetails] = useState({
    to: tripDetails.to,
    days: tripDetails.days,
    date: tripDetails.date,
  });

  const today = new Date().toISOString().split("T")[0];
  const isUpcoming =
    tripDetails.status === "approved" && tripDetails.date >= today;

  const getStatusColor = (status) => {
    if (status === "approved") return "green";
    if (status === "pendings") return "orange";
    if (status === "declined") return "red";
    return "gray";
  };

  const handleClose = () => {
    setShowPopup(false);
    setIsEditing(false);
  };

  const handleCancle = () => {
    setIsEditing(false);
    setTempDetails({
      to: tripDetails.to,
      days: tripDetails.days,
      date: tripDetails.date,
    });
  };

  const handleSaveClick = () => {
    if (window.confirm("Are you sure you want to save the changes?")) {
      setTripDetails((prev) => ({ ...prev, ...tempDetails }));
      setShowPopup(false);
      setIsEditing(false);
    }
  };

  return (
    <>
      <div
        key={tripDetails.id}
        className="trip-card-container"
        onClick={() => setShowPopup(true)}
      >
        <div className="trip-card-content">
          <div
            className={`trip-status-indicator ${isUpcoming ? "flashing" : ""}`}
            style={{ backgroundColor: getStatusColor(tripDetails.status) }}
          ></div>

          <div className="trip-card-title-section">
            <p className="trip-card-title">
              A {tripDetails.days} days {tripDetails.type} to {tripDetails.to}.
            </p>
          </div>
          <div className="trip-card-details">
            <div className="trip-details">
              <p>Bus: {tripDetails.bus.number}</p>
              <p>Date: {tripDetails.date}</p>
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="trips-popup-overlay" onClick={handleClose}>
          <div
            className="trips-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="trips-popup-close-btn" onClick={handleClose}>
              &times;
            </span>
            <div className="trips-popup-title">
              <h2>Trip Details</h2>
            </div>
            <div className="trips-popup-details">
              <div className="trips-popup-detail-field">
                <p className="trips-popup-detail-label">Destination:</p>
                {isEditing ? (
                  <input
                    className="editing-mode"
                    type="text"
                    value={tempDetails.to}
                    onChange={(e) =>
                      setTempDetails({ ...tempDetails, to: e.target.value })
                    }
                  />
                ) : (
                  <p className="trips-popup-detail-data">{tripDetails.to}</p>
                )}
              </div>
              <div className="trips-popup-detail-field">
                <p className="trips-popup-detail-label">Duration:</p>

                {isEditing ? (
                  <input
                    className="editing-mode"
                    type="number"
                    min="1"
                    value={tempDetails.days}
                    onChange={(e) =>
                      setTempDetails({ ...tempDetails, days: e.target.value })
                    }
                  />
                ) : (
                  <p className="trips-popup-detail-data">
                    {tripDetails.days} {tripDetails.days !== 1 ? "days" : "day"}
                  </p>
                )}
              </div>
              <div className="trips-popup-detail-field">
                <p className="trips-popup-detail-label">Type:</p>
                <p className="trips-popup-detail-data">{tripDetails.type}</p>
              </div>
              <div className="trips-popup-detail-field">
                <p className="trips-popup-detail-label">Bus Number:</p>
                <p className="trips-popup-detail-data">
                  {tripDetails.bus.number}
                </p>
              </div>
              <div className="trips-popup-detail-field">
                <p className="trips-popup-detail-label">Date:</p>
                {isEditing ? (
                  <input
                    className="editing-mode"
                    type="date"
                    value={tempDetails.date}
                    min={today}
                    onChange={(e) =>
                      setTempDetails({ ...tempDetails, date: e.target.value })
                    }
                  />
                ) : (
                  <p className="trips-popup-detail-data">{tripDetails.date}</p>
                )}
              </div>
              <div className="trips-popup-detail-field">
                <p className="trips-popup-detail-label ">Req. Note:</p>
                <p className="trips-popup-detail-data long-data-field">
                  {tripDetails.note}
                </p>
              </div>

              {tripDetails.status !== "pendings" && (
                <div className="trips-popup-detail-field">
                  <p className="trips-popup-detail-label ">Req. Reply:</p>
                  <p className="trips-popup-detail-data long-data-field">
                    {tripDetails.reply}
                  </p>
                </div>
              )}

              {tripDetails.status === "pendings" && (
                <div className="trips-popup-btn-section">
                  {!isEditing ? (
                    <>
                      <div
                        className="trips-popup-btn-edit"
                        onClick={() => {
                          setIsEditing(true);
                        }}
                      >
                        <p>Edit</p>
                      </div>
                      <div className="trips-popup-btn-cancle">
                        <p>Cancel Request</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="trips-popup-btn-edit"
                        onClick={() => {
                          handleSaveClick();
                        }}
                      >
                        <p>Save</p>
                      </div>
                      <div
                        className="trips-popup-btn-cancle"
                        onClick={handleCancle}
                      >
                        <p>Cancel</p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
