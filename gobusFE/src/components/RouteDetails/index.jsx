import React from "react";
import { Modal } from "antd";
import "./style.css";

export default function RouteDetails({ isOpen, onClose, route }) {
  const key_values = [
    { key: "Route Number", value: route.route_number },
    { key: "Distance", value: route.distance },
    { key: "Start Trip", value: route.start },
    { key: "End Trip", value: route.end },
    { key: "Main Cities", value: route.main_cities.join(", ") },
  ];
  return (
    <>
      <Modal open={isOpen} onCancel={onClose} footer={null}>
        <div className="route-details">
          <div className="bd-header">
            <p>Route Details</p>
          </div>
          <div className="bd-content">
            <div>
              {key_values.map((item, index) => (
                <div key={index} className="bd-content-item">
                  <p>{item.key} : </p>
                  <p>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
