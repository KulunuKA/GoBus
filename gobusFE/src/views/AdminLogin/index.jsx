import React, { useState } from "react";
import MyInput from "../../components/input";
import MyButton from "../../components/button";
import { adminLogin } from "../../apis/adminAPIs";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import "./style.css";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [loading, setIsLoading] = useState(false);
  const [inputErr, setInputErr] = useState({});
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setCredentials({
      ...credentials,
      [field]: e.target.value,
    });

    // Clear error when user starts typing
    if (inputErr[field]) {
      setInputErr({
        ...inputErr,
        [field]: "",
      });
    }
  };

  const validateForm = (values) => {
    const newErrors = {};
    if (!values.email) {
      newErrors.email = "Email is required";
    }
    if (!values.password) {
      newErrors.password = "Password is required";
    }

    if (values.email && !values.email.includes("@")) {
      newErrors.email = "Email is invalid";
    }

    if (values.password && values.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setInputErr(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm(credentials)) {
        return;
      }
      setIsLoading(true);

      const { data, code, msg } = await adminLogin(credentials);
      if (code === 0) {
        notification.success({
          message: "Login Successful",
          description: "Welcome to Admin Dashboard",
        });
        navigate("/administrator/dashboard");
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      notification.error({
        message: "Login Failed",
        description: error?.response?.data?.msg || "Something went wrong",
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1>Admin Login</h1>
          <p className="admin-login-subtitle">
            Enter your credentials to access the dashboard
          </p>
        </div>

        <div className="admin-login-form">
          <div className="input-group">
            <MyInput
              label="Email Address"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={handleChange("email")}
              error={inputErr.email}
              onKeyPress={handleKeyPress}
              type="email"
              autoComplete="email"
              errorMessage={inputErr.email}
            />
          </div>

          <div className="input-group">
            <MyInput
              label="Password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange("password")}
              error={inputErr.password}
              onKeyPress={handleKeyPress}
              type="password"
              autoComplete="current-password"
              errorMessage={inputErr.password}
            />
          </div>

          <div className="forgot-password">
            <a href="/admin/forgot-password">Forgot password?</a>
          </div>

          <div className="admin-login-button">
            <MyButton
              name="Login"
              loading={loading}
              onClick={handleSubmit}
              width={100}
            />
          </div>
        </div>
      </div>

      <footer className="admin-login-footer">
        <p>&copy; {new Date().getFullYear()} GoBus Administration Panel</p>
      </footer>
    </div>
  );
}
