const mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema({
  ownerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BusOwner",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["assign", "unassign"],
    default: "unassign",
  },
});

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
