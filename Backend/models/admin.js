const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide your name"],
  },
  password: {
    type: String,
    required: [true, "Please provide your password"],
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

adminSchema.statics.findByCredentials = async (email, password) => {
  const admin = await Admin.findOne({ email });
  if (!admin) {
    const error = new Error("Admin not found");
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    const error = new Error("Incorrect password");
    error.statusCode = 401;
    throw error;
  }

  return admin;
};

adminSchema.methods.generateAuthToken = async function () {
  const admin = this;

  const token = jwt.sign({ _id: admin._id.toString() }, process.env.JWT_SECRET);

  admin.tokens = admin.tokens.concat({ token });
  await admin.save();

  return token;
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
