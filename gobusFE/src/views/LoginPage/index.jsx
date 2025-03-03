import React, { useState } from "react";
import MyInput from "../../components/input";
import MyButton from "../../components/button";
import googleLogo from "../../assets/images/google-logo.png";
import logo from "../../assets/images/white-logo.png";
import { MailOutlined, LockOutlined } from "@ant-design/icons";

import "./style.css";
import { notification } from "antd";
import { login } from "../../apis/userAPIs";
import SignUp_Popup from "../../components/LoginSignUpModal/LoginSignUpModal";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [inputErr, setInputErr] = useState({
    email: false,
    password: false,
  });
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [isRegister, setIsRegister] = useState(false);

  const handleInput = (field) => (e) => {
    setInputErr({ ...inputErr, [field]: false });
    setCredentials({ ...credentials, [field]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (!credentials.email && !credentials.password) {
        setInputErr({ ...inputErr, email: true, password: true });
        notification.error({
          message: "Required email and password",
        });
        return;
      } else if (!credentials.email) {
        setInputErr({ ...inputErr, email: true });
        notification.error({
          message: "Required email",
        });
        return;
      } else if (!credentials.password) {
        setInputErr({ ...inputErr, password: true });
        notification.error({
          message: "Required password",
        });
        return;
      }

      setIsLoading(true);

      const { data, code, msg } = await login(credentials);
      console.log(data, code, msg);
      setIsLoading(false);
    } catch (error) {
      // console.log(error);
      setIsLoading(false);
      notification.error({
        message: error.response.data.msg || "Something went wrong",
      });
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <img src={logo} alt="logo" />
        <p>
          Welcome back to GoBus! Log in now to book your seats, track buses in
          real-time, and manage your trips effortlessly. Your hassle-free
          journey starts here!
        </p>
      </div>
      <div className="login-right">
        <div className="login-title">
          <h1>Welcome back</h1>
        </div>
        <div className="login-content">
          <div className="login-form">
            <section className="login-inputs">
              <MyInput
                label="Email"
                prefix={<MailOutlined />}
                placeholder="example@gmail.com"
                type="email"
                value={credentials.email}
                onChange={handleInput("email")}
                error={inputErr.email}
              />
              <MyInput
                label="Password"
                prefix={<LockOutlined />}
                placeholder="******"
                type="password"
                value={credentials.password}
                onChange={handleInput("password")}
                error={inputErr.password}
              />
              <section className="remember-me">
                <section>
                  <input type="checkbox" />
                  <label>Remember me</label>
                </section>
                <section>
                  <a href="#">Forgot password?</a>
                </section>
              </section>
            </section>
            <div className="login-button">
              <MyButton
                name="Login"
                color={"#05944F"}
                width={200}
                loading={isLoading}
                onClick={handleSubmit}
              />
            </div>
          </div>

          <div className="login-footer">
            <section className="google-login">
              <img src={googleLogo} style={{ width: 28, height: 28 }} />
              <p>Login with google</p>
            </section>

            <section className="sign-up-link">
              <p>
                Don't have an account?
                <span
                  onClick={() => {
                    setIsRegister(true);
                  }}
                >
                  {" "}
                  Sign up{" "}
                </span>
              </p>
            </section>
          </div>
        </div>
      </div>

      {isRegister && (
        <SignUp_Popup
          isOpen={isRegister}
          isCancel={() => setIsRegister(false)}
        />
      )}
    </div>
  );
}
