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

employeeSchema.post("save", async function (doc, next) {
  try {
    await mongoose.model("BusOwner").findByIdAndUpdate(doc.ownerID, {
      $addToSet: { employeesId: doc._id },
    });
    next();
  } catch (error) {}
});

employeeSchema.post("deleteOne", async function (doc, next) {
  try {
    await mongoose.model("BusOwner").findByIdAndUpdate(doc.ownerID, {
      $pull: { employeesId: doc._id },
    });
    next();
  } catch (error) {
    next(error);
  }
});

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
