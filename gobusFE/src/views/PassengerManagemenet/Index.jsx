import React from "react";
import "./style.css";
import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";

export default function PassengerManagement() {
  return (
    <div className="passenger-management">
      <div className="pm-header">
        <h1>User Complaints Management</h1>
      </div>
      <div className="pm-body">
        <div className="pm-body-header">
          <div>
            <MyInput
              placeholder="Enter Bus Number"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              borderRadius="30px"
            />
          </div>
          <MyButton
            name="Add Bus"
            icon={<PlusCircleOutlined />}
            color={"#2D3436"}
            onClick={() => setIsAdd(true)}
          />
        </div>
      </div>
    </div>
  );
}
