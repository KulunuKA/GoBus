import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./style.css";
import { FaUser, FaRobot } from "react-icons/fa";
import { AiOutlineFileDone } from "react-icons/ai";
import { closeTicketAD, deactivateChatAD } from "../../apis/adminAPIs";

const socket = io("http://localhost:5000");

const ChatPageAdmin = () => {
  const { ticketId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isChatActive, setIsChatActive] = useState(false);
  const sender = "admin";

  console.log("Ticket id for chat room : ", ticketId);

  useEffect(() => {
    socket.emit("joinRoom", { ticketId });

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    const fetchChat = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/auth/admin/chatRoom/${ticketId}`
        );
        console.log("Old messages are: ", res.data);
        setMessages(res.data.data?.messages || []);
        setIsChatActive(res.data.data?.isActive !== false);
      } catch (err) {
        console.error("Error fetching chat messages:", err);
        setMessages([]);
        setIsChatActive(false);
      }
    };

    fetchChat();

    return () => {
      socket.off("receiveMessage");
    };
  }, [ticketId]);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("sendMessage", { ticketId, sender, content: input });
      setInput("");
    }
  };

  const handleCloseTicket = async () => {
    try {
      const deactivateChat = await deactivateChatAD(ticketId, {
        isActive: false,
      });

      setIsChatActive(false);
      console.log("Chat closed successfully ", deactivateChat);

      const updateResult = await closeTicketAD(ticketId, {
        status: "closed",
      });
      console.log("Ticket close update result:", updateResult);
    } catch (error) {
      console.error("Error closing ticket:", error);
      alert("Failed to close ticket.");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat Room - Ticket ID: {ticketId}</h2>
        {isChatActive && (
          <button className="close-button" onClick={handleCloseTicket}>
            <AiOutlineFileDone /> Close Ticket
          </button>
        )}
      </div>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${
              msg.sender === "admin" ? "admin-message" : "user-message"
            }`}
          >
            {msg.sender === "user" && (
              <div className="sender-icon">
                <FaUser />
              </div>
            )}
            <div className="message-content">
              <div className="chat-bubble">
                <span>{msg.content}</span>
              </div>
            </div>

            {msg.sender === "admin" && (
              <div className="sender-icon">
                <FaRobot />
              </div>
            )}
          </div>
        ))}
      </div>
      {isChatActive && (
        <div className="chat-input-container">
          <input
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message"
          />
          <button className="send-button" onClick={sendMessage}>
            Send
          </button>
        </div>
      )}
      {!isChatActive && (
        <div className="chat-closed-message">Ticket Closed</div>
      )}
    </div>
  );
};

export default ChatPageAdmin;
