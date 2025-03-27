import React, { useState } from "react";
import "./style.css";
import MyInput from "../../components/input";
import { SearchOutlined } from "@ant-design/icons";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyDataMessage from "../../components/EmptyDataMessage";
import { FaRegEnvelope, FaRegEnvelopeOpen } from "react-icons/fa";
import ComplaintDetails from "../../components/ComplaintDetails";
import Dropdown from "../../components/Dropdown";

export default function ComplaintManagement() {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [view, setView] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const complaintsList = [
    {
      complaintId: 1,
      userId: 1,
      about: "bus",
      description: "This Complaint about bus",
      status: "In Progress",
      date: "2024-12-03",
    },
    {
      complaintId: 2,
      userId: 2,
      about: "bus",
      description: "This Complaint about bus",
      status: "In Progress",
      date: "2024-12-03",
    },
    {
      complaintId: 3,
      userId: 3,
      about: "bus",
      description:
        "This Complaint about busaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      status: "Resolved",
      date: "2024-12-03",
    },
    {
      complaintId: 5,
      userId: 1,
      about: "bus",
      description: "This Complaint about bus",
      status: "In Progress",
      date: "2024-12-03",
    },
    {
      complaintId: 6,
      userId: 2,
      about: "bus",
      description: "This Complaint about bus",
      status: "In Progress",
      date: "2024-12-03",
    },
    {
      complaintId: 7,
      userId: 3,
      about: "bus",
      description: "This Complaint about bus",
      status: "Resolved",
      date: "2024-12-03",
    },
  ];

  return (
    <div className="complaint-management">
      <div className="complaint-header">
        <h1>User Complaints Management</h1>
      </div>
      <div className="complaint-summary">
        <div className="complaint-summary-box">
          <p className="complaint-count">{complaintsList.length}</p>
          <p>All Complaints</p>
        </div>
        <div className="complaint-summary-box">
          <p className="complaint-count">
            {complaintsList.filter((c) => c.status === "In Progress").length}
          </p>
          <p>In Progress</p>
        </div>
        <div className="complaint-summary-box">
          <p className="complaint-count">
            {complaintsList.filter((c) => c.status === "Resolved").length}
          </p>
          <p>Resolved </p>
        </div>
      </div>
      <div className="complaint-body">
        <div className="complaint-body-header">
          <div style={{ width: "300px" }}>
            <MyInput
              placeholder="Enter User ID"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              borderRadius="7px"
              width="200px"
            />
          </div>
          <div style={{ width: "300px" }}>
            <MyInput
              placeholder="Filter By Date"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              borderRadius="7px"
              type="date"
              width="200px"
            />
          </div>
          <div>
            <Dropdown
              placeholder={"Complaints About"}
              width="200px"
              borderRadius="7px"
            />
          </div>

          <div>
            <Dropdown
              placeholder={"Resolved / In Progress"}
              width="200px"
              borderRadius="7px"
            />
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>About</th>
              <th>Complaint</th>
              <th>Date</th>
              <th>Status</th>
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
            ) : complaintsList.length === 0 ? (
              <tr>
                <td colSpan="6" className="center-content">
                  <EmptyDataMessage message="No Complaints to show" />
                </td>
              </tr>
            ) : (
              complaintsList.map((c, index) => (
                <tr
                  className={
                    c.status === "In Progress" ? "unchecked" : undefined
                  }
                  key={c.complaintId}
                  onClick={() => setSelectedComplaint(c)}
                >
                  <td>{c.userId}</td>
                  <td>{c.about}</td>
                  <td className="description-cell">{c.description}</td>
                  <td>{c.date}</td>
                  <td>
                    {c.status !== "In Progress" ? (
                      <FaRegEnvelopeOpen />
                    ) : (
                      <FaRegEnvelope />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {view && (
        <ComplaintDetails
          isOpen={view}
          onClose={() => setView(!view)}
          complaint={selectedComplaint}
        />
      )}
    </div>
  );
}
