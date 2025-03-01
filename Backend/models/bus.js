const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  ownerID: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  busNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
  seatNumber: {
    type: String,
    required: true,
  },
  busType: {
    type: String,
    enum: ["public transport", "special service"],
  },
  driverID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  tripID: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
      },
    },
  ],
});

const Bus = mongoose.model("Bus", busSchema);

module.exports = Bus;
