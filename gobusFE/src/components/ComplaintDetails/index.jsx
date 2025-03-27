import React, { useState } from "react";
import { Modal } from "antd";
import "./style.css";

export default function ComplaintDetails({ isOpen, onClose, complaint }) {
  const key_values = [
    { key: "Complaint Id", value: complaint.complaintId },
    { key: "User Id", value: complaint.userId },
    { key: "About", value: complaint.about },
    { key: "Date", value: complaint.date },
    { key: "Description", value: complaint.description },
    { key: "Status", value: complaint.status },
  ];

  const [values, setValues] = useState(key_values);

  const handleChecked = () => {
    setValues((prev) =>
      prev.map((item) =>
        item.key === "Status" ? { ...item, value: "Resolved" } : item
      )
    );
  };
  return (
    <>
      <Modal open={isOpen} onCancel={onClose} footer={null}>
        <div className="complaint-details">
          <div className="cd-header">
            <p>Complaint Details</p>
          </div>
          <div className="cd-content">
            <div>
              {values.map((item, index) => (
                <div
                  key={index}
                  className={`cd-content-item ${
                    item.key === "Description" ? "des-content" : ""
                  }`}
                >
                  <p>{item.key} : </p>
                  <p>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mark-as-checked">
          <p onClick={handleChecked}>Mark as Resolved</p>
        </div>
      </Modal>
    </>
  );
}
