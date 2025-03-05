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
  pictures: {
    type: [String],
    validate: [(arr) => arr.length <= 3, "Maximum 3 pictures allowed"],
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  seatNumber: {
    type: String,
    required: true,
  },
  ac: {
    type: Boolean,
    required: true,
  },
  busType: {
    type: String,
    enum: ["public transport", "special service", "both"],
  },
  driverID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    default: null,
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

busSchema.post("save", async function (doc, next) {
  try {
    await mongoose.model("BusOwner").findByIdAndUpdate(doc.ownerID, {
      $addToSet: { busesId: doc._id },
    });
    next();
  } catch (error) {
    next(error);
  }
});

const Bus = mongoose.model("Bus", busSchema);

module.exports = Bus;
