import React, { useState } from "react";
import "./style.css";
import {
  ExclamationCircleFilled,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import MyButton from "../../components/button";
import MyInput from "../../components/input";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyDataMessage from "../../components/EmptyDataMessage";
import { Modal, notification } from "antd";

export default function PassengerManagement() {
  const [isAdd, setIsAdd] = useState(false);
  const { confirm } = Modal;
  const [passengers, setPassenger] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [view, setView] = useState(false);
  const [selectedPassenger, setSelectedPassenger] = useState(null);

  const columns = [
    { key: "username", title: "Username", type: "text" },
    { key: "email", title: "Email", type: "text" },
    { key: "mobile", title: "Mobile", type: "number" },
  ];

  return (
    <div className="passenger-management">
      <div className="pm-header">
        <h1>Passenger Management</h1>
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

      {loading ? (
        <Loading size={70} />
      ) : isError ? (
        <ErrorMessage message={isError} />
      ) : passengers.length === 0 ? (
        <EmptyDataMessage message="No user to show" />
      ) : (
        <DataTable
          columns={columns}
          data={passenger.filter((e) => e.username.includes(searchText))}
          onEdit={console.log("Edit Button Clicked")}
          onDelete={console.log("Delete Clicked")}
        />
      )}
    </div>
  );
}
