const { Router } = require("express");
const busOwnerAuth = require("../middlewares/busOwnerAuth");
const {
  handleTrip,
  registerBusOwner,
  updateBusOwner,
  deleteBusOwner,
  getTripRequests,
} = require("../controllers/busOwner.controller");
const { getBuses } = require("../controllers/bus.controller");
const BusOwnerRouter = Router();

BusOwnerRouter.post("/register", registerBusOwner);
BusOwnerRouter.put("/update/:id", busOwnerAuth, updateBusOwner);
BusOwnerRouter.delete("/delete/:id", busOwnerAuth, deleteBusOwner);
BusOwnerRouter.put("/trip/:id", busOwnerAuth, handleTrip);
BusOwnerRouter.get("/trip/:id", busOwnerAuth, getTripRequests);
BusOwnerRouter.get("/getbuses/:id", busOwnerAuth, getBuses);

module.exports = BusOwnerRouter;
