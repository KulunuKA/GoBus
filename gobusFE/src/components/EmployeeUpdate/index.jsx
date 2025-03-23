import React, { useState } from "react";
import { Modal, notification } from "antd";
import MyInput from "../../components/input";
import DropDown from "../../components/Dropdown";
import MyButton from "../../components/button";
// import "./style.css";

import { updateBusAPI, updateEmployee } from "../../apis/busOwner";
import { busOwnerData } from "../../store/busOwnerSlice";
import { useSelector } from "react-redux";

export default function EmployeeUpdateForm({
  isOpen,
  onCancel,
  refresh,
  data,
}) {
  const { id } = useSelector(busOwnerData);
  const busTypes = ["Public transport", "Special service", "Both"];
  const [empData, setEmpData] = useState({
    ownerID: id,
    name: data.name,
    age: data.age,
    position: data.position,
    salary: data.salary,
    status: data.status,
  });
  const [isLoading, setIsLoading] = useState(false);

  const inputHandle = (field) => (e) => {
    setEmpData({ ...empData, [field]: e.target.value });
  };

  const handleSubmit = async (id) => {
    try {
      if (
        !empData.name ||
        !empData.age ||
        !empData.position ||
        !empData.salary
      ) {
        notification.error({
          message: "Fill all fields",
        });
        return;
      }
      setIsLoading(true);

      const { data, code, msg } = await updateEmployee(id, empData);
      if (code === 0) {
        notification.success({
          message: msg,
        });
        onCancel();
        refresh();
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
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
            <p>Update Bus</p>
          </div>
          <div className="ab-content">
            <div>
              <MyInput
                label={"Name"}
                placeholder="ex : DSD"
                onChange={inputHandle("name")}
                value={empData.name}
              />
              <MyInput
                label={"Age"}
                type="text"
                placeholder="ex : 25"
                onChange={inputHandle("age")}
                value={empData.age}
              />
              <MyInput
                label={"Salary"}
                type="number"
                onChange={inputHandle("salary")}
                value={empData.salary}
                placeholder="ex : 25000"
              />
              <div className="bt-select">
                <label>Position</label>
                <DropDown
                  placeholder={"Select Position"}
                  defaultValue={empData.position}
                  onChange={(value) => {
                    setEmpData({ ...empData, position: value });
                  }}
                  options={["Conductor", "Driver"].map((e) => ({
                    label: e,
                    value: e,
                  }))}
                />
              </div>
            </div>

            <div className="ab-btn">
              <MyButton
                name="Update"
                width={150}
                color={" #2D3436"}
                onClick={() => handleSubmit(data._id)}
                loading={isLoading}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
