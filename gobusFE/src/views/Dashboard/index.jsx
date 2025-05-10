import React, { useEffect, useState } from "react";
import "./style.css";
import MyButton from "../../components/button";
import ConfirmationPopup from "../../components/ConfirmationPopup";
import { useDispatch, useSelector } from "react-redux";
import { busOwnerData } from "../../store/busOwnerSlice";
import { busOwnerUpdate, getBuses, getIncome } from "../../apis/busOwner";
import { updatePassengerInfo } from "../../store/passengerSlice";
import { notification } from "antd";
import BusIncomeDisplay from "./Income";

export default function Dashboard() {
  const [isEditing, setIsEditing] = useState(false);
  const {
    busesId,
    routesId,
    employeesId,
    authorityName,
    email,
    phone,
    address,
    logo,
  } = useSelector(busOwnerData);
  let id = useSelector(busOwnerData).id;
  const dispatch = useDispatch();

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
  const [buses, setBuses] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0);
  const [incomeData, setIncomeData] = useState([]);

  const handleInputChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setShowPopup(true);
  };

  const handleCancel = () => {
    setUserData(originalData);
    setIsEditing(false);
    setShowPopup(false);
  };

  const fetchedBuses = async () => {
    try {
      setLoading(true);
      const { data, code, msg } = await getBuses(id);
      const res = await getIncome(id);

      console.log(res);

      if (code === 0) {
        setBuses(data);
      }

      if (res.code === 0) {
        setIncomeData(res.data);
        let total = 0;
        res.data?.forEach((item) => {
          item.income?.forEach((income) => {
            total += income.income;
          });
        });
        setTotalIncome(total);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const activeBusesPublicService = buses?.filter(
    (key) => key.today_work === true
  ).length;

  const dataHeaders = ["AuthorityName", "Email", "Phone", "Address"];

  const handleUpdate = async () => {
    try {
      setBtnLoading(true);
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
          message: "Profile updated successfully",
        });
      } else {
        notification.error({
          message: "Something went wrong",
        });
      }
      setOriginalData(userData);
      setUserData(userData);
      setBtnLoading(false);
    } catch (error) {
      setBtnLoading(false);
      console.log("error", error);
      notification.error({
        message: "Something went wrong",
      });
    }
  };

  useEffect(() => {
    fetchedBuses();
  }, []);
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
            {activeBusesPublicService}/{buses?.length}
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
          <p className="owner-dashboard-count">{totalIncome}</p>
          <p>Today Revenue</p>
        </div>
      </div>

      <div className="owner-dashboard-profile">
        <p>Account Information</p>
        <div className="owner-dashboard-profile-data-field">
          {["authorityName", "email", "phone", "address"].map(
            (field, index) => (
              <div
                key={index}
                className="authority-dashboard-account-datafield"
              >
                <div className="authority-dashboard-account-data-filed">
                  <p className="authority-dashboard-account-data-title">
                    {dataHeaders[index]}:
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
            )
          )}
        </div>
        <div style={{ marginTop: 20 }}>
          {isEditing ? (
            <MyButton
              width={200}
              name="Save"
              loading={btnLoading}
              color="#05944F"
              onClick={() => {
                handleSaveClick();
              }}
            />
          ) : (
            <MyButton
              width={200}
              name="Update"
              loading={btnLoading}
              color="#05944F"
              onClick={handleUpdateClick}
            />
          )}
        </div>
      </div>

      <BusIncomeDisplay busData={incomeData} />

      {showPopup && (
        <ConfirmationPopup
          message="Are you sure?"
          onConfirm={handleUpdate}
          onCancel={handleCancel}
          yesText="Yes"
          noText="No"
        />
      )}
    </div>
  );
}
