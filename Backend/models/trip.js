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
    enum: ["requested", "approved", "rejected"],
    default: "requested",
  },
  contact_no: {
    type: Number,
    required: true,
  },
});

const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip;
