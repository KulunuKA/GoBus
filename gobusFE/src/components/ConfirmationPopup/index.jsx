import React from "react";
import "./style.css";

export default function ConfirmationPopup({
  message,
  onConfirm,
  onCancel,
  yesText = "Save",
  noText = "Discard",
}) {
  return (
    <>
      <div className="popup-overlay">
        <div className="popup-box">
          <p className="popup-message">{message}</p>
          <div className="popup-actions">
            <button className="popup-btn confirm" onClick={onConfirm}>
              {yesText}
            </button>
            <button className="popup-btn cancel" onClick={onCancel}>
              {noText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
