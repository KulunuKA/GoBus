import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { FaUser, FaRobot } from "react-icons/fa";
import "./style.css";

const socket = io("http://localhost:5000");

const PassengerChatRoom = ({ ticketId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isChatActive, setIsChatActive] = useState(false);
  const sender = "user";

  console.log("Ticket id for chat room : ", ticketId);

  useEffect(() => {
    socket.emit("joinRoom", { ticketId });

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    const fetchChat = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/auth/chatRoom/chat/${ticketId}`
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

  return (
    <div className="chat-container-ps">
      <h2 className="chat-header-ps">Chat Room - Ticket ID: {ticketId}</h2>
      <div className="chat-box-ps">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message-ps ${
              msg.sender === "admin" ? "admin-message-ps" : "user-message-ps"
            }`}
          >
            {msg.sender === "admin" && (
              <div className="sender-icon-ps">
                <FaRobot />
              </div>
            )}
            <div className="message-content-ps">
              <div className="chat-bubble-ps">
                <span>{msg.content}</span>
              </div>
            </div>

            {msg.sender === "user" && (
              <div className="sender-icon-ps">
                <FaUser />
              </div>
            )}
          </div>
        ))}
      </div>

      {isChatActive && (
        <div className="chat-input-container-ps">
          <input
            className="chat-input-ps"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message"
          />
          <button className="send-button-ps" onClick={sendMessage}>
            Send
          </button>
        </div>
      )}
      {!isChatActive && (
        <div className="chat-closed-message-ps">
          This ticket is closed and chat is no longer available under this
          conversation
        </div>
      )}
    </div>
  );
};

export default PassengerChatRoom;
