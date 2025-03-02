import React, { useState } from "react";
import MyInput from "../../components/input";
import MyButton from "../../components/button";
import googleLogo from "../../assets/images/google-logo.png";
import logo from "../../assets/images/white-logo.png";
import { MailOutlined, LockOutlined } from "@ant-design/icons";

import "./style.css";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
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
              />
              <MyInput
                label="Password"
                prefix={<LockOutlined />}
                placeholder="******"
                type="password"
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
                onClick={() => setIsLoading(!isLoading)}
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
                <span> Sign up </span>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
