import React, { useState } from "react";
import { Modal } from "antd";
import "./style.css";
import MyButton from "../button";
import { useNavigate } from "react-router-dom";
import {
  createOrOpenChatAD,
  updateTicketInProgressAD,
} from "../../apis/adminAPIs";

export default function TicketDetails({ isOpen, onClose, ticket }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const key_values = [
    { key: "Ticket ID", value: ticket?._id || "N/A" },
    { key: "User ID", value: ticket?.userId || "N/A" },
    { key: "Subject", value: ticket?.subject || "N/A" },
    { key: "Date", value: ticket?.date || "N/A" },
    { key: "Description", value: ticket?.description || "N/A" },
    { key: "Status", value: ticket?.status || "N/A" },
  ];

  const navigate = useNavigate();

  const handleStartChat = async () => {
    if (!ticket?._id) {
      setError("Ticket ID is missing");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Starting chat for ticket:", ticket._id);

      const updateResponse = await updateTicketInProgressAD(ticket._id, {
        status: "in_progress",
      });

      console.log("Update ticket response:", updateResponse);

      if (!updateResponse) {
        throw new Error("No response received from update ticket API");
      }

      console.log(
        "Creating or opening chat for ticket:",
        ticket._id,
        "and user:",
        ticket.userId
      );
      const chatResponse = await createOrOpenChatAD(ticket._id, ticket.userId);

      console.log("Chat response:", chatResponse);

      console.log("The Passing ticket id for chat: ", ticket._id);
      console.log("The Passing user id for chat: ", ticket.userId);
      navigate(`/administrator/chatRoom/${ticket._id}`);
    } catch (err) {
      console.error("Failed to start chat:", err);
      setError(err.message || "Failed to start chat");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal open={isOpen} onCancel={onClose} footer={null}>
        <div className="ticket-details">
          <div className="ticket-header">
            <p>Ticket Details</p>
          </div>
          <div className="ticket-content">
            <div>
              {key_values.map((item, index) => (
                <div key={index} className="ticket-content-item">
                  <p>{item.key} : </p>
                  <p>{item.value}</p>
                </div>
              ))}
              <div className="ticket-pictures-container">
                {ticket?.pictures &&
                  ticket.pictures
                    .filter((e) => e !== "")
                    .map((pic, index) => (
                      <img
                        src={pic}
                        key={index}
                        alt={`Ticket attachment ${index}`}
                      />
                    ))}
              </div>
              {error && (
                <div
                  className="error-message"
                  style={{ color: "red", marginTop: "10px" }}
                >
                  {error}
                </div>
              )}
            </div>
          </div>

          {ticket.status !== "closed" && (
            <MyButton
              name={loading ? "Processing..." : "Start Chat"}
              color="#05944f"
              onClick={handleStartChat}
              disabled={loading}
            />
          )}
        </div>
      </Modal>
    </>
  );
}
