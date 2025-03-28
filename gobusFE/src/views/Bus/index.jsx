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
        setBuses((prev) => prev.filter((e) => e._id !== id));
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
        <table>
          <thead>
            <tr>
              <th>Bus</th>
              <th>Bus Number</th>
              <th>A/C</th>
              <th>Route</th>
              <th>Bus Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody onClick={() => setView(!view)}>
            {loading ? (
              <tr>
                <td colSpan="6" className="center-content">
                  <Loading size={70} />
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan="6" className="center-content">
                  <ErrorMessage message={isError} />
                </td>
              </tr>
            ) : buses.length === 0 ? (
              <tr>
                <td colSpan="6" className="center-content">
                  <EmptyDataMessage message="No bus added" />
                </td>
              </tr>
            ) : (
              buses
                .filter((e) => e.busNumber.includes(searchText))
                .map((bus, index) => (
                  <tr key={bus._id} onClick={() => setSelectedBusDetails(bus)}>
                    <td>
                      <img src={bus?.pictures[0]} className="bus-pic" />
                    </td>
                    <td>{bus.busNumber}</td>
                    <td>{bus.ac ? "A/C" : "Non A/C"}</td>
                    <td>{bus.route}</td>
                    <td style={{ textTransform: "capitalize" }}>
                      {bus.busType}
                    </td>
                    <td>
                      <MyButton
                        name="Edit"
                        size="small"
                        color={"#3498db"}
                        icon={<EditOutlined />}
                        mt={10}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBus(bus);
                          setIsUpdate(true);
                        }}
                      />
                      <MyButton
                        size="small"
                        name="Delete"
                        color={"#e74c3c"}
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          confirm({
                            title: "Do you want to delete this bus?",
                            icon: <ExclamationCircleFilled />,
                            okText: "Yes",
                            okType: "danger",
                            cancelText: "No",
                            onOk() {
                              deleteBus(bus._id);
                            },
                            onCancel() {
                              console.log("Cancel");
                            },
                          });
                        }}
                      />
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
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
