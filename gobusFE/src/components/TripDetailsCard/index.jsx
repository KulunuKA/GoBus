import React, { useState } from "react";
import "./style.css";
import { Modal, notification } from "antd";
import { cancelTrip, updateTrip } from "../../apis/passengerAPIs";

export default function TripDetailsCard({ trip, refresh }) {
  const [showPopup, setShowPopup] = useState(false);
  const [tripDetails, setTripDetails] = useState({
    userID: trip.userID,
    busId: trip.busID._id,
    venue: trip.venue,
    days: trip.days,
    date: trip.date,
    type: trip.type,
    contact_no: trip.contact_no,
    description: trip.description,
  });
  const [isEditing, setIsEditing] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const isUpcoming =
    tripDetails.status === "approved" && tripDetails.date >= today;

  const getStatusColor = (status) => {
    if (status === "approved") return "rgba(5, 148, 79, 1)";
    if (status === "pending") return "rgba(255, 140, 0, 1)";
    if (status === "rejected") return "rgba(200, 30, 50, 1)";
    return "gray";
  };

  const handleSaveClick = async () => {
    try {
      if (
        !tripDetails.venue ||
        !tripDetails.days ||
        !tripDetails.date ||
        !tripDetails.contact_no
      ) {
        notification.error({
          message: "All fields are required!",
        });
      }

      const { data, code, msg } = await updateTrip(trip._id, tripDetails);
      if (code === 0) {
        notification.success({
          message: "Trip updated successfully!",
        });
        refresh();
        setShowPopup(false);
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Something went wrong!",
      });
    }
  };

  const deleteTrip = async () => {
    try {
      const { data, code, msg } = await cancelTrip(trip._id);
      if (code === 0) {
        notification.success({
          message: "Trip deleted successfully!",
        });
        refresh();
        setShowPopup(false);
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Something went wrong!",
      });
    }
  };

  return (
    <>
      <div
        key={trip.id}
        className="trip-card-container"
        onClick={() => setShowPopup(true)}
      >
        <div className="trip-card-content">
          <div
            className={`trip-status-indicator ${isUpcoming ? "flashing" : ""}`}
            style={{ backgroundColor: getStatusColor(trip.status) }}
          ></div>

          <div className="trip-card-title-section">
            <p className="trip-card-title">
              A {tripDetails.days} days {tripDetails.type} to{" "}
              {tripDetails.venue}.
            </p>
          </div>
          <div className="trip-card-details">
            <div className="trip-details">
              <p>Bus: {trip.busID.busNumber}</p>
              <p>Date: {tripDetails?.date.split("T")[0]}</p>
            </div>
          </div>
        </div>
      </div>

      {
        <Modal
          open={showPopup}
          footer={null}
          onCancel={() => setShowPopup(false)}
        >
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
                  value={tripDetails.venue}
                  onChange={(e) =>
                    setTripDetails({ ...tripDetails, venue: e.target.value })
                  }
                />
              ) : (
                <p className="trips-popup-detail-data">{tripDetails.venue}</p>
              )}
            </div>
            <div className="trips-popup-detail-field">
              <p className="trips-popup-detail-label">Duration:</p>
              {isEditing ? (
                <input
                  className="editing-mode"
                  type="number"
                  min="1"
                  value={tripDetails.days}
                  onChange={(e) =>
                    setTripDetails({ ...tripDetails, days: e.target.value })
                  }
                />
              ) : (
                <p className="trips-popup-detail-data">
                  {tripDetails.days} {tripDetails.days !== 1 ? "days" : "day"}
                </p>
              )}
            </div>
            <div className="trips-popup-detail-field">
              <p className="trips-popup-detail-label">Contact No:</p>
              {isEditing ? (
                <input
                  className="editing-mode"
                  type="number"
                  min="1"
                  value={tripDetails.contact_no}
                  onChange={(e) =>
                    setTripDetails({
                      ...tripDetails,
                      contact_no: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="trips-popup-detail-data">
                  {tripDetails.contact_no}
                </p>
              )}
            </div>
            <div className="trips-popup-detail-field">
              <p className="trips-popup-detail-label">Type:</p>
              <p className="trips-popup-detail-data">{tripDetails.type}</p>
            </div>
            <div className="trips-popup-detail-field">
              <p className="trips-popup-detail-label">Bus Number:</p>
              <p className="trips-popup-detail-data">{trip.busID.busNumber}</p>
            </div>
            <div className="trips-popup-detail-field">
              <p className="trips-popup-detail-label">Date:</p>
              {isEditing ? (
                <input
                  className="editing-mode"
                  type="date"
                  value={tripDetails.date?.split("T")[0]}
                  min={today}
                  onChange={(e) =>
                    setTripDetails({ ...tripDetails, date: e.target.value })
                  }
                />
              ) : (
                <p className="trips-popup-detail-data">
                  {tripDetails.date?.split("T")[0]}
                </p>
              )}
            </div>
            <div className="trips-popup-detail-field">
              <p className="trips-popup-detail-label ">Req. Note:</p>
              <p className="trips-popup-detail-data long-data-field">
                {tripDetails.note}
              </p>
            </div>

            {trip.status !== "pending" && (
              <div className="trips-popup-detail-field">
                <p className="trips-popup-detail-label ">Req. Reply:</p>
                <p className="trips-popup-detail-data long-data-field">
                  {tripDetails.reply}
                </p>
              </div>
            )}

            {trip.status === "pending" && (
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
                    <div className="trips-popup-btn-cancle" onClick={deleteTrip}>
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
                      onClick={() => setIsEditing(false)}
                    >
                      <p>Cancel</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </Modal>
      }
    </>
  );
}
