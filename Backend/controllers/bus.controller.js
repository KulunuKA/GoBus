const Bus = require("../models/bus");
const AppError = require("../utils/appError");

//add bus
const addBus = async (req, res, next) => {
  try {
    if (
      !req.body.ownerID ||
      !req.body.name ||
      !req.body.busNumber ||
      !req.body.password ||
      !req.body.pictures ||
      !req.body.seatNumber ||
      !req.body.busType ||
      !req.body.district ||
      !req.body.city
    ) {
      return next(new AppError(400, "Invalid required fields"));
    }

    const bus = new Bus(req.body);
    await bus.save();

    res.status(200).send({
      data: bus,
      code: 0,
      msg: "Added bus",
    });
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError") {
      return next(new AppError(400, error.message));
    }
    return next(new AppError(500, "Server error"));
  }
};

//update bus
const updateBusStatus = async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);

    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bus) {
      return next(new AppError(404, "No found bus"));
    }
    await bus.save();

    res.status(200).send({
      data: { bus },
      code: 0,
      msg: "Updated",
    });
  } catch (error) {
    console.log(error)
    if (error.name === "ValidationError") {
      return next(new AppError(400, error.message));
    }
    return next(new AppError(500, "Server error"));
  }
};

//delete bus
const deleteBus = async (req, res, next) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);

    if (!bus) {
      return next(new AppError(404, "Bus not found"));
    }

    res.status(200).send({
      data: {},
      code: 0,
      msg: "Bus deleted",
    });
  } catch (error) {
    next(new AppError(400, "Server error"));
  }
};

//get buses by owner id
const getBuses = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return next(new AppError(400, "Invalid owner id"));
    }
    const buses = await Bus.find({ ownerID: req.params.id })
      .populate("route_id", "route_number")
      .populate("driverID", "name phone");

    res.status(200).send({
      data: buses,
      code: 0,
      msg: "Get buses",
    });
  } catch (error) {
    next(new AppError(500, "Server error"));
  }
};

//get buses by type
const getBusesPassenger = async (req, res, next) => {
  try {
    let query = {};
    if (req.query.type) query.busType = req.query.type;
    if (req.query.district) query.district = req.query.district;
    if (req.query.city) query.city = req.query.city;
    if (req.query.ac) query.ac = req.query.ac;

    let buses = await Bus.find(query)
      .populate("ownerID", "authorityName")
      .populate("route_id", "main_cities");

    if (req.query.start && req.query.end) {
      buses = buses.filter((bus) => {
        if (!bus.route_id) return false;
        const cities = bus.route_id.main_cities;
        const city1 = cities.includes(req.query.start);
        const city2 = cities.includes(req.query.end);
        return city1 && city2;
      });
    }

    res.status(200).send({
      data: buses,
      code: 0,
      msg: "Get buses",
    });
  } catch (error) {
    console.error("Error fetching buses:", error);
    next(new AppError(500, "Server error"));
  }
};

//get single bus
const getBus = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return next(new AppError(400, "Invalid bus id"));
    }

    const bus = await Bus.findById(req.params.id)
      .populate("ownerID", "authorityName email phone address logo")
      .populate("route_id", "")
      .populate("driverID", "name phone");

    if (!bus) {
      return next(new AppError(404, "Bus not found"));
    }

    res.status(200).send({
      data: bus,
      code: 0,
      msg: "Get bus",
    });
  } catch (error) {
    next(new AppError(500, "Server error"));
  }
};

module.exports = {
  addBus,
  updateBusStatus,
  deleteBus,
  getBuses,
  getBusesPassenger,
  getBus,
};
