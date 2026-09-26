
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SupportTicket",
      required: [true, "A chat must be associated with a ticket"],
      unique: true,
    },
    
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: [true, "A chat must be associated with a user"],
    },
    messages: [
      {
        sender: {
          type: String,
          required: [true, "A message must have a sender"],
          enum: ["admin", "user"],
        },
        content: {
          type: String,
          required: [true, "A message must have content"],
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
