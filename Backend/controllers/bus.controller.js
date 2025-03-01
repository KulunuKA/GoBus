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
      !req.body.picture ||
      !req.body.seatNumber ||
      !req.body.busType
    ) {
      return next(new AppError(400, "Invalid required fields"));
    }

    const bus = new Bus(req.body);
    await bus.save();

    res.status(200).send({
      data: { bus },
      code: 0,
      msg: "Added bus",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return next(new AppError(400, error.message));
    }
    return next(new AppError(500, "Server error"));
  }
};

//update bus
const updateBus = async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "name",
      "busNumber",
      "password",
      "picture",
      "seatNumber",
      "busType",
      "driverID",
    ];
    const isValidOperation = allowedUpdates.every(() => {
      allowedUpdates.includes(updates);
    });

    if (!isValidOperation) {
      return next(new AppError(400, "Invalid updates"));
    }

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
      msg: "deleted",
    });
  } catch (error) {
    next(new AppError(400, "Server error"));
  }
};

module.exports = { addBus, updateBus, deleteBus };
