import React, { useState } from "react";
import "./style.css";
import location from "../../assets/images/location.png";
import submit from "../../assets/images/click.png";
import reservation from "../../assets/images/reservation.png";
import PassengerButton from "../../components/PassengerButton/index";
import { DatePicker, Input, InputNumber, Select, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import MyInput from "../input";

export default function BusAvailabilityLogic({ busDetails }) {
  const [showBookinFormPopup, setShowBookingFormPopup] = useState(true);

  return (
    <>
      {busDetails.type === "Public Transport" &&
        busDetails.currentStatus === "In Route" &&
        !busDetails.currentDetails.delay &&
        !busDetails.currentDetails.breakDown && (
          <PassengerButton
            name="Track Location"
            borderRadius="5px"
            fontSize="18px"
            fontWeight="500"
            icon={location}
          />
        )}
      {busDetails.type === "Public Transport" &&
        busDetails.currentStatus === "In Route" &&
        busDetails.currentDetails.delay &&
        !busDetails.currentDetails.breakDown && (
          <div className="information-with-btn">
            <p className="information-with-btn-para">
              Bus Delay: The bus will be delayed.
            </p>
            <div className="information-with-btn-btn">
              <PassengerButton
                name="Track Location"
                borderRadius="5px"
                fontSize="18px"
                fontWeight="500"
                icon={location}
              />
            </div>
          </div>
        )}
      {busDetails.type === "Public Transport" &&
        busDetails.currentStatus === "In Route" &&
        busDetails.currentDetails.breakDown && (
          <div className="information-with-btn">
            <p className="information-with-btn-para">
              Bus Breakdown: The bus has broken down.
            </p>
          </div>
        )}
      {busDetails.type === "Public Transport" &&
        busDetails.currentStatus === "In Stand" &&
        !busDetails.currentDetails.delay &&
        !busDetails.currentDetails.breakDown && (
          <div className="information-with-btn">
            <p className="information-with-btn-para">
              Bus Status: The bus is on time but has not started yet.
            </p>
          </div>
        )}
      {busDetails.type === "Public Transport" &&
        busDetails.currentStatus === "In Stand" &&
        busDetails.currentDetails.breakDown && (
          <div className="information-with-btn">
            <p className="information-with-btn-para">
              Bus Breakdown: The bus has broken down.
            </p>
          </div>
        )}
      {busDetails.type === "Public Transport" &&
        busDetails.currentStatus === "In Stand" &&
        busDetails.currentDetails.delay &&
        !busDetails.currentDetails.breakDown && (
          <div className="information-with-btn">
            <p className="information-with-btn-para">
              Bus Delay: The bus has not started yet and will be delayed.
            </p>
          </div>
        )}
      {busDetails.type === "Public Transport" &&
        busDetails.currentStatus === "Not Working" && (
          <div className="information-with-btn">
            <p className="information-with-btn-para">
              Bus Notice: The bus will not be operating today.
            </p>
          </div>
        )}
      {busDetails.type === "Special Trip" &&
        busDetails.currentStatus === "In Service" && (
          <PassengerButton
            name="Book For Special Trip"
            borderRadius="5px"
            fontSize="18px"
            fontWeight="500"
            icon={reservation}
          />
        )}
      {busDetails.type === "Special Trip" &&
        busDetails.currentStatus === "Not Working" && (
          <div className="information-with-btn">
            <p className="information-with-btn-para">
              Service Update: Special trip booking is temporarily unavailable.
            </p>
          </div>
        )}
      {busDetails.type === "Dual-Service" &&
        busDetails.currentStatus === "In Route" &&
        !busDetails.currentDetails.delay &&
        !busDetails.currentDetails.breakDown && (
          <div className="dual-service-btn-section">
            <PassengerButton
              name="Track Location"
              borderRadius="5px"
              fontSize="18px"
              fontWeight="500"
              icon={location}
            />
            <PassengerButton
              name="Book For Special Trip"
              borderRadius="5px"
              fontSize="18px"
              fontWeight="500"
              icon={reservation}
            />
          </div>
        )}
      {busDetails.type === "Dual-Service" &&
        busDetails.currentStatus === "In Route" &&
        busDetails.currentDetails.delay &&
        !busDetails.currentDetails.breakDown && (
          <div className="information-with-btn">
            <p className="information-with-btn-para">
              Bus Delay: The bus will be delayed.
            </p>
            <div className="dual-service-btn-section">
              <PassengerButton
                name="Track Location"
                borderRadius="5px"
                fontSize="18px"
                fontWeight="500"
                icon={location}
              />
              <PassengerButton
                name="Book For Special Trip"
                borderRadius="5px"
                fontSize="18px"
                fontWeight="500"
                icon={reservation}
              />
            </div>
          </div>
        )}
      {busDetails.type === "Dual-Service" &&
        busDetails.currentStatus === "In Route" &&
        busDetails.currentDetails.delay &&
        busDetails.currentDetails.breakDown && (
          <div className="information-with-btn">
            <p className="information-with-btn-para">
              Bus Breakdown: The bus has broken down.
            </p>
          </div>
        )}
      {busDetails.type === "Dual-Service" &&
        busDetails.currentStatus === "In Stand" &&
        busDetails.currentDetails.delay &&
        busDetails.currentDetails.breakDown && (
          <div className="information-with-btn">
            <p className="information-with-btn-para">
              Bus Breakdown: The bus has broken down.
            </p>
          </div>
        )}
      {busDetails.type === "Dual-Service" &&
        busDetails.currentStatus === "In Stand" &&
        !busDetails.currentDetails.delay &&
        !busDetails.currentDetails.breakDown && (
          <div className="information-with-btn">
            <p className="information-with-btn-para">
              Bus Status: The bus is on time but has not started yet.
            </p>
            <div className="information-with-btn-btn">
              <PassengerButton
                name="Book For Special Trip"
                borderRadius="5px"
                fontSize="18px"
                fontWeight="500"
                icon={reservation}
              />
            </div>
          </div>
        )}
      {busDetails.type === "Dual-Service" &&
        busDetails.currentStatus === "In Stand" &&
        busDetails.currentDetails.delay &&
        !busDetails.currentDetails.breakDown && (
          <div className="information-with-btn">
            <p className="information-with-btn-para">
              Bus Delay: The bus has not started yet and will be delayed.
            </p>
            <div className="information-with-btn-btn">
              <PassengerButton
                name="Book For Special Trip"
                borderRadius="5px"
                fontSize="18px"
                fontWeight="500"
                icon={reservation}
              />
            </div>
          </div>
        )}
      {busDetails.type === "Dual-Service" &&
        busDetails.currentStatus === "Not Working" && (
          <div className="information-with-btn">
            <p className="information-with-btn-para">
              Bus Notice: The bus will not be operating today and Special trip
              booking is temporarily unavailable.
            </p>
          </div>
        )}

      {showBookinFormPopup && (
        <div className="bookingForm-popup-overlay">
          <div className="bookingForm-popup-content">
            <span className="bookingForm-popup-close-btn">&times;</span>
            <div className="bookingForm-popup-title">
              <h2>Special Trip Request Form</h2>
            </div>
            <div className="bookingForm-popup-details">
              <div className="bookingForm-popup-detail-field">
                <MyInput
                  placeholder="Select a Date"
                  borderRadius="0"
                  label={"Date"}
                />
              </div>
              <div className="bookingForm-popup-detail-field">
                <MyInput
                  placeholder="Select a Date"
                  borderRadius="0"
                  label={"Type"}
                />
              </div>
              <div className="bookingForm-popup-detail-field">
                <MyInput
                  placeholder="Select a Date"
                  borderRadius="0"
                  label={"Destination"}
                />
              </div>
              <div className="bookingForm-popup-detail-field">
                <MyInput
                  placeholder="Select a Date"
                  borderRadius="0"
                  label={"Days"}
                />
              </div>
              <div className="bookingForm-popup-detail-field">
                <MyInput
                  placeholder="Select a Date"
                  borderRadius="0"
                  label={"Contact No:"}
                />
              </div>
              <div className="bookingForm-popup-detail-field">
                <p className="bookingForm-popup-detail-label">Description:</p>
                <div className="bookingForm-popup-detail-input-box">
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <TextArea
                      rows={4}
                      placeholder="maxLength is 6"
                      maxLength={6}
                    />
                  </Space>
                </div>
              </div>
              <div className="bookingForm-popup-detail-field">
                <PassengerButton name="Submit" fontWeight="500" icon={submit} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
