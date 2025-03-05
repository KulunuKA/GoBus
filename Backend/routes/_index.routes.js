const { Router } = require("express");
const PassengerRouter = require("./passenger.routes");
const BusRouter = require("./bus.routes");
const FeedbackRouter = require("./feedback.routes");
const EmployeeRouter = require("./employee.routes");
const BusOwnerRouter = require("./busOwner.routes");
const { login } = require("../controllers/user.controller");

const router = Router();

router.post("/login", login);
router.use("/passenger", PassengerRouter);
router.use("/bus", BusRouter);
router.use("/feedback", FeedbackRouter);
router.use("/employee", EmployeeRouter);
router.use("/busowner", BusOwnerRouter);

module.exports = router;
