import React, { useState } from "react";
import { Modal, notification, Space } from "antd";
import submit from "../../assets/images/click.png";
import "./style.css";
import PassengerButton from "../PassengerButton";
import Dropdown from "../../components/Dropdown";
import TextArea from "antd/es/input/TextArea";
import { useSelector } from "react-redux";
import { passengerData } from "../../store/passengerSlice";

export default function ComplaintAddForm({ isOpen, onCancel }) {
  const { id: u_id } = useSelector(passengerData);

  const [complaint, setComplaint] = useState({
    userID: u_id,
    date: new Date().toISOString().split("T")[0],
    about: "",
    complaint: "",
    status: "In Progress",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setComplaint({ ...complaint, [field]: e.target.value });
    setErrors({ ...errors, [field]: "" });
  };

  const [loading, setLoading] = useState(false);

  const validateForm = (values) => {
    const newErrors = {};

    if (!values.about) {
      newErrors.about = "Complaint category is required";
    }

    if (!values.complaint) {
      newErrors.complaint = "Description is required";
    }

    console.log(newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      const isValid = validateForm(trip);

      if (!isValid) {
        return;
      }
      setLoading(true);
    } catch (error) {
      setLoading(false);
      notification.error({
        message: "Something went wrong",
      });
    }
  };

  return (
    <>
      <Modal open={isOpen} onCancel={onCancel} footer={null} width={500}>
        <div className="complaintForm-popup-content">
          <div className="complaintForm-popup-title">
            <h2>Submit a New Complaint</h2>
          </div>
          <div className="complaintForm-popup-details">
            <div className="complaintForm-popup-detail-field">
              <p className="complaintForm-popup-detail-label">
                Complaint About:
              </p>
              <Dropdown
                placeholder="Select a complaint type"
                options={["About Driver", "About Bus", "About System"].map(
                  (item) => ({
                    label: item,
                    value: item,
                  })
                )}
                width="100%"
                borderRadius="7px"
                value={complaint.about}
                onChange={(value) =>
                  setComplaint({ ...complaint, about: value })
                }
              />
            </div>

            <div className="complaintForm-popup-detail-field">
              <p className="complaintForm-popup-detail-label">Complaint:</p>
              <div className="complaintForm-popup-detail-input-box">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <TextArea
                    rows={4}
                    placeholder="maxLength is 6"
                    maxLength={100}
                    onChange={handleChange("complaint")}
                  />
                </Space>
              </div>
            </div>

            <div className="cf-btn">
              <PassengerButton
                name="Submit"
                onClick={handleSubmit}
                icon={submit}
                fontWeight="500"
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
