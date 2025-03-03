const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const busOwnerSchema = new mongoose.Schema({
  authorityName: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    default:
      "https://th.bing.com/th/id/OIP.hGSCbXlcOjL_9mmzerqAbQHaHa?rs=1&pid=ImgDetMain",
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    min: 10,
    max: 10,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  busesId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
    },
  ],
  employeesId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
  ],
  routesId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
    },
  ],
  tokens: [
    {
      token: {
        type: String,
      },
    },
  ],
});

busOwnerSchema.pre("save", async function (next) {
  const busOwner = this;

  if (busOwner.isModified("password")) {
    busOwner.password = await bcrypt.hash(busOwner.password, 8);
  }

  next();
});

busOwnerSchema.static.findByCredentials = async function (email, password) {
  const busOwner = await BusOwner.findOne({
    email,
  });

  if (!busOwner) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, busOwner.password);

  if (!isMatch) {
    const error = new Error("Incorrect password");
    error.statusCode = 401;
    throw error;
  }

  return busOwner;
};

busOwnerSchema.methods.generateAuthToken = async function () {
  const busOwner = this;
  const token = jwt.sign(
    {
      _id: busOwner._id.toString(),
    },
    process.env.JWT_SECRET
  );

  busOwner.tokens = busOwner.tokens.concat({
    token,
  });

  await busOwner.save();

  return token;
};
const BusOwner = mongoose.model("BusOwner", busOwnerSchema);
module.exports = BusOwner;
