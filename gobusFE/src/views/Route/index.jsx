import React, { useEffect, useState } from "react";
import MyInput from "../../components/input";
import MyButton from "../../components/button";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { Modal, notification } from "antd";
import { useSelector } from "react-redux";
import { busOwnerData } from "../../store/busOwnerSlice";
import { deleteRoute, getRoutes } from "../../apis/busOwner";
import Loading from "../../components/Loading";
import EmptyDataMessage from "../../components/EmptyDataMessage";
import ErrorMessage from "../../components/ErrorMessage";
import BusUpdateForm from "../../components/BusUpdateForm";
import RouteForm from "../../components/RouteAddForm";
import RouteDetails from "../../components/RouteDetails";
import RouteUpdateForm from "../../components/RouteUpdateForm";

export default function Route() {
  const [isAdd, setIsAdd] = useState(false);
  const { id } = useSelector(busOwnerData);
  const { confirm } = Modal;
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [view, setView] = useState(false);
  const [selectedRouteDetails, setSelectedRouteDetails] = useState(null);

  const fetchRoutes = async () => {
    try {
      setIsError("");
      setLoading(true);
      const { data, code, msg } = await getRoutes(id);
      if (code === 0) {
        setRoutes(data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setIsError("Something went wrong!");
      console.log(error);
    }
  };

  const deleteRouteFuc = async (id) => {
    try {
      setIsError("");
      setLoading(true);
      const { data, code, msg } = await deleteRoute(id);
      if (code === 0) {
        notification.success({
          message: msg,
        });
        fetchRoutes();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setIsError("Something went wrong!");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  return (
    <div>
      <div className="bus-header">
        <h1>Route</h1>
      </div>
      <div className="bus-body">
        <div className="bus-body-header">
          <div>
            <MyInput
              placeholder="Enter Route Number"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <MyButton
            name="Add Route"
            icon={<PlusCircleOutlined />}
            color={"#2D3436"}
            onClick={() => setIsAdd(true)}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>Route Number</th>
              <th>Start-End</th>
              <th>Distance</th>
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
            ) : routes.length === 0 ? (
              <tr>
                <td colSpan="6" className="center-content">
                  <EmptyDataMessage message="No bus added" />
                </td>
              </tr>
            ) : (
              routes
                .filter((e) => e.route_number.includes(searchText))
                .map((route, index) => (
                  <tr
                    key={route._id}
                    onClick={() => setSelectedRouteDetails(route)}
                  >
                    <td>{route.route_number}</td>
                    <td>{route.start + "-" + route.end}</td>
                    <td>{route.distance + " KM"}</td>
                    <td>
                      <MyButton
                        name="Edit"
                        color={"rgba(5, 148, 79, 1)"}
                        icon={<EditOutlined />}
                        mt={10}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRoute(route);
                          setIsUpdate(true);
                        }}
                      />
                      <MyButton
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
                              deleteRouteFuc(route._id);
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

      <RouteForm
        isOpen={isAdd}
        onCancel={() => {
          setIsAdd(false);
        }}
        refresh={() => {
          fetchRoutes();
        }}
      />

      {isUpdate && (
        <RouteUpdateForm
          data={selectedRoute}
          isOpen={isUpdate}
          onCancel={() => {
            setIsUpdate(false);
          }}
          refresh={() => {
            fetchRoutes();
          }}
        />
      )}

      {view && (
        <RouteDetails
          isOpen={view}
          onClose={() => setView(!view)}
          route={selectedRouteDetails}
        />
      )}
    </div>
  );
}
