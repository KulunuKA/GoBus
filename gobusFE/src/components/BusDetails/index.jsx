import React from "react";
import { Modal } from "antd";
import "./style.css";
import MyButton from "../button";

export default function BusDetails({ isOpen, onClose, bus }) {
  const key_values = [
    { key: "Bus Number", value: bus.busNumber },
    { key: "Bus Type", value: bus.busType },
    { key: "Seat Number", value: bus.seatNumber },
    { key: "City", value: bus.city },
    { key: "District", value: bus.district },
    { key: "AC", value: bus.ac ? "Yes" : "No" },
    {
      key: "Driver ID",
      value: bus.driverID == null ? "Not Assign" : bus.driverID,
    },
    { key: "Password", value: bus.password },
  ];
  return (
    <>
      <Modal open={isOpen} onCancel={onClose} footer={null}>
        <div className="bus-details">
          <div className="bd-header">
            <p>Bus Details</p>
          </div>
          <div className="bd-content">
            <div>
              <div className="bus-pictures-container">
                {bus?.pictures
                  .filter((e) => e != "")
                  .map((pic, index) => (
                    <img src={pic} key={index} />
                  ))}
              </div>
              {key_values.map((item, index) => (
                <div key={index} className="bd-content-item">
                  <p>{item.key} : </p>
                  <p>{item.value}</p>
                </div>
              ))}
            </div>
            {bus.start_trip && <MyButton name="View on map" />}
          </div>
        </div>
      </Modal>
    </>
  );
}
