import React, { useState } from "react";
import { Modal, notification } from "antd";
import MyInput from "../../components/input";
import DropDown from "../../components/Dropdown";
import MyButton from "../../components/button";
import { addEmployee } from "../../apis/busOwner";
import { busOwnerData } from "../../store/busOwnerSlice";
import { useSelector } from "react-redux";

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

  const inputHandle = (field) => (e) => {
    setEmpData({ ...empData, [field]: e.target.value });
  };

  const handleSubmit = async () => {
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

      const { data, code, msg } = await addEmployee(empData);

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
            <p>Add Employee</p>
          </div>
          <div className="ab-content">
            <div>
              <MyInput
                label={"Name"}
                placeholder="ex : Saman"
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
