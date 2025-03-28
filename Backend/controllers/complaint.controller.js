const Complaint = require("../models/complaint");
const AppError = require("../utils/appError");

const createComplaint = async (req, res, next) => {
  try {
    if (!req.body.complaintType || !req.body.complaint) {
      throw new AppError(400, "Please provide complaint type and complaint");
    }
    const complaint = await Complaint.create(req.body);

    res.status(201).send({
      data: {
        complaint,
      },
      code: 0,
      msg: "Complaint created successfully",
    });
  } catch (error) {
    next(new AppError(400, error.message));
  }
};

//get complaints by user
const getComplaintsByUser = async (req, res, next) => {
  try {
    if (!req.params.userId) {
      throw new AppError(400, "Please provide user id");
    }
    const complaints = await Complaint.find({ userID: req.params.userId });

    res.status(200).send({
      data: complaints,

      code: 0,
      msg: "Complaints fetched successfully",
    });
  } catch (error) {
    next(new AppError(400, error.message));
  }
};

//if complaint resolved ,delete complaint by id
const deleteComplaint = async (req, res, next) => {
  try {
    if (!req.params.complaintId) {
      throw new AppError(400, "Please provide complaint id");
    }
    const complaint = await Complaint.findByIdAndDelete(req.params.complaintId);
    if (!complaint) {
      throw new AppError(404, "Complaint not found");
    }
    res.status(200).send({
      data: complaint,
      code: 0,
      msg: "Complaint deleted successfully",
    });
  } catch (error) {
    next(new AppError(400, error.message));
  }
};

module.exports = {
  createComplaint,
  getComplaintsByUser,
  deleteComplaint,
};
