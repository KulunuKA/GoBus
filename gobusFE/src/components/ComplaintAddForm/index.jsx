import React, { useEffect, useState } from "react";
import { Modal, notification, Space } from "antd";
import "./style.css";
import Dropdown from "../../components/Dropdown";
import TextArea from "antd/es/input/TextArea";
import { useSelector } from "react-redux";
import { passengerData } from "../../store/passengerSlice";
import MyButton from "../button";
import { addComplaint } from "../../apis/passengerAPIs";

export default function ComplaintAddForm({ isOpen, onCancel }) {
  const { id: u_id } = useSelector(passengerData);
  const errorTextStyles = {
    color: "#F5222D",
    fontSize: "14px",
    marginTop: "1px",
  };
  const [complaint, setComplaint] = useState({
    userID: u_id,
    complaintType: "",
    complaint: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setComplaint({ ...complaint, [field]: e.target.value });
    setErrors({ ...errors, [field]: "" });
  };

  const [loading, setLoading] = useState(false);

  const validateForm = (values) => {
    const newErrors = {};

    if (!values.complaintType) {
      newErrors.complaintType = "Complaint category is required";
    }

    if (!values.complaint) {
      newErrors.complaint = "Description is required";
    } else if (values.complaint.length < 10) {
      newErrors.complaint = "Description must be at least 10 characters";
    } else if (values.complaint.length > 500) {
      newErrors.complaint = "Description must be less than 300 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      const isValid = validateForm(complaint);

      if (!isValid) {
        return;
      }
      setLoading(true);

      const { data, code, msg } = await addComplaint(complaint);
      if (code === 0) {
        notification.success({
          message: msg,
        });
        setComplaint({
          userID: u_id,
          complaintType: "",
          complaint: "",
        });
        onCancel();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      notification.error({
        message: "Something went wrong",
      });
    }
  };

  useEffect(() => {
    setComplaint({
      userID: u_id,
      complaintType: "",
      complaint: "",
    });
    setErrors({});
  }, [isOpen, u_id]);

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
                value={complaint.complaintType}
                onChange={(value) => {
                  setComplaint({ ...complaint, complaintType: value });
                  setErrors({ ...errors, complaintType: "" });
                }}
                error={errors.complaintType}
                errorMessage={errors.complaintType}
              />
            </div>

            <div className="complaintForm-popup-detail-field">
              <p className="complaintForm-popup-detail-label">Complaint:</p>
              <div className="complaintForm-popup-detail-input-box">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <TextArea
                    rows={4}
                    placeholder="Enter your complaint here"
                    minLength={10}
                    maxLength={300}
                    onChange={handleChange("complaint")}
                    value={complaint.complaint}
                    style={errors.complaint ? { borderColor: "#F5222D" } : {}}
                  />
                  {
                    <div style={errorTextStyles} role="alert">
                      {errors.complaint}
                    </div>
                  }
                </Space>
              </div>
            </div>

            <div className="cf-btn">
              <MyButton
                name="Submit"
                onClick={handleSubmit}
                color={"#05944f"}
                loading={loading}
                width={200}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
