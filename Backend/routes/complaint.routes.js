const { Router } = require("express");
const { createComplaint, getComplaintsByUser } = require("../controllers/complaint.controller");
const passengerAuth = require("../middlewares/passengerAuth");
const ComplaintRouter = Router();

ComplaintRouter.post("/create", passengerAuth, createComplaint);
ComplaintRouter.get("/get/:userId", passengerAuth, getComplaintsByUser);
module.exports = ComplaintRouter;
