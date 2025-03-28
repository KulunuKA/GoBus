import React, { useEffect, useState } from "react";
import MyInput from "../../components/input";
import MyButton from "../../components/button";
import BusForm from "../../components/BusAddForm";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { Modal, notification } from "antd";
import { useSelector } from "react-redux";
import "./style.css";
import { busOwnerData } from "../../store/busOwnerSlice";
import { deleteBusAPI, getBuses } from "../../apis/busOwner";
import Loading from "../../components/Loading";
import EmptyDataMessage from "../../components/EmptyDataMessage";
import ErrorMessage from "../../components/ErrorMessage";
import BusUpdateForm from "../../components/BusUpdateForm";
import BusDetails from "../../components/BusDetails";
import DataTable from "../../components/DataTable";

export default function Bus() {
  const [isAdd, setIsAdd] = useState(false);
  const { id } = useSelector(busOwnerData);
  const { confirm } = Modal;
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [view, setView] = useState(false);
  const [selectedBusDetails, setSelectedBusDetails] = useState(null);

  const fetchBuses = async () => {
    try {
      setIsError("");
      setLoading(true);
      const { data, code, msg } = await getBuses(id);
      if (code === 0) {
        setBuses(data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setIsError("Something went wrong!");
      console.log(error);
    }
  };

  const deleteBus = async (id) => {
    try {
      setIsError("");
      setLoading(true);
      const { data, code, msg } = await deleteBusAPI(id);
      if (code === 0) {
        notification.success({
          message: msg,
        });
        fetchBuses();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setIsError("Something went wrong!");
      console.log(error);
    }
  };

  // Define columns for the DataTable
  const columns = [
    { key: "pictures", title: "Bus", type: "image" },
    { key: "busNumber", title: "Bus Number", type: "text" },
    { key: "driverID.name", title: "Driver", type: "text" },
    { key: "route_id.route_number", title: "Route Number", type: "text" },
    { key: "busType", title: "Bus Type", type: "text" },
  ];

  useEffect(() => {
    fetchBuses();
  }, []);

  return (
    <div>
      <div className="bus-header">
        <h1>Bus</h1>
      </div>
      <div className="bus-body">
        <div className="bus-body-header">
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

        {loading ? (
          <Loading size={70} />
        ) : isError ? (
          <ErrorMessage message={isError} />
        ) : buses.length === 0 ? (
          <EmptyDataMessage message="No bus added" />
        ) : (
          <DataTable
            columns={columns}
            data={buses.filter((e) => e.busNumber.includes(searchText))}
            onEdit={(bus) => {
              setSelectedBus(bus);
              setIsUpdate(true);
            }}
            onDelete={(bus) =>
              confirm({
                title: "Do you want to delete this bus?",
                icon: <ExclamationCircleFilled />,
                okText: "Yes",
                okType: "danger",
                cancelText: "No",
                onOk() {
                  deleteBus(bus._id);
                },
              })
            }
          />
        )}
      </div>

      <BusForm
        isOpen={isAdd}
        onCancel={() => {
          setIsAdd(false);
        }}
        refresh={() => {
          fetchBuses();
        }}
      />

      {isUpdate && (
        <BusUpdateForm
          data={selectedBus}
          isOpen={isUpdate}
          onCancel={() => {
            setIsUpdate(false);
          }}
          refresh={() => {
            fetchBuses();
          }}
        />
      )}

      {view && (
        <BusDetails
          isOpen={view}
          onClose={() => setView(!view)}
          bus={selectedBusDetails}
        />
      )}
    </div>
  );
}
