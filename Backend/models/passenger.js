const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const passengerSchema = new mongoose.Schema({
  role: {
    type: String,
    default: "Passenger",
  },
  username: {
    type: String,
    required: true,
  },
  //TODO: email should be unique both of Passenger and BusOwner
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    unique: true,
    min: 10,
    max: 10,
  },
  tokens: [
    {
      token: {
        type: String,
      },
    },
  ],
});

passengerSchema.pre("save", async function (next) {
  const passenger = this;

  if (passenger.isModified("password")) {
    passenger.password = await bcrypt.hash(passenger.password, 8);
  }

  next();
});

passengerSchema.statics.findByCredentials = async (email, password) => {
  const passenger = await Passenger.findOne({ email });
  if (!passenger) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, passenger.password);

  if (!isMatch) {
    const error = new Error("Incorrect password");
    error.statusCode = 401;
    throw error;
  }

  return passenger;
};

passengerSchema.methods.generateAuthToken = async function () {
  const passenger = this;

  const token = jwt.sign(
    { _id: passenger._id.toString() },
    process.env.JWT_SECRET
  );

  passenger.tokens = passenger.tokens.concat({ token });
  await passenger.save();

  return token;
};

const Passenger = mongoose.model("Passenger", passengerSchema);

module.exports = Passenger;
