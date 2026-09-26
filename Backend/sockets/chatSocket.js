const Chat = require("../models/chat");

const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected to chat:", socket.id);

    // Join chat room based on ticketId
    socket.on("joinRoom", ({ ticketId }) => {
      socket.join(ticketId);
      console.log(`Socket ${socket.id} joined room ${ticketId}`);
    });

    // Send a new message to the room
    socket.on("sendMessage", async ({ ticketId, sender, content }) => {
      const message = { sender, content, timestamp: new Date() };

      // Save the message to the database
      await Chat.findOneAndUpdate(
        { ticketId },
        { $push: { messages: message } },
        { new: true }
      );

      // Emit message to all clients in the room
      io.to(ticketId).emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected from chat:", socket.id);
    });
  });
};

module.exports = chatSocket;
