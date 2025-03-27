const mongoose = require("mongoose");
const complaintSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  complaintType: {
    type: String,
    required: true,
  },
  complaint: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    enum: ["Inprogress", "Resolved"],
    type: String,
    default: "Inprogress",
  },
});

const Complaint = mongoose.model("Complaint", complaintSchema);
module.exports = Complaint;
