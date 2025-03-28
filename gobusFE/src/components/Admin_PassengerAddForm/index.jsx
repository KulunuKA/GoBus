import React, { useState } from "react";
import { Modal, notification } from "antd";
import MyInput from "../input";
import MyButton from "../button";
import {
  LockOutlined,
  MailOutlined,
  MobileOutlined,
  UserOutlined,
} from "@ant-design/icons";
// import { addEmployee } from "../../apis/busOwner";
// import { busOwnerData } from "../../store/busOwnerSlice";
// import { useSelector } from "react-redux";

export default function PassengerAddForm({ isOpen, onCancel, refresh }) {
  // const { id } = useSelector(busOwnerData);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [userData, setUserData] = useState({
    role: "Passenger",
    username: "",
    email: "",
    password: "",
    mobile: "",
  });

  const inputHandle = (field) => (e) => {
    setUserData({ ...userData, [field]: e.target.value });
    setErrors({ ...errors, [field]: "" });
  };

  const validateForm = (values) => {
    const newErrors = {};

    if (!values.username) {
      newErrors.username = "Username is required";
    }

    if (!values.email) {
      newErrors.email = "Email is required";
    }

    if (!values.password) {
      newErrors.password = "Password is required";
    }

    if (!values.mobile) {
      newErrors.mobile = "Mobile Number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm(empData)) {
        return;
      }
      setIsLoading(true);

      // const { data, code, msg } = await addEmployee(empData);

      if (code === 0) {
        notification.success({
          message: msg,
        });
        onCancel();
        refresh();
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      notification.error({
        message: "Something went wrong!",
      });
    }
  };
  return (
    <>
      <Modal open={isOpen} onCancel={onCancel} footer={null}>
        <div className="bus-add">
          <div className="ab-header">
            <p>Add Passenger</p>
          </div>
          <div className="ab-content">
            <div>
              <MyInput
                label={"Username"}
                placeholder="Passenger Username"
                onChange={inputHandle("username")}
                value={userData.username}
                error={errors.username}
                errorMessage={errors.username}
              />

              <MyInput
                label={"Email"}
                placeholder="Passenger Email"
                onChange={inputHandle("email")}
                value={userData.email}
                error={errors.email}
                errorMessage={errors.email}
              />
              <MyInput
                label={"Passenger"}
                placeholder="Passenger Password"
                onChange={inputHandle("password")}
                value={userData.email}
                error={errors.email}
                errorMessage={errors.email}
              />
              <MyInput
                label={"Mobile"}
                placeholder="Passenger Contact No."
                onChange={inputHandle("mobile")}
                value={userData.email}
                error={errors.email}
                errorMessage={errors.email}
              />
            </div>

            <div className="ab-btn">
              <MyButton
                name="Add"
                width={150}
                color={" #2D3436"}
                onClick={handleSubmit}
                loading={isLoading}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
