import React, { useState } from "react";
import MyInput from "../../components/input";
import logo from "../../assets/images/white-logo.png";
import { notification } from "antd";
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
  MobileOutlined,
} from "@ant-design/icons";
import googleLogo from "../../assets/images/google-logo.png";
import "./style.css";
import MyButton from "../../components/button";
import { passengerRegister } from "../../apis/passengerAPIs";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPassengerInfo } from "../../store/passengerSlice";

export default function Passenger() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [inputErr, setInputErr] = useState({
    email: false,
    password: false,
    username: false,
    address: false,
    mobile: false,
  });
  const [userData, setUserData] = useState({
    role: "Passenger",
    username: "",
    email: "",
    password: "",
    mobile: "",
  });

  const handleInput = (field) => (e) => {
    setInputErr({ ...inputErr, [field]: false });
    setUserData({ ...userData, [field]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (
        !userData.username ||
        !userData.email ||
        !userData.password ||
        !userData.mobile
      ) {
        setInputErr({
          username: !userData.username,
          email: !userData.email,
          password: !userData.password,
          address: !userData.address,
          mobile: !userData.mobile,
        });
        notification.error({
          message: "Required all fields",
        });
        return;
      } else if (userData.mobile.length != 10) {
        notification.error({
          message: "Invalid phone number",
        });
        return;
      }
      setIsLoading(true);

      const { data, code, msg } = await passengerRegister(userData);

      if (code === 0) {
        dispatch(setPassengerInfo(data));
        navigate("/");
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
          <p>GoBus Passenger</p>
        </div>
        <div className="p-content">
          <div className="p-form">
            <section className="p-inputs">
              <MyInput
                label={"Username"}
                prefix={<UserOutlined />}
                placeholder={"Username"}
                type="text"
                value={userData.username}
                onChange={handleInput("username")}
                error={inputErr.username}
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
                label={"Mobile"}
                prefix={<MobileOutlined />}
                placeholder={"Mobile"}
                value={userData.mobile}
                type="text"
                onChange={handleInput("mobile")}
                error={inputErr.mobile}
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
                    navigate("/login")
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
