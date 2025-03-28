import React, { useState } from "react";
import { Modal, notification, Space } from "antd";
import "./style.css";
import MyInput from "../input";
import TextArea from "antd/es/input/TextArea";
import Dropdown from "../Dropdown/index";
import { useSelector } from "react-redux";
import { passengerData } from "../../store/passengerSlice";
import { useParams } from "react-router-dom";
import { requestTrip } from "../../apis/passengerAPIs";
import MyButton from "../button";

export default function BookForm({ isOpen, onClose }) {
  const { id: u_id } = useSelector(passengerData);
  const { id } = useParams();
  const [trip, setTrip] = useState({
    userID: u_id,
    busID: id,
    date: "",
    type: "",
    venue: "",
    days: "",
    description: "",
    contact_no: "",
  });
  const [errors, setErrors] = useState({});
  const handleChange = (field) => (e) => {
    setTrip({ ...trip, [field]: e.target.value });
    setErrors({ ...errors, [field]: "" });
  };
  const [loading, setLoading] = useState(false);

  const validateForm = (values) => {
    const newErrors = {};

    if (!values.date) {
      newErrors.date = "Date is required";
    }

    if (!values.type) {
      newErrors.type = "Trip type is required";
    }

    if (!values.venue) {
      newErrors.venue = "Destination is required";
    }

    if (!values.days) {
      newErrors.days = "Days is required";
    }

    if (!values.contact_no) {
      newErrors.contact_no = "Contact number is required";
    } else if (
      isNaN(values.contact_no) ||
      Number(values.contact_no) <= 0 ||
      values.contact_no.length !== 10
    ) {
      newErrors.contact_no = "Please enter a valid contact number";
    }

    if (!values.description) {
      newErrors.description = "Description is required";
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

      const { data, code, msg } = await requestTrip(trip);
      if (code == 0) {
        notification.success({
          message: msg,
        });
        onClose();
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
    <Modal open={isOpen} onCancel={onClose} footer={null}>
      <div className="bookingForm-popup-content">
        <div className="bookingForm-popup-title">
          <h2>Special Trip Request Form</h2>
        </div>
        <div className="bookingForm-popup-details">
          <div className="bookingForm-popup-detail-field">
            <MyInput
              placeholder="Select a Date"
              borderRadius="0"
              type="date"
              label={"Date"}
              value={trip.date}
              onChange={handleChange("date")}
              error={errors.date}
              errorMessage={errors.date}
            />
          </div>

          <div className="bookingForm-popup-detail-field">
            <p className="bookingForm-popup-detail-label">Trip Type:</p>
            <Dropdown
              placeholder="Select a trip type"
              options={["Family Trip", "Friends Trip", "Office Trip"].map(
                (item) => ({
                  label: item,
                  value: item,
                })
              )}
              width="100%"
              borderRadius="0"
              value={trip.type}
              onChange={(value) => setTrip({ ...trip, type: value })}
            />
          </div>
          <div className="bookingForm-popup-detail-field">
            <MyInput
              placeholder="Enter the destination"
              borderRadius="0"
              label={"Destination"}
              value={trip.venue}
              onChange={handleChange("venue")}
              error={errors.venue}
              errorMessage={errors.venue}
            />
          </div>
          <div className="bookingForm-popup-detail-field">
            <MyInput
              placeholder="Enter the number of days"
              borderRadius="0"
              label={"Days"}
              type="number"
              value={trip.days}
              onChange={handleChange("days")}
              errorMessage={errors.days}
              error={errors.days}
            />
          </div>
          <div className="bookingForm-popup-detail-field">
            <MyInput
              placeholder="Enter the contact number"
              borderRadius="0"
              label={"Contact No:"}
              type="number"
              maxLength={10}
              value={trip.contact_no}
              onChange={handleChange("contact_no")}
              errorMessage={errors.contact_no}
              error={errors.contact_no}
            />
          </div>
          <div className="bookingForm-popup-detail-field">
            <p className="bookingForm-popup-detail-label">Description:</p>
            <div className="bookingForm-popup-detail-input-box">
              <Space direction="vertical" style={{ width: "100%" }}>
                <TextArea
                  rows={4}
                  placeholder="maxLength is 6"
                  maxLength={100}
                  onChange={handleChange("description")}
                />
              </Space>
            </div>
          </div>
          <MyButton
            name="Submit"
            onClick={handleSubmit}
            width={150}
            color={"#05944f"}
            loading={loading}
          />
        </div>
      </div>
    </Modal>
  );
}
