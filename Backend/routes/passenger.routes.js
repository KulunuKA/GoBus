const { Router } = require("express");
const {
  registerPassenger,
  updatePassenger,
  deletePassenger,
  changePassword,
} = require("../controllers/passenger.controller");
const passengerAuth = require("../middlewares/passengerAuth");
const PassengerRouter = Router();

PassengerRouter.post("/register", registerPassenger);
PassengerRouter.put("/update", passengerAuth, updatePassenger);
PassengerRouter.post("/change-password", passengerAuth, changePassword);
PassengerRouter.delete("/delete/:id", deletePassenger);

module.exports = PassengerRouter;
