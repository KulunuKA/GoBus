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
  start_trip: {
    type: Boolean,
    default: false,
  },
  route_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
  },
  timetable: [
    {
      round: {
        type: Number,
        required: true,
      },
      startPlace: {
        type: String,
        required: true,
      },
      startTime: {
        type: Date,
        required: true,
      },
      endPlace: {
        type: String,
        required: true,
      },
      endTime: {
        type: Date,
        required: true,
      },
    },
  ],
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

busSchema.post("validate", function (next) {
  if (
    this.busType === "public transport" &&
    (!this.timetable || this.timetable.length === 0)
  ) {
    return next(new Error("Public transport bus must have timetable"));
  }
});

const Bus = mongoose.model("Bus", busSchema);

module.exports = Bus;
