const { Router } = require("express");
const PassengerRouter = require("./passenger.routes");

const router = Router();

router.use("/passenger", PassengerRouter);

module.exports = router;