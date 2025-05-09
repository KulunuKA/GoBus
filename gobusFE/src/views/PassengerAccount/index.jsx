import React, { useState } from "react";
import man from "../../assets/images/passenger.jpg";
import editW from "../../assets/images/editWhite.png";
import "./style.css";
import EditableField from "../../components/EditableField/index";
import ConfirmationPopup from "../../components/ConfirmationPopup/index";
import { passengerData, updatePassengerInfo } from "../../store/passengerSlice";
import { useDispatch, useSelector } from "react-redux";
import MyButton from "../../components/button";
import { Modal, notification } from "antd";
import { passengerUpdate } from "../../apis/passengerAPIs";
import { MdLockReset } from "react-icons/md";
import PassengerPasswordChange from "../../components/PassengerPasswordChange";

export default function PassengerAccount({ selectedTab }) {
  const dispatch = useDispatch();
  const reduxUser = useSelector(passengerData);
  const [isEditing, setIsEditing] = useState({});
  const [showBtn, setShowBtn] = useState(false);
  const [userData, setUserData] = useState({
    mobile: reduxUser.mobile,
    username: reduxUser.username,
    email: reduxUser.email,
  });
  const [showPopup, setShowPopup] = useState(false);
  const [unSavedField, setUnSavedField] = useState(null);
  const [nextField, setNextField] = useState(null);
  const [orginalData, setOrginalData] = useState(userData);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const closePrevEdit = () => {
    const editingField = Object.keys(isEditing).find((key) => isEditing[key]);

    setIsEditing((prev) => ({ ...prev, [editingField]: false }));
  };

  const handleEditClick = (field) => {
    setShowBtn(true);
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

  const handleUpdate = async () => {
    try {
      setLoading(true);
      if (!userData.username || !userData.email || !userData.mobile) {
        notification.error({
          message: "Please fill all the fields",
        });
        setLoading(false);
        return;
      }

      if (userData.mobile && userData.mobile.length < 10) {
        notification.error({
          message: "Mobile must be at least 10 characters",
        });
        setLoading(false);
        return;
      } else if (!/^\d+$/.test(userData.mobile)) {
        notification.error({
          message: "Phone must be a number",
        });
        setLoading(false);
        return;
      }

      const { data, msg, code } = await passengerUpdate(userData);
      if (code === 0) {
        dispatch(updatePassengerInfo(data));
        notification.success({
          message: msg,
        });
      } else {
        notification.error({
          message: "Something went wrong",
        });
      }
      setLoading(false);
      setIsEditing({});
      setUnSavedField(null);
      setShowBtn(false);
    } catch (error) {
      setLoading(false);
      console.log("error", error);
      notification.error({
        message: "Something went wrong",
      });
    }
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
                  src={man}
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
                  label="Mobile number"
                  data={userData.mobile}
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
                  readOnly={true}
                />

                {showBtn && (
                  <div style={{ marginTop: 20 }}>
                    <MyButton
                      width={200}
                      color="rgba(5, 148, 79, 1)"
                      name="Update"
                      loading={loading}
                      onClick={handleUpdate}
                    />
                  </div>
                )}
              </div>
            </>
          )}
          {selectedTab === "security" && (
            <div className="passenger-profile-account-dataset">
              <h3
                style={{
                  color: "#2D3436",
                  fontSize: "23px",
                  fontWeight: "600",
                  marginBottom: "10px",
                }}
              >
                Loging to GoBus
              </h3>
              <div
                className="hr-line"
                style={{
                  width: "400px",
                  height: "3px",
                  color: "#f5f5f5",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              ></div>
              <p
                className="ppacd-label"
                style={{
                  color: "#2D3436",
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "10px",
                }}
              >
                Password
              </p>
              <div
                className="ppacd-field"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "150px",
                }}
              >
                <p
                  className="ppacd-pswd"
                  style={{
                    color: "#2D3436",
                    fontSize: "20px",
                    fontWeight: "600",
                  }}
                >
                  ******
                </p>
                <div className="ppacd-pbtn" style={{}}>
                  <MyButton
                    name="Reset"
                    icon={<MdLockReset />}
                    color={" #05944F"}
                    onClick={() => {
                      setShowModal(true);
                      console.log("isOpen: ", showModal);
                    }}
                  />
                </div>
              </div>
              <div
                className="hr-line"
                style={{
                  width: "400px",
                  height: "3px",
                  color: "#f5f5f5",
                  marginTop: "20px",
                  marginBottom: "10px",
                }}
              ></div>
            </div>
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

      {showModal && (
        <PassengerPasswordChange
          isOpen={true}
          onClose={() => {
            setShowModal(false);
          }}
        />
      )}
    </>
  );
}
