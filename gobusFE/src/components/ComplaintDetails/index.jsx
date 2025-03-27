import React, { useState } from "react";
import { Modal, notification } from "antd";
import "./style.css";
import { updateComplaintsAD } from "../../apis/adminAPIs";

export default function ComplaintDetails({ isOpen, onClose, complaint }) {
  const key_values = [
    { key: "Complaint Id", value: complaint._id },
    { key: "User Id", value: complaint.userID },
    { key: "About", value: complaint.complaintType },
    { key: "Date", value: complaint.date },
    { key: "Description", value: complaint.complaint },
    { key: "Status", value: complaint.status },
  ];
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState(key_values);

  const handleChecked = async () => {
    try {
      setLoading(true);
      const { data, code, msg } = await updateComplaintsAD(complaint._id, {
        status: "Resolved",
      });

      if (code == 0) {
        notification.success({
          message: msg,
        });
        onClose();
        setValues((prev) => {
          return prev.map((item) => {
            if (item.key === "Status") {
              return { key: item.key, value: "Resolved" };
            }
            return item;
          });
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      notification.error({
        message: "Something went wrong",
      });
    }
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
          {key_values[5].value === "Inprogress" && (
            <p onClick={handleChecked}>
              {loading ? "Loading.." : "Mark as Resolved"}
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}
