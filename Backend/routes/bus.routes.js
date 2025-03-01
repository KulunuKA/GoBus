const { Router } = require("express");
const {
  addBus,
  updateBus,
  deleteBus,
} = require("../controllers/bus.controller");
const busOwnerAuth = require("../middlewares/busOwnerAuth");
const BusRouter = Router();

BusRouter.post("/add", busOwnerAuth, addBus);
BusRouter.put("/update/:id", busOwnerAuth, updateBus);
BusRouter.delete("/delete/:id", busOwnerAuth, deleteBus);

module.exports = BusRouter;
