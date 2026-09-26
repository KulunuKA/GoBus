import React, { useEffect, useState } from "react";
import "./style.css";
import MyInput from "../../components/input";
import { SearchOutlined } from "@ant-design/icons";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import EmptyDataMessage from "../../components/EmptyDataMessage";
import { FaRegEnvelope, FaRegEnvelopeOpen } from "react-icons/fa";
import { MdFileDownloadDone } from "react-icons/md";
import Dropdown from "../../components/Dropdown";
import { getSupportTicketsAD } from "../../apis/adminAPIs";
import TicketDetails from "../../components/TicketDetails";

export default function AdminSupportCenter() {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [view, setView] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tickets, setTickets] = useState([]);

  const allTicketCount = tickets.length;

  const inProgressTicketCount = tickets.filter(
    (ticket) => ticket.status === "in_progress"
  ).length;

  const fetchTickets = async () => {
    try {
      setIsError("");
      setLoading(true);
      const { data, code, msg } = await getSupportTicketsAD();
      if (code === 0) {
        const sortedTickets = data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setTickets(sortedTickets);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setIsError("Something went wrong!");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    return (
      ticket._id?.toLowerCase().includes(searchText?.toLowerCase()) ||
      ticket.subject?.toLowerCase().includes(searchText?.toLowerCase())
    );
  });

  console.log("Filter length ", filteredTickets.length);

  return (
    <div className="complaint-management">
      <div className="complaint-header">
        <h1>Support Ticket Management</h1>
      </div>
      <div className="complaint-summary">
        <div className="complaint-summary-box">
          <p className="complaint-count">{allTicketCount}</p>
          <p>All Tickets</p>
        </div>
        <div className="complaint-summary-box">
          <p className="complaint-count">{inProgressTicketCount}</p>
          <p>In Progress</p>
        </div>
        <div className="complaint-summary-box">
          <p className="complaint-count">
            {allTicketCount - inProgressTicketCount}
          </p>
          <p>Closed Tickets </p>
        </div>
      </div>
      <div className="complaint-body">
        <div className="tickets-body-header">
          <div
            style={{
              width: "100%",
              height: "40px",
            }}
          >
            <MyInput
              placeholder="Enter Ticket ID or Subject"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              borderRadius="7px"
              width="100%"
            />
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Subject</th>
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
            ) : filteredTickets.length === 0 ? (
              <tr>
                <td colSpan="6" className="center-content">
                  <EmptyDataMessage message="No Tickets to show" />
                </td>
              </tr>
            ) : (
              filteredTickets.map((c, index) => (
                <tr
                  className={
                    c.status === "open"
                      ? "unchecked"
                      : c.status === "in_progress"
                      ? "checked"
                      : c.status === "closed"
                      ? "closed"
                      : undefined
                  }
                  key={c._id}
                  onClick={() => setSelectedTicket(c)}
                >
                  <td>{c._id}</td>

                  <td className="description-cell">{c.subject}</td>
                  <td>{c.date.split("T")[0]}</td>
                  <td>
                    {c.status === "open" ? (
                      <FaRegEnvelope />
                    ) : c.status === "in_progress" ? (
                      <FaRegEnvelopeOpen />
                    ) : c.status === "closed" ? (
                      <MdFileDownloadDone />
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {view && (
        <TicketDetails
          isOpen={view}
          onClose={() => {
            setView(!view);
            fetchTickets();
          }}
          ticket={selectedTicket}
        />
      )}
    </div>
  );
}
