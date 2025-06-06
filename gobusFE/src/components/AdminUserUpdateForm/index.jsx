import { useState } from "react";
import { Modal, notification } from "antd";
import MyInput from "../input";
import MyButton from "../button";
import { FaEdit } from "react-icons/fa";
import {
  HomeOutlined,
  MobileOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { editAuthorityAD, editPassengerAD } from "../../apis/adminAPIs";

export default function AdminUserUpdateFormForm({
  isOpen,
  onClose,
  user,
  selectedUser,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputErr, setInputErr] = useState({});
  const [passengerData, setPassengerData] = useState({
    username: selectedUser.username || "",
    mobile: selectedUser.mobile || "",
  });
  const [authorityData, setAuthorityData] = useState({
    authorityName: selectedUser.authorityName || "",
    address: selectedUser.address || "",
    phone: selectedUser.phone || "",
  });

  console.log("authority is ", authorityData);
  const handleInput = (field) => (e) => {
    setInputErr({ ...inputErr, [field]: false });
    if (user === "passenger") {
      setPassengerData({ ...passengerData, [field]: e.target.value });
    } else if (user === "authority") {
      setAuthorityData({ ...authorityData, [field]: e.target.value });
    }
  };

  const validateFormPassenger = (values) => {
    const newErrors = {};
    if (!values.username) {
      newErrors.username = "Username is required";
    }

    if (!values.mobile) {
      newErrors.mobile = "Mobile is required";
    }

    if (values.mobile && values.mobile.length < 10) {
      newErrors.mobile = "Mobile must be at least 10 characters";
    }

    setInputErr(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateFromAuthority = (values) => {
    const newErrors = {};
    if (!values.authorityName) {
      newErrors.authorityName = "Authority Name is required";
    }

    if (!values.address) {
      newErrors.address = "Address is required";
    }
    if (!values.phone) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d+$/.test(values.phone)) {
      newErrors.phone = "Phone must be a number";
    } else if (values.phone.length < 10) {
      newErrors.phone = "Phone must be at least 10 characters";
    }

    setInputErr(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (user === "passenger") {
      console.log("adding passenger: ", passengerData);
      try {
        if (!validateFormPassenger(passengerData)) {
          console.log("Validation Error");
          return;
        }
        setLoading(true);
        const { data, code, msg } = await editPassengerAD(
          selectedUser._id,
          passengerData
        );

        if (code === 0) {
          notification.success({ message: msg });
          onClose();
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        notification.error({
          message: error.response.data.msg || "Something went wrong",
        });
      }
    } else if (user === "authority") {
      try {
        if (!validateFromAuthority(authorityData)) return;
        setLoading(true);
        const { data, code, message } = await editAuthorityAD(
          selectedUser._id,
          authorityData
        );
        if (code === 0) {
          notification.success({ message: message });
          onClose();
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        notification.error({
          message: error.response.data.msg || "Something went wrong",
        });
      }
    }
  };

  return (
    <>
      <Modal open={isOpen} onCancel={onClose} footer={null}>
        <div className="auaf-container">
          <div className="auaf-topic">
            {user === "passenger" && <h2>Edit Passenger</h2>}
            {user === "authority" && <h2>Edit Authority</h2>}
          </div>
          <div className="auaf-details">
            {user === "passenger" && (
              <>
                <div className="auaf-input">
                  <MyInput
                    label={"Username"}
                    prefix={<UserOutlined />}
                    placeholder={"Username"}
                    type="text"
                    value={passengerData.username}
                    onChange={handleInput("username")}
                    error={inputErr.username}
                    errorMessage={inputErr.username}
                  />
                </div>

                <div className="auaf-input">
                  <MyInput
                    label={"Mobile"}
                    prefix={<MobileOutlined />}
                    placeholder={"Mobile"}
                    value={passengerData.mobile}
                    type="text"
                    onChange={handleInput("mobile")}
                    error={inputErr.mobile}
                    errorMessage={inputErr.mobile}
                  />
                </div>
              </>
            )}
            {user === "authority" && (
              <>
                <div className="auaf-input">
                  <MyInput
                    label={"Authority Name"}
                    prefix={<UserOutlined />}
                    placeholder={"Authority Name"}
                    type="text"
                    value={authorityData.authorityName}
                    onChange={handleInput("authorityName")}
                    error={inputErr.authorityName}
                    errorMessage={inputErr.authorityName}
                  />
                </div>

                <div className="auaf-input">
                  <MyInput
                    label={"Address"}
                    prefix={<HomeOutlined />}
                    placeholder={"Address"}
                    value={authorityData.address}
                    type="text"
                    onChange={handleInput("address")}
                    error={inputErr.address}
                    errorMessage={inputErr.address}
                  />
                </div>
                <div className="auaf-input">
                  <MyInput
                    label={"phone"}
                    prefix={<PhoneOutlined />}
                    placeholder={"phone"}
                    value={authorityData.phone}
                    type="text"
                    onChange={handleInput("phone")}
                    error={inputErr.phone}
                    errorMessage={inputErr.phone}
                  />
                </div>
              </>
            )}
          </div>
          <div className="auaf-btn">
            <MyButton
              name="Update"
              icon={<FaEdit />}
              color="#2D3436"
              loading={loading}
              onClick={handleSubmit}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
