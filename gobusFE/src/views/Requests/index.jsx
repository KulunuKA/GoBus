import React, { useEffect, useState } from "react";
import MyInput from "../../components/input";
import MyButton from "../../components/button";
import { SearchOutlined } from "@ant-design/icons";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyDataMessage from "../../components/EmptyDataMessage";
import { getRequests } from "../../apis/busOwner";
import { useSelector } from "react-redux";
import { busOwnerData } from "../../store/busOwnerSlice";
import { Modal } from "antd";

export default function Requests() {
  const [isAdd, setIsAdd] = useState(false);
  const { id } = useSelector(busOwnerData);
  const { confirm } = Modal;
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [view, setView] = useState(false);
  const [selectedBusDetails, setSelectedBusDetails] = useState(null);

  const fetchRequests = async () => {
    try {
      setIsError("");
      setLoading(true);
      const { data, code, msg } = await getRequests(id);
      if (code === 0) {
        setRequests(data);
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
        fetchRequests();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setIsError("Something went wrong!");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div>
      <div className="bus-header">
        <h1>Requests</h1>
      </div>
      <div className="bus-body">
        <div className="bus-body-header">
          <div>
            <MyInput
              placeholder="Enter Bus Number"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* <BusForm
        isOpen={isAdd}
        onCancel={() => {
          setIsAdd(false);
        }}
        refresh={() => {
          Requests();
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
            Requests();
          }}
        />
      )}

      {view && (
        <BusDetails
          isOpen={view}
          onClose={() => setView(!view)}
          bus={selectedBusDetails}
        />
      )} */}
    </div>
  );
}
