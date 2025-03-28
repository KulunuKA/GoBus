import React, { useState, useEffect } from "react";
import MyInput from "../../components/input";
import MyButton from "../../components/button";
import googleLogo from "../../assets/images/google-logo.png";
import logo from "../../assets/images/white-logo.png";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import "./style.css";
import { notification } from "antd";
import { login } from "../../apis/userAPIs";
import SignUp_Popup from "../../components/LoginSignUpModal/LoginSignUpModal";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { busOwnerData, setUserInfo } from "../../store/busOwnerSlice";
import { passengerData, setPassengerInfo } from "../../store/passengerSlice";

export default function LoginPage() {
  const passengerRedux = useSelector(passengerData);
  const busOwnerRedux = useSelector(busOwnerData);
  const role = passengerRedux?.role || busOwnerRedux?.role;
  const [isLoading, setIsLoading] = useState(false);
  const [inputErr, setInputErr] = useState({});
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [isRegister, setIsRegister] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoggedUserRoute = () => {
    if (role === "Passenger") {
      navigate("/");
    } else if (role === "BusOwner") {
      navigate("/busowner/dashboard");
    }
  };

  useEffect(() => {
    handleLoggedUserRoute();
  }, []);

  const handleInput = (field) => (e) => {
    setInputErr({ ...inputErr, [field]: false });
    setCredentials({ ...credentials, [field]: e.target.value });
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

      const { data, code, msg } = await login(credentials);
      if (code === 0) {
        if (data.role === "BusOwner") {
          dispatch(setUserInfo(data));
          navigate("/busowner/dashboard");
        } else if (data.role === "Passenger") {
          dispatch(setPassengerInfo(data));
          navigate("/");
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      notification.error({
        message: error?.response?.data?.msg || "Something went wrong",
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
                errorMessage={inputErr.email}
              />
              <MyInput
                label="Password"
                prefix={<LockOutlined />}
                placeholder="******"
                type="password"
                value={credentials.password}
                onChange={handleInput("password")}
                error={inputErr.password}
                errorMessage={inputErr.password}
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
