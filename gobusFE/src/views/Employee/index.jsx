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
import {
  deleteBusAPI,
  deleteEmployee,
  getBuses,
  getEmployees,
} from "../../apis/busOwner";
import Loading from "../../components/Loading";
import EmptyDataMessage from "../../components/EmptyDataMessage";
import ErrorMessage from "../../components/ErrorMessage";
import BusUpdateForm from "../../components/BusUpdateForm";
import BusDetails from "../../components/BusDetails";
import EmployeeForm from "../../components/EmployeeAddForm";
import EmployeeUpdateForm from "../../components/EmployeeUpdate";

export default function Employee() {
  const [isAdd, setIsAdd] = useState(false);
  const { id } = useSelector(busOwnerData);
  const { confirm } = Modal;
  const [employees, setEmployee] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);

  const fetchEmployees = async () => {
    try {
      setIsError("");
      setLoading(true);
      const { data, code, msg } = await getEmployees(id);
      if (code === 0) {
        setEmployee(data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setIsError("Something went wrong!");
      console.log(error);
    }
  };

  const deleteEmp = async (id) => {
    try {
      setIsError("");
      setLoading(true);
      const { data, code, msg } = await deleteEmployee(id);
      console.log(data, code, msg);
      if (code === 0) {
        notification.success({
          message: msg,
        });
        fetchEmployees();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setIsError("Something went wrong!");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div>
      <div className="bus-header">
        <h1>Employee</h1>
      </div>
      <div className="bus-body">
        <div className="bus-body-header">
          <div>
            <MyInput
              placeholder="Enter Name"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <MyButton
            name="Add Employee"
            icon={<PlusCircleOutlined />}
            color={"#2D3436"}
            onClick={() => setIsAdd(true)}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Position</th>
              <th>Salary(LKR)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
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
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan="6" className="center-content">
                  <EmptyDataMessage message="No employee added" />
                </td>
              </tr>
            ) : (
              employees
                .filter((e) => e.name.includes(searchText))
                .map((emp, index) => (
                  <tr key={emp._id}>
                    <td>{emp.name}</td>
                    <td>{emp.age}</td>
                    <td>{emp.position}</td>
                    <td>{emp.salary}</td>
                    <td>{emp.status}</td>
                    <td>
                      <MyButton
                        name="Edit"
                        color={"rgba(5, 148, 79, 1)"}
                        icon={<EditOutlined />}
                        mt={10}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEmp(emp);
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
                            title: "Do you want to delete this employee?",
                            icon: <ExclamationCircleFilled />,
                            okText: "Yes",
                            okType: "danger",
                            cancelText: "No",
                            onOk() {
                              deleteEmp(emp._id);
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

      {isAdd && (
        <EmployeeForm
          isOpen={isAdd}
          onCancel={() => {
            setIsAdd(false);
          }}
          refresh={() => {
            fetchEmployees();
          }}
        />
      )}

      {isUpdate && (
        <EmployeeUpdateForm
          data={selectedEmp}
          isOpen={isUpdate}
          onCancel={() => {
            setIsUpdate(false);
          }}
          refresh={() => {
            fetchEmployees();
          }}
        />
      )}


    </div>
  );
}
