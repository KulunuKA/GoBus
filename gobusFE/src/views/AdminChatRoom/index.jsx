import React, { useState, useEffect } from "react";
import "./style.css";
import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import MyInput from "../../components/input";
import { getAllChatsAD } from "../../apis/adminAPIs";
import moment from "moment";
import { Link } from "react-router-dom"; 

export default function AdminChatRoom() {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [isAdd, setIsAdd] = useState(false);

  const fetchChats = async () => {
    try {
      setIsError("");
      setLoading(true);
      const { data, code, msg } = await getAllChatsAD();
      if (code === 0) {
        setChats(data);
        setFilteredChats(data);
      } else {
        setIsError(msg || "Failed to fetch chats.");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setIsError("Something went wrong!");
      console.error("Error fetching chats:", error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    const filtered = chats.filter((chat) =>
      chat?.ticketId
        ?.toString()
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
    setFilteredChats(filtered);
  }, [searchText, chats]);

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "Never";
    return moment(timestamp).fromNow();
  };

 
  const getLastMessageTime = (chat) => {
    if (chat.messages && chat.messages.length > 0) {
      return new Date(chat.messages[chat.messages.length - 1].timestamp);
    }
    return new Date(chat.createdAt); 
  };

 
  const sortedChats = [...filteredChats].sort((a, b) => {
    const timeA = getLastMessageTime(a);
    const timeB = getLastMessageTime(b);
    return timeB - timeA; 
  });

  if (loading) {
    return <div>Loading chats...</div>;
  }

  if (isError) {
    return <div>Error: {isError}</div>;
  }

  return (
    <div className="admin-chat-room">
      <div className="pm-header">
        <h1>Support Chat Room</h1>
      </div>
      <div className="pm-body">
        <div className="pm-body-header">
          <div className="search-input">
            <MyInput
              placeholder="Search by ticket ID"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              height=""
            />
          </div>
        </div>
        <div className="chat-list">
          {sortedChats.map((chat) => (
            <Link
              key={chat._id}
              to={`/administrator/chatRoom/${chat.ticketId}`}
              className="chat-item-link"
            >
              <div className="chat-item">
                <div className="chat-item-details">
                  <div className="detail-row">
                    <span className="detail-label">Chat ID:</span>
                    <span className="detail-value">
                      {chat._id.substring(0, 8)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Ticket ID:</span>
                    <span className="detail-value">{chat.ticketId}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">User ID:</span>
                    <span className="detail-value">{chat.userId}</span>
                  </div>
                </div>
                <div className="chat-item-time">
                  <div className="time-row">
                    <span className="time-label">Started:</span>
                    <span className="time-value">
                      {moment(chat.createdAt).format("YYYY-MM-DD HH:mm")} (
                      {formatTimeAgo(chat.createdAt)})
                    </span>
                  </div>
                  <div className="time-row">
                    <span className="time-label">Last Message:</span>
                    <span className="time-value">
                      {chat.messages && chat.messages.length > 0
                        ? `${formatTimeAgo(
                            chat.messages[chat.messages.length - 1].timestamp
                          )}`
                        : "No messages"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {filteredChats.length === 0 && !loading && (
            <div className="no-chats">No chats found.</div>
          )}
        </div>
      </div>
      {isAdd && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create New Chat</h2>
            <button onClick={() => setIsAdd(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
