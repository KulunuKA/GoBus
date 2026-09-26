const { Router } = require("express");
const PassengerRouter = require("./passenger.routes");
const BusRouter = require("./bus.routes");
const FeedbackRouter = require("./feedback.routes");
const EmployeeRouter = require("./employee.routes");
const BusOwnerRouter = require("./busOwner.routes");
const { login } = require("../controllers/user.controller");
const RouteRouter = require("./route.routes");
const TripRouter = require("./trip.routes");
const ComplaintRouter = require("./complaint.routes");
const AdminRouter = require("./admin.routes");
const SupportTicketRouter = require("./supportTicket.routes");
const ChatRouter = require("./chat.routes");

const router = Router();

router.post("/login", login);
router.use("/passenger", PassengerRouter);
router.use("/bus", BusRouter);
router.use("/feedback", FeedbackRouter);
router.use("/employee", EmployeeRouter);
router.use("/busowner", BusOwnerRouter);
router.use("/route", RouteRouter);
router.use("/trip", TripRouter);
router.use("/complaint", ComplaintRouter);
router.use("/customer-supports", SupportTicketRouter);
router.use("/chatRoom", ChatRouter);

//admin
router.use("/admin", AdminRouter);

module.exports = router;
