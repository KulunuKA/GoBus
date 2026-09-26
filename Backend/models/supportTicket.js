const mongoose = require("mongoose");
const supportTicketSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    subject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    pictures: {
      type: [String],
    },
    status: {
      type: String,
      default: "open",
      enum: ["open", "in_progress", "closed"],
    },
  },
  { timestamps: true }
);

const SupportTicket = mongoose.model("SupportTicket", supportTicketSchema);
module.exports = SupportTicket;
