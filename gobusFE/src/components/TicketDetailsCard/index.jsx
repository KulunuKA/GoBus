import { useState } from "react";
import "./style.css";
import { format } from "date-fns";
import { Modal } from "antd";
import PassengerButton from "../../components/PassengerButton/index.jsx";
import chatIcon from "../../assets/images/bubble-chat.png";
import PassengerChatRoom from "../PassengerChatRoom/index.jsx";

export default function TicketDetailsCard({ ticket, refresh }) {
  const [showPopup, setShowPopup] = useState(false);
  const [content, setContent] = useState("details");

  const formattedDate = ticket.date
    ? format(new Date(ticket.date), "yyyy-MM-dd HH:mm")
    : "N/A";

  const handleTicketClick = () => {
    setShowPopup(true);
    setContent("details");
  };

  const handleChatRoomClick = () => {
    setContent("chatRoom");
  };

  const handleClose = () => {
    setShowPopup(false);
    setContent("details");
  };
  return (
    <>
      <div className="ticket-details-card" onClick={handleTicketClick}>
        <div className="ticket-info">
          <p>
            <span className="ticket-label">ID:</span> {ticket._id}
          </p>
          <p>
            <span className="ticket-label">Subject:</span> {ticket.subject}
          </p>
          <p>
            <span className="ticket-label">Date:</span> {formattedDate}
          </p>
          <p>
            <span className="ticket-label">Status:</span>
            <span className={`ticket-status ${ticket.status}`}>
              {ticket.status.replace("_", " ")}
            </span>
          </p>
        </div>
      </div>

      {
        <Modal open={showPopup} footer={null} onCancel={handleClose}>
          {content === "details" && (
            <>
              <div className="ticket-popup-title">
                <h2>Support Ticket Details</h2>
              </div>

              <div className="ticket-popup-details">
                <div className="ticket-popup-field">
                  <p className="ticket-popup-field-label">Ticket ID: </p>
                  <p className="ticket-popup-field-data">{ticket._id}</p>
                </div>
                <div className="ticket-popup-field">
                  <p className="ticket-popup-field-label">Opend Date: </p>
                  <p className="ticket-popup-field-data">{formattedDate}</p>
                </div>
                <div className="ticket-popup-field">
                  <p className="ticket-popup-field-label">Subject: </p>
                  <p className="ticket-popup-field-data">{ticket.subject}</p>
                </div>
                <div className="ticket-popup-field">
                  <p className="ticket-popup-field-label">Description: </p>
                  <p className="ticket-popup-field-data">
                    {ticket.description}
                  </p>
                </div>
                <div className="ticket-popup-pictures-container">
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

                <div className="ticket-popup-admin-note">
                  {ticket.status === "open" && (
                    <p className="ticket-popup-admin-note-data">
                      <span>Your support ticket has been received.</span> We're
                      currently reviewing your request. A customer service
                      officer will reach out to you within 2-5 business days.
                      Thank you for your patience as we work to assist you.
                    </p>
                  )}
                  {ticket.status === "in_progress" && (
                    <p className="ticket-popup-admin-note-data">
                      <span>Your ticket is being handled with care.</span> Our
                      team is actively working on your issue. For real-time
                      updates or to chat with us, please check your Chat Room.
                      We're here to help every step of the way.
                    </p>
                  )}
                  {ticket.status === "closed" && (
                    <p className="ticket-popup-admin-note-data">
                      <span>This ticket has been successfully closed.</span> We
                      believe your issue has been resolved. If you experience
                      any further concerns, feel free to reopen the ticket or
                      submit a new request. We’re always here to support you.
                    </p>
                  )}
                </div>

                {ticket.status !== "open" && (
                  <div className="ticket-popup-btns">
                    <PassengerButton
                      name="Chat Room"
                      borderRadius="5px"
                      fontSize="18px"
                      fontWeight="400"
                      onClick={handleChatRoomClick}
                      icon={chatIcon}
                    />
                  </div>
                )}
              </div>
            </>
          )}
          {content === "chatRoom" && (
            <PassengerChatRoom ticketId={ticket._id} />
          )}
        </Modal>
      }
    </>
  );
}
