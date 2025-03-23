import React, { useState } from "react";
import { Modal, notification } from "antd";
import MyInput from "../../components/input";
import DropDown from "../../components/Dropdown";
import MyButton from "../../components/button";
import { addRoute } from "../../apis/busOwner";
import { busOwnerData } from "../../store/busOwnerSlice";
import { useSelector } from "react-redux";
import { onlyCities } from "../../assets/district_city";

export default function RouteForm({ isOpen, onCancel, refresh }) {
  const { id } = useSelector(busOwnerData);
  const [routeData, setRouteData] = useState({
    ownerID: id,
    route_number: "",
    start: "",
    end: "",
    distance: "",
    main_cities: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const inputHandle = (field) => (e) => {
    setRouteData({ ...routeData, [field]: e.target.value });
    setErrors({ ...errors, [field]: "" });
  };

  const validateForm = (values) => {
    const newErrors = {};

    if (!values.route_number) {
      newErrors.route_number = "Route number is required";
    }

    if (!values.start) {
      newErrors.start = "Starting point is required";
    }

    if (!values.end) {
      newErrors.end = "Destination is required";
    }

    if (!values.distance) {
      newErrors.distance = "Distance is required";
    } else if (isNaN(values.distance) || Number(values.distance) <= 0) {
      newErrors.distance = "Please enter a valid distance";
    }

    if (values.start === values.end && values.start) {
      newErrors.end = "Start and end locations cannot be the same";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      const isValid = validateForm(routeData);

      if (!isValid) {
        return;
      }
      setIsLoading(true);

      const { data, code, msg } = await addRoute(routeData);

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
            <p>Add Route</p>
          </div>
          <div className="ab-content">
            <div>
              <MyInput
                label={"Route Number"}
                placeholder="ex : Saman"
                onChange={inputHandle("route_number")}
                value={routeData.route_number}
                error={errors.route_number}
                errorMessage={errors.route_number}
              />

              <MyInput
                label={"Distance"}
                type="number"
                onChange={inputHandle("distance")}
                value={routeData.distance}
                placeholder=" km"
                error={errors.distance}
                errorMessage={errors.distance}
              />
              <div className="bt-select">
                <label>Start</label>
                <DropDown
                  placeholder={"Select trip start"}
                  onChange={(value) => {
                    setRouteData({ ...routeData, start: value });
                  }}
                  options={onlyCities.map((e) => ({
                    label: e,
                    value: e,
                  }))}
                />
              </div>

              <div className="bt-select">
                <label>End</label>
                <DropDown
                  placeholder={"Select trip end"}
                  onChange={(value) => {
                    setRouteData({ ...routeData, end: value });
                  }}
                  options={onlyCities.map((e) => ({
                    label: e,
                    value: e,
                  }))}
                />
              </div>
              <div className="bt-select">
                <label>Main Cities</label>
                <DropDown
                  placeholder={"Select main cities"}
                  onChange={(value) => {
                    setRouteData({ ...routeData, main_cities: value });
                  }}
                  options={onlyCities.map((e) => ({
                    label: e,
                    value: e,
                  }))}
                  mode="multiple"
                />
              </div>
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
