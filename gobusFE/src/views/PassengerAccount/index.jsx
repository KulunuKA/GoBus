import React, { useState } from "react";
import man from "../../assets/images/passenger.jpg";
import editW from "../../assets/images/editWhite.png";
import "./style.css";
import EditableField from "../../components/EditableField/index";
import ConfirmationPopup from "../../components/ConfirmationPopup/index";

export default function PassengerAccount({ selectedTab }) {
  const user = {
    username: "Dilshan Karunarathna",
    phone: "0725478963",
    email: "dilshankarunarathna@gmail.com",
    propic: man,
  };

  const [isEditing, setIsEditing] = useState({});
  const [userData, setUserData] = useState(user);
  const [showPopup, setShowPopup] = useState(false);
  const [unSavedField, setUnSavedField] = useState(null);
  const [nextField, setNextField] = useState(null);
  const [orginalData, setOrginalData] = useState(user);

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

  return (
    <>
      <div className="passenger-profile-account">
        <h2 className="passenger-profile-account-topic">
          {selectedTab === "account" && "Personal info"}{" "}
          {selectedTab === "security" && "Security"}
        </h2>
        <div className="passenger-profile-account-content">
          {selectedTab === "account" && (
            <>
              <div className="passenger-profile-account-propic">
                <img
                  src={user.propic}
                  alt=""
                  className="passenger-profile-account-propic-image"
                />
                <div className="propic-overlay">
                  <img src={editW} alt="" className="propic-overlay-image" />
                </div>
              </div>
              <div className="passenger-profile-account-dataset">
                <EditableField
                  label="Name"
                  data={userData.username}
                  isEditing={isEditing.username}
                  onEdit={() => handleEditClick("username")}
                  onSave={() => handleSaveClick("username")}
                  onChange={(e) => handleOnChange("username", e.target.value)}
                />
                <EditableField
                  label="Phone number"
                  data={userData.phone}
                  isEditing={isEditing.phone}
                  onEdit={() => handleEditClick("phone")}
                  onSave={() => handleSaveClick("phone")}
                  onChange={(e) => handleOnChange("phone", e.target.value)}
                />
                <EditableField
                  label="Email"
                  data={userData.email}
                  isEditing={isEditing.email}
                  onEdit={() => handleEditClick("email")}
                  onSave={() => handleSaveClick("email")}
                  onChange={(e) => handleOnChange("email", e.target.value)}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {showPopup && (
        <ConfirmationPopup
          message="You have unsaved changes. Do you want to save them?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
