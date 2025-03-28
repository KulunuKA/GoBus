const { Router } = require("express");
const {
  addBus,
  updateBus,
  deleteBus,
  getBusesPassenger,
  getBus,
} = require("../controllers/bus.controller");
const busOwnerAuth = require("../middlewares/busOwnerAuth");
const BusRouter = Router();

BusRouter.post("/add", busOwnerAuth, addBus);
BusRouter.put("/update/:id", busOwnerAuth, updateBus);
BusRouter.put("/employee/update/:id", updateBus);
BusRouter.delete("/delete/:id", busOwnerAuth, deleteBus);
BusRouter.get("/get", getBusesPassenger);
BusRouter.get("/get/:id", getBus);

module.exports = BusRouter;
