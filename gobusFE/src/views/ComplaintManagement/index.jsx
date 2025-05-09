import React, { useEffect, useState } from "react";
import "./style.css";
import MyInput from "../../components/input";
import { SearchOutlined } from "@ant-design/icons";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyDataMessage from "../../components/EmptyDataMessage";
import { FaRegEnvelope, FaRegEnvelopeOpen } from "react-icons/fa";
import ComplaintDetails from "../../components/ComplaintDetails";
import { getComplaintsAD } from "../../apis/adminAPIs";

export default function ComplaintManagement() {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [view, setView] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    try {
      setIsError("");
      setLoading(true);
      const { data, code, msg } = await getComplaintsAD();
      if (code === 0) {
        setComplaints(data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setIsError("Something went wrong!");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const filterComplaints = complaints.filter((complaint) => {
    return complaint.userID?.toLowerCase().includes(searchText?.toLowerCase());
  });

  return (
    <div className="complaint-management">
      <div className="complaint-header">
        <h1>User Complaints Management</h1>
      </div>
      <div className="complaint-summary">
        <div className="complaint-summary-box">
          <p className="complaint-count">{complaints.length}</p>
          <p>All Complaints</p>
        </div>
        <div className="complaint-summary-box">
          <p className="complaint-count">
            {complaints.filter((c) => c.status === "Inprogress").length}
          </p>
          <p>In Progress</p>
        </div>
        <div className="complaint-summary-box">
          <p className="complaint-count">
            {complaints.filter((c) => c.status === "Resolved").length}
          </p>
          <p>Resolved </p>
        </div>
      </div>
      <div className="complaint-body">
        <div className="complaint-body-header">
          <div style={{ width: "100%" }}>
            <div style={{ width: "100%" }}>
              <MyInput
                placeholder="Search by User Id"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                height=""
                borderRadius="7px"
              />
            </div>
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
            ) : filterComplaints.length === 0 ? (
              <tr>
                <td colSpan="6" className="center-content">
                  <EmptyDataMessage message="No Complaints to show" />
                </td>
              </tr>
            ) : (
              filterComplaints.map((c, index) => (
                <tr
                  className={
                    c.status === "Inprogress" ? "unchecked" : undefined
                  }
                  key={c._id}
                  onClick={() => setSelectedComplaint(c)}
                >
                  <td>{c.userID}</td>
                  <td>{c.complaintType}</td>
                  <td className="description-cell">{c.complaint}</td>
                  <td>{c.date.split("T")[0]}</td>
                  <td>
                    {c.status !== "Inprogress" ? (
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
          onClose={() => {
            setView(!view);
            fetchComplaints();
          }}
          complaint={selectedComplaint}
        />
      )}
    </div>
  );
}
