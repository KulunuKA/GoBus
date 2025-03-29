import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { busOwnerData, setUserInfo } from "../../store/busOwnerSlice";
import { busOwnerRegister } from "../../apis/busOwner";
import { passengerData } from "../../store/passengerSlice";

export default function BusOwner() {
  const passengerRedux = useSelector(passengerData);
  const busOwnerRedux = useSelector(busOwnerData);
  const role = passengerRedux?.role || busOwnerRedux?.role;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [inputErr, setInputErr] = useState({});
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
    setUserData({ ...userData, [field]: e.target.value });
  };

  const validateForm = (values) => {
    const newErrors = {};
    if (!values.authorityName) {
      newErrors.authorityName = "Authority Name is required";
    }
    if (!values.email) {
      newErrors.email = "Email is required";
    }
    if (!values.password) {
      newErrors.password = "Password is required";
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
      if (!validateForm(userData)) return;
      setIsLoading(true);

      const { data, code, msg } = await busOwnerRegister(userData);

      if (code === 0) {
        dispatch(setUserInfo(data));
        navigate("/busowner/dashboard");
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
          <div className="p-form" style={{ height: 450 }}>
            <section className="p-inputs">
              <MyInput
                label={"Authority Name"}
                prefix={<UserOutlined />}
                placeholder={"Authority Name"}
                type="text"
                value={userData.authorityName}
                onChange={handleInput("authorityName")}
                error={inputErr.authorityName}
                errorMessage={inputErr.authorityName}
              />
              <div className="p-dual-input">
                <MyInput
                  label="Email"
                  prefix={<MailOutlined />}
                  placeholder="example@gmail.com"
                  type="email"
                  value={userData.email}
                  onChange={handleInput("email")}
                  error={inputErr.email}
                  errorMessage={inputErr.email}
                  className="p-dual-myInput"
                  // width="220px"
                />

                <MyInput
                  label={"phone"}
                  prefix={<PhoneOutlined />}
                  placeholder={"phone"}
                  value={userData.phone}
                  type="text"
                  onChange={handleInput("phone")}
                  error={inputErr.phone}
                  errorMessage={inputErr.phone}
                  className="p-dual-myInput"
                  // width="220px"
                />
              </div>

              <MyInput
                label="Password"
                prefix={<LockOutlined />}
                placeholder="******"
                type="password"
                value={userData.password}
                onChange={handleInput("password")}
                error={inputErr.password}
                errorMessage={inputErr.password}
              />
              <MyInput
                label={"Address"}
                prefix={<HomeOutlined />}
                placeholder={"Address"}
                value={userData.address}
                type="text"
                onChange={handleInput("address")}
                error={inputErr.address}
                errorMessage={inputErr.address}
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
