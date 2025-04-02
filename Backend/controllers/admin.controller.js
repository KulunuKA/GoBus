const Complaint = require("../models/complaint");
const Passenger = require("../models/passenger");
const AppError = require("../utils/appError");

const getComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find();
    res.status(201).send({
      data: complaints,
      msg: "Complaints fetched successfully",
      code: 0,
    });
  } catch (error) {
    next(new AppError(400, error.message));
  }
};

//mark as read
const complaintResolved = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return next(new AppError("Please provide complaint id"));
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    );

    if (!complaint) {
      return next(new AppError("No complaint found with that ID", 404));
    }

    res.status(200).send({
      data: { complaint },
      msg: "Complaint resolved successfully",
      code: 0,
    });
  } catch (error) {
    next(new AppError(500, error.message));
  }
};

const getPassengers = async (req, res, next) => {
  try {
    const passengers = await Passenger.find();
    res.status(201).send({
      data: passengers,
      msg: "Passengers fetched successfully",
      code: 0,
    });
  } catch (error) {
    next(new AppError(400, error.message));
  }
};

const deletePassenger = async (req, res, next) => {
  try {
    const passenger = await Passenger.findByIdAndDelete(req.params.id);
    if (!passenger) {
      return next(new AppError("No passenger found with that ID", 404));
    }
    res.status(200).send({
      data:  passenger ,
      msg: "Passenger deleted successfully",
      code: 0,
    });
  } catch (error) {
    next(new AppError(500, error.message));
  }
};
module.exports = {
  getComplaints,
  complaintResolved,
  getPassengers,
  deletePassenger,
};
