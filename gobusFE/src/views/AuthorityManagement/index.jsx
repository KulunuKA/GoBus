import React, { useEffect, useState } from "react";
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
import {
  deletePassengerAD,
  getAuthoritiesAD,
  getPassengersAD,
} from "../../apis/adminAPIs";
import DataTable from "../../components/DataTable";
import AdminUserAddForm from "../../components/AdminUserAddForm";
import AdminUserUpdateFormForm from "../../components/AdminUserUpdateForm";

export default function AuthorityManagement() {
  const [isAdd, setIsAdd] = useState(false);
  const { confirm } = Modal;
  const [authorities, setAuthorities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [view, setView] = useState(false);
  const [selectedAuthority, setSelectedAuthority] = useState(null);

  const columns = [
    { key: "authorityName", title: "Name", type: "text" },
    { key: "email", title: "Email", type: "text" },
    { key: "phone", title: "Mobile", type: "number" },
    { key: "address", title: "Address", type: "text" },
  ];

  const fetchAuthorities = async () => {
    try {
      setIsError("");
      setLoading(true);
      const { data, code, msg } = await getAuthoritiesAD();
      if (code === 0) {
        setAuthorities(data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setIsError("Something went wrong!");
      console.log(error);
    }
  };

  const deleteAuth = async (id) => {
    console.log("Delet Auth Id: ", id);
   
  };

  useEffect(() => {
    fetchAuthorities();
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
            name="Add Authority"
            icon={<PlusCircleOutlined />}
            color={"#2D3436"}
            onClick={() => setView(true)}
          />
        </div>
      </div>

      {loading ? (
        <Loading size={70} />
      ) : isError ? (
        <ErrorMessage message={isError} />
      ) : authorities.length === 0 ? (
        <EmptyDataMessage message="No user to show" />
      ) : (
        <DataTable
          onView={(data) => {
            console.log("onView: ", data);
          }}
          columns={columns}
          data={authorities.filter((e) =>
            e?.authorityName
              .toLocaleLowerCase()
              .includes(searchText?.toLocaleLowerCase())
          )}
          onEdit={(data) => {
            console.log("Edit Button Clicked", data);
            setSelectedAuthority(data);
            setIsUpdate(true);
          }}
          onDelete={(data) => {
            confirm({
              title: "Are you sure you want to delete this Authority?",
              icon: <ExclamationCircleFilled />,
              onOk() {
                deleteAuth(data._id);
              },
            });
          }}
        />
      )}

      {view && (
        <AdminUserAddForm
          isOpen={view}
          user="authority"
          onClose={() => {
            setView(!view);
          }}
        />
      )}
      {isUpdate && (
        <AdminUserUpdateFormForm
          user="authority"
          isOpen={isUpdate}
          selectedUser={selectedAuthority}
          onClose={() => {
            setIsUpdate(!isUpdate);
          }}
        />
      )}
    </div>
  );
}
