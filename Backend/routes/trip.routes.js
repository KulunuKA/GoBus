const { Router } = require("express");
const passengerAuth = require("../middlewares/passengerAuth");
const {
  requestTrip,
  getAllTrips,
  deleteTrip,
  updateTrip,
} = require("../controllers/trip.controller");
const TripRouter = Router();

TripRouter.post("/request", passengerAuth, requestTrip);
TripRouter.get("/all/:userID", passengerAuth, getAllTrips);
TripRouter.delete("/delete/:tripID", passengerAuth, deleteTrip);
TripRouter.put("/update/:tripID", passengerAuth, updateTrip);

module.exports = TripRouter;
