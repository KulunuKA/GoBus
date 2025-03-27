import React, { useState } from "react";
import { Modal, notification } from "antd";
import MyInput from "../../components/input";
import DropDown from "../../components/Dropdown";
import MyButton from "../../components/button";
import { addEmployee } from "../../apis/busOwner";
import { busOwnerData, updateEmployeeId } from "../../store/busOwnerSlice";
import { useDispatch, useSelector } from "react-redux";

export default function EmployeeForm({ isOpen, onCancel, refresh }) {
  const { id } = useSelector(busOwnerData);
  const [empData, setEmpData] = useState({
    ownerID: id,
    name: "",
    age: "",
    position: "",
    salary: "",
    status: "unassign",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const inputHandle = (field) => (e) => {
    setEmpData({ ...empData, [field]: e.target.value });
    setErrors({ ...errors, [field]: "" });
  };

  const validateForm = (values) => {
    const newErrors = {};

    if (!values.name) {
      newErrors.name = "Name is required";
    }

    if (!values.age) {
      newErrors.age = "Age is required";
    }

    if (!values.salary) {
      newErrors.salary = "Salary is required";
    }

    if (values.salary <= 0) {
      newErrors.salary = "Salary must be greater than 0";
    }

    if (!values.position) {
      newErrors.position = "Position is required";
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

      const { data, code, msg } = await addEmployee(empData);

      if (code === 0) {
        dispatch(updateEmployeeId(data._id));
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
            <p>Add Employee</p>
          </div>
          <div className="ab-content">
            <div>
              <MyInput
                label={"Name"}
                placeholder="Enter Name"
                onChange={inputHandle("name")}
                value={empData.name}
                error={errors.name}
                errorMessage={errors.name}
              />
              <MyInput
                label={"Age"}
                type="text"
                placeholder="ex : 25"
                onChange={inputHandle("age")}
                value={empData.age}
                error={errors.age}
                errorMessage={errors.age}
              />
              <MyInput
                label={"Salary"}
                type="number"
                onChange={inputHandle("salary")}
                value={empData.salary}
                placeholder="ex : 25000"
                error={errors.salary}
                errorMessage={errors.salary}
              />
              <div className="bt-select">
                <label>Position</label>
                <DropDown
                  placeholder={"Select Position"}
                  // value={empData.district}
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
