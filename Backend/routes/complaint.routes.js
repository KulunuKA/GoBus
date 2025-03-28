const { Router } = require("express");
const {
  createComplaint,
  getComplaintsByUser,
  deleteComplaint,
} = require("../controllers/complaint.controller");
const passengerAuth = require("../middlewares/passengerAuth");
const ComplaintRouter = Router();

ComplaintRouter.post("/create", passengerAuth, createComplaint);
ComplaintRouter.get("/get/:userId", passengerAuth, getComplaintsByUser);
ComplaintRouter.delete("/delete/:complaintId", passengerAuth, deleteComplaint);
module.exports = ComplaintRouter;
