import React, { useState } from "react";
import "./style.css";
import EditableField from "../../components/EditableField";
import MyButton from "../../components/button";
import ConfirmationPopup from "../../components/ConfirmationPopup";

export default function Dashboard() {
  const [isEditing, setIsEditing] = useState({});
  const [userData, setUserData] = useState({
    authorityName: "Ashan Bus Authority",
    email: "ashan@gmail.com",
    phone: "072548662656",
    address: "Piumgalla, Wariyapola",
  });

  const [showPopup, setShowPopup] = useState(false);
  const [unSavedField, setUnSavedField] = useState(null);
  const [nextField, setNextField] = useState(null);
  const [orginalData, setOrginalData] = useState(userData);
  const [loading, setLoading] = useState(false);

  const closePrevEdit = () => {
    const editingField = Object.keys(isEditing).find((key) => isEditing[key]);

    setIsEditing((prev) => ({ ...prev, [editingField]: false }));
  };

  const handleEditClick = (field) => {
    if (unSavedField && unSavedField !== field) {
      setNextField(field);
      setShowPopup(true);
      return;
    }
    closePrevEdit();

    setOrginalData(userData);
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
    setUnSavedField(null);
  };

  const handleSaveClick = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: false }));
    setUnSavedField(null);
  };

  const handleOnChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
    setUnSavedField(field);
  };

  const handleConfirm = () => {
    handleSaveClick(unSavedField);
    handleEditClick(nextField);
    setShowPopup(false);
  };

  const handleCancel = () => {
    setUserData(orginalData);
    setIsEditing((prev) => ({ ...prev, [unSavedField]: false }));
    setUnSavedField(null);
    handleEditClick(nextField);
    setShowPopup(false);
  };

  const buses = [
    { id: 1, status: "In Route" },
    { id: 2, status: "In Service" },
    { id: 3, status: "In Stand" },
    { id: 4, status: "Not Working" },
    { id: 5, status: "In Route" },
    { id: 6, status: "In Route" },
  ];

  const activeBusesPublicService = buses.filter(
    (key) => key.status === "In Route"
  ).length;
  const activeBusesSpecialService = buses.filter(
    (key) => key.status === "In Service"
  ).length;
  const activeBusesPublicServiceInStand = buses.filter(
    (key) => key.status === "In Stand"
  ).length;

  const totalActiveBuses =
    activeBusesPublicService +
    activeBusesPublicServiceInStand +
    activeBusesSpecialService;

  return (
    <div className="dashboard">
      <div className="owner-dashboard-header">
        <h1>Dashboard</h1>
      </div>
      <div className="owner-dashboard-summary">
        <div className="owner-dashboard-summary-box active-buses-box">
          <div
            className="active-buses-status-indicator flashing"
            style={{ backgroundColor: "rgba(5, 148, 79, 1)" }}
          ></div>
          <p className="owner-dashboard-count">
            {totalActiveBuses}/{buses.length}
          </p>
          <p>Active / Total Buses</p>
        </div>
        <div className="owner-dashboard-summary-box">
          <p className="owner-dashboard-count">50</p>
          <p>Total Routes</p>
        </div>
        <div className="owner-dashboard-summary-box">
          <p className="owner-dashboard-count">50</p>
          <p>Total Employees</p>
        </div>
        <div className="owner-dashboard-summary-box">
          <p className="owner-dashboard-count">50</p>
          <p>Today Revenue</p>
        </div>
      </div>
      <div className="owner-dashboard-profile">
        <p>Account Information</p>
        <div className="owner-dashboard-profile-data-field">
          <EditableField
            label="Name"
            data={userData.authorityName}
            isEditing={isEditing.username}
            onEdit={() => handleEditClick("username")}
            onSave={() => handleSaveClick("username")}
            onChange={(e) => handleOnChange("username", e.target.value)}
          />
          <EditableField
            label="Mobile number"
            data={userData.phone}
            isEditing={isEditing.mobile}
            onEdit={() => handleEditClick("mobile")}
            onSave={() => handleSaveClick("mobile")}
            onChange={(e) => handleOnChange("mobile", e.target.value)}
          />
          <EditableField
            label="Email"
            data={userData.email}
            isEditing={isEditing.email}
            onEdit={() => handleEditClick("email")}
            onSave={() => handleSaveClick("email")}
            onChange={(e) => handleOnChange("email", e.target.value)}
          />
          <EditableField
            label="Address"
            data={userData.address}
            isEditing={isEditing.address}
            onEdit={() => handleEditClick("address")}
            onSave={() => handleSaveClick("address")}
            onChange={(e) => handleOnChange("address", e.target.value)}
          />
        </div>
        <div style={{ marginTop: 20 }}>
          <MyButton
            width={200}
            name="Update"
            loading={loading}
            color="#05944F"
          />
        </div>
      </div>
      {showPopup && (
        <ConfirmationPopup
          message="You have unsaved changes. Do you want to save them?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
