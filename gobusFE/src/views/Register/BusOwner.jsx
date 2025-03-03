import React, { useState } from "react";
import MyInput from "../../components/input";
import logo from "../../assets/images/white-logo.png";
import { notification } from "antd";
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
  HomeOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import googleLogo from "../../assets/images/google-logo.png";
import "./style.css";
import MyButton from "../../components/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../store/busOwnerSlice";
import { busOwnerRegister } from "../../apis/busOwner";

export default function BusOwner() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [inputErr, setInputErr] = useState({
    email: false,
    password: false,
    authorityName: false,
    address: false,
    phone: false,
  });
  const [userData, setUserData] = useState({
    role: "BusOwner",
    authorityName: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    busesId: [],
    employeesId: [],
    routesId: [],
  });

  const handleInput = (field) => (e) => {
    setInputErr({ ...inputErr, [field]: false });
    setUserData({ ...userData, [field]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (
        !userData.authorityName ||
        !userData.email ||
        !userData.password ||
        !userData.address ||
        !userData.phone
      ) {
        setInputErr({
          authorityName: !userData.authorityName,
          email: !userData.email,
          password: !userData.password,
          address: !userData.address,
          phone: !userData.phone,
        });
        notification.error({
          message: "Required all fields",
        });
        return;
      } else if (userData.phone.length != 10) {
        notification.error({
          message: "Invalid phone number",
        });
        return;
      }
      setIsLoading(true);

      const { data, code, msg } = await busOwnerRegister(userData);

      if (code === 0) {
        dispatch(setUserInfo(data));
        navigate("/dashboard");
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      notification.error({
        message: error.response.data.msg || "Something went wrong",
      });
    }
  };
  return (
    <div className="p-page">
      <div className="p-left">
        <img src={logo} alt="logo" />
        <p>
          Join GoBus today and unlock a seamless travel experience! Register now
          to book seats, track bus locations in real-time, and access special
          trip options all with just a few clicks.
        </p>
      </div>
      <div className="p-right">
        <div className="p-title">
          <p>Sign up as a </p>
          <p>GoBus Bus Owner</p>
        </div>
        <div className="p-content">
          <div className="p-form">
            <section className="p-inputs">
              <MyInput
                label={"Authority Name"}
                prefix={<UserOutlined />}
                placeholder={"Authority Name"}
                type="text"
                value={userData.authorityName}
                onChange={handleInput("authorityName")}
                error={inputErr.authorityName}
              />
              <MyInput
                label="Email"
                prefix={<MailOutlined />}
                placeholder="example@gmail.com"
                type="email"
                value={userData.email}
                onChange={handleInput("email")}
                error={inputErr.email}
              />
              <MyInput
                label="Password"
                prefix={<LockOutlined />}
                placeholder="******"
                type="password"
                value={userData.password}
                onChange={handleInput("password")}
                error={inputErr.password}
              />
              <MyInput
                label={"Address"}
                prefix={<HomeOutlined />}
                placeholder={"Address"}
                value={userData.address}
                type="text"
                onChange={handleInput("address")}
                error={inputErr.address}
              />

              <MyInput
                label={"phone"}
                prefix={<PhoneOutlined />}
                placeholder={"phone"}
                value={userData.phone}
                type="text"
                onChange={handleInput("phone")}
                error={inputErr.phone}
              />
              <section className="check">
                <section>
                  <input type="checkbox" />
                  <label>
                    I agree with all <span>Terms and Conditions</span> of GoBus
                  </label>
                </section>
              </section>
            </section>
            <div className="p-button">
              <MyButton
                name="Register"
                color={"#05944F"}
                width={200}
                loading={isLoading}
                onClick={handleSubmit}
              />
            </div>
          </div>

          <div className="p-footer">
            <section className="google-p">
              <img src={googleLogo} style={{ width: 28, height: 28 }} />
              <p>Sign up with google</p>
            </section>

            <section className="sign-up-link">
              <p>
                Do have an account?
                <span
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  {" "}
                  Login{" "}
                </span>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
