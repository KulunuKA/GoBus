const { Router } = require("express");
const {
  createRoute,
  getRoutesByOwner,
  updateRoute,
  deleteRoute,
} = require("../controllers/route.controller");
const RouteRouter = Router();

RouteRouter.post("/add", createRoute);
RouteRouter.get("/get/:ownerID", getRoutesByOwner);
RouteRouter.put("/update/:routeID", updateRoute);
RouteRouter.delete("/delete/:routeID", deleteRoute);

module.exports = RouteRouter;
