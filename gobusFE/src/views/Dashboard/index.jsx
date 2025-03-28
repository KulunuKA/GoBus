import React, { useState } from "react";
import "./style.css";
import MyButton from "../../components/button";
import ConfirmationPopup from "../../components/ConfirmationPopup";
import { useSelector } from "react-redux";
import { busOwnerData } from "../../store/busOwnerSlice";
import { busOwnerUpdate } from "../../apis/busOwner";

export default function Dashboard() {
  const [isEditing, setIsEditing] = useState(false);
  const {
    _id: id,
    busesId,
    routesId,
    employeesId,
    authorityName,
    email,
    phone,
    address,
    logo,
  } = useSelector(busOwnerData);

  const [showPopup, setShowPopup] = useState(false);

  const [originalData, setOriginalData] = useState({
    authorityName,
    email,
    phone,
    address,
    logo,
    busesId,
    routesId,
    employeesId,
  });

  const [userData, setUserData] = useState(originalData);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setShowPopup(true);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      if (
        !userData.address ||
        !userData.email ||
        !userData.phone ||
        !userData.authorityName
      ) {
        notification.error({ message: "Please fill all fields" });
        setLoading(false);
        return;
      }

      const { data, msg, code } = await busOwnerUpdate(id, userData);
      if (code === 0) {
        dispatch(updatePassengerInfo(data));
        notification.success({ message: msg });

        setOriginalData(userData);
      } else {
        notification.error({ message: "Something went wrong" });
      }
    } catch (error) {
      console.log("Error:", error);
      notification.error({ message: "Something went wrong" });
    } finally {
      setLoading(false);
      setIsEditing(false);
      setShowPopup(false);
    }
  };

  const handleCancel = () => {
    setUserData(originalData);
    setIsEditing(false);
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

  const handleUpdate = async () => {
    try {
      setLoading(true);
      if (
        !userData.address ||
        !userData.email ||
        !userData.phone ||
        !userData.authorityName
      ) {
        notification.error({
          message: "Please fill all the fields",
        });
        return;
      }

      const { data, msg, code } = await busOwnerUpdate(id, userData);
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
    } catch (error) {
      setLoading(false);
      console.log("error", error);
      notification.error({
        message: "Something went wrong",
      });
    }
  };

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
            {totalActiveBuses}/{busesId?.length}
          </p>
          <p>Active / Total Buses</p>
        </div>
        <div className="owner-dashboard-summary-box">
          <p className="owner-dashboard-count">{routesId?.length}</p>
          <p>Total Routes</p>
        </div>
        <div className="owner-dashboard-summary-box">
          <p className="owner-dashboard-count">{employeesId?.length}</p>
          <p>Total Employees</p>
        </div>
        <div className="owner-dashboard-summary-box">
          <span>LKR:</span>
          <p className="owner-dashboard-count">89290</p>
          <p>Today Revenue</p>
        </div>
      </div>
      <div className="owner-dashboard-profile">
        <p>Account Information</p>
        <div className="owner-dashboard-profile-data-field">
          {["authorityName", "email", "phone", "address"].map((field) => (
            <div key={field} className="authority-dashboard-account-datafield">
              <div className="authority-dashboard-account-data-filed">
                <p className="authority-dashboard-account-data-title">
                  {field}:
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    value={userData[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="authority-dashboard-account-data-input"
                  />
                ) : (
                  <p className="authority-dashboard-account-data">
                    {userData[field]}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20 }}>
          {isEditing ? (
            <MyButton
              width={200}
              name="Save"
              loading={loading}
              color="#05944F"
              onClick={handleSaveClick}
            />
          ) : (
            <MyButton
              width={200}
              name="Update"
              loading={loading}
              color="#05944F"
              onClick={handleUpdateClick}
            />
          )}
        </div>
      </div>
      {showPopup && (
        <ConfirmationPopup
          message="Are you sure?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          yesText="Yes"
          noText="No"
        />
      )}
    </div>
  );
}
