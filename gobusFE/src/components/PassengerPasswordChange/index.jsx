import React, { useState } from "react";
import { changePassword } from "../../apis/passengerAPIs";
import { Modal, notification } from "antd";
import MyInput from "../input";
import MyButton from "../button";
import { useSelector } from "react-redux";
import { passengerData } from "../../store/passengerSlice";

const headers = {
  "Content-Type": "application/json",
};

const modalStyles = {
  width: "400px",
};

const inputContainerStyles = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  marginBottom: "24px",
};

const buttonContainerStyles = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
};

const submitButtonStyle = {
  backgroundColor: "#05944F",
  color: "white",
  fontWeight: "500",
  borderRadius: "6px",
  padding: "10px 18px",
  border: "none",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
};

const submitButtonDisabledStyle = {
  ...submitButtonStyle,
  backgroundColor: "#a7d9be",
  cursor: "not-allowed",
};

const cancelButtonStyles = {
  backgroundColor: "#dc3545",
  color: "white",
  fontWeight: "500",
  borderRadius: "6px",
  padding: "10px 18px",
  border: "none",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
};

const cancelButtonHoverStyles = {
  backgroundColor: "#c82333",
};

const submitButtonHoverStyles = {
  backgroundColor: "#047a3f",
};

export default function PassengerPasswordChange({ isOpen, onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const passenger = useSelector(passengerData);
  const token = passenger?.token;

  const handleChangePassword = async () => {
    const newErrors = {};

    if (!currentPassword) {
      newErrors.currentPassword = "Current Password is required.";
    }

    if (!newPassword) {
      newErrors.newPassword = "New Password is required.";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!confirmNewPassword) {
      newErrors.confirmNewPassword = "Confirm Password is required.";
    } else if (confirmNewPassword.length < 6) {
      newErrors.confirmNewPassword = "Password must be at least 6 characters";
    }

    if (newPassword !== confirmNewPassword) {
      newErrors.confirmNewPassword = "New passwords don't match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`,
        },
      };
      console.log("config is : ", config);
      const response = await changePassword(
        { currentPassword, newPassword },
        config
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setErrors({});
      notification.success({ message: "Password changed successfully." });
      onClose();
    } catch (err) {
      console.error(err);
      notification.error({ message: "Error updating password." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      style={modalStyles}
      title="Change Password"
    >
      <div style={inputContainerStyles}>
        <MyInput
          label="Current Password"
          type="password"
          placeholder="Enter current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          error={errors.currentPassword}
          errorMessage={errors.currentPassword}
        />
        <MyInput
          label="New Password"
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={errors.newPassword}
          errorMessage={errors.newPassword}
        />
        <MyInput
          label="Confirm New Password"
          type="password"
          placeholder="Confirm new password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          error={errors.confirmNewPassword}
          errorMessage={errors.confirmNewPassword}
        />
      </div>
      <div style={buttonContainerStyles}>
        <button
          style={loading ? submitButtonDisabledStyle : submitButtonStyle}
          onClick={handleChangePassword}
          disabled={loading}
          onMouseEnter={(e) =>
            !loading &&
            (e.target.style.backgroundColor =
              submitButtonHoverStyles.backgroundColor)
          }
          onMouseLeave={(e) =>
            !loading &&
            (e.target.style.backgroundColor = submitButtonStyle.backgroundColor)
          }
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
        <button
          style={cancelButtonStyles}
          onClick={onClose}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor =
              cancelButtonHoverStyles.backgroundColor)
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor =
              cancelButtonStyles.backgroundColor)
          }
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
