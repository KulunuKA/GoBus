import React, { useEffect, useState } from "react";
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
import { deletePassengerAD, getPassengersAD } from "../../apis/adminAPIs";
import DataTable from "../../components/DataTable";

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

  const fetchPassengers = async () => {
    try {
      setIsError("");
      setLoading(true);
      const { data, code, msg } = await getPassengersAD();
      if (code === 0) {
        setPassenger(data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setIsError("Something went wrong!");
      console.log(error);
    }
  };

  const deletePas = async (id) => {
    try {
      setIsError("");
      setLoading(true);
      const { data, code, msg } = await deletePassengerAD(id);
      if (code === 0) {
        setPassenger((prev) => prev.filter((e) => e._id !== id));
        notification.success({
          message: msg,
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setIsError("Something went wrong!");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPassengers();
  }, []);

  return (
    <div className="passenger-management">
      <div className="pm-header">
        <h1>Passenger Management</h1>
      </div>
      <div className="pm-body">
        <div className="pm-body-header">
          <div>
            <MyInput
              placeholder="Search by username"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              height=""
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
          data={passengers.filter((e) =>
            e?.username
              .toLocaleLowerCase()
              .includes(searchText?.toLocaleLowerCase())
          )}
          onEdit={console.log("Edit Button Clicked")}
          onDelete={(data) => {
            confirm({
              title: "Are you sure you want to delete this passenger?",
              icon: <ExclamationCircleFilled />,
              onOk() {
                deletePas(data._id);
              },
            });
          }}
        />
      )}
    </div>
  );
}
