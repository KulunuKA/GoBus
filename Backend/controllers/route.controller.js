const Route = require("../models/route");
const BusOwner = require("../models/busOwner");
const AppError = require("../utils/appError");

const createRoute = async (req, res, next) => {
  try {
    if (
      !req.body.ownerID ||
      !req.body.route_number ||
      !req.body.start ||
      !req.body.end ||
      !req.body.distance ||
      !req.body.main_cities
    ) {
      return next(new AppError(400, "All input is required"));
    }

    const ownerID = req.body.ownerID || req.user?.id;

    const checkOwner = await BusOwner.findOne({ _id: ownerID });

    const route = await Route.create(req.body);

    res.status(201).send({
      msg: "success",
      data: route,
      code: 0,
    });

    if (!checkOwner) {
      return next(new AppError(404, "No owner found with that ID"));
    }
  } catch (error) {
    next(new AppError(500, error.message));
  }
};

//get routes by owner id
const getRoutesByOwner = async (req, res, next) => {
  try {
    const ownerID = req.params.ownerID || req.user?.id;

    const checkOwner = await BusOwner.findOne({ _id: ownerID });

    if (!checkOwner) {
      return next(new AppError(404, "No owner found with that ID"));
    }
    const routes = await Route.find({
      ownerID: ownerID,
    });

    res.status(200).send({
      msg: "success",
      data: routes,
      code: 0,
    });
  } catch (error) {
    next(new AppError(500, error.message));
  }
};

//update route by id
const updateRoute = async (req, res, next) => {
  try {
    const routeID = req.params.routeID;
    const ownerID = req.body.ownerID || req.user?.id;

    const checkOwner = await BusOwner.findOne({ _id: ownerID });

    if (!checkOwner) {
      return next(new AppError(404, "No owner found with that ID"));
    }

    const route = await Route.findOneAndUpdate(
      { _id: routeID, ownerID: ownerID },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!route) {
      return next(new AppError(404, "No route found with that ID"));
    }

    res.status(200).send({
      msg: "success",
      data: route,
      code: 0,
    });
  } catch (error) {
    next(new AppError(500, error.message));
  }
};

//delete route by id
const deleteRoute = async (req, res, next) => {
  try {
    const routeID = req.params.routeID;

    const route = await Route.findOneAndDelete({
      _id: routeID,
    });

    if (!route) {
      return next(new AppError(404, "No route found with that ID"));
    }

    res.status(200).send({
      msg: "success",
      data: route,
      code: 0,
    });
  } catch (error) {
    next(new AppError(500, error.message));
  }
};

module.exports = {
  createRoute,
  getRoutesByOwner,
  updateRoute,
  deleteRoute,
};
