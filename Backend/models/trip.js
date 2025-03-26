const mongoose = require("mongoose");
const tripSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Passenger",
    required: true,
  },
  busID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  days: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  contact_no: {
    type: Number,
    required: true,
  },
});

const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip;
