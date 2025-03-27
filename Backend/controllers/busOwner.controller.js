const BusOwner = require("../models/busOwner");
const Trip = require("../models/trip");
const AppError = require("../utils/appError");

//register bus owner
const registerBusOwner = async (req, res, next) => {
  try {
    if (
      !req.body.email ||
      !req.body.password ||
      !req.body.authorityName ||
      !req.body.phone ||
      !req.body.address
    ) {
      return next(new AppError(400, "Please provide all required fields"));
    }

    const busOwner = new BusOwner(req.body);
    await busOwner.save();

    const token = await busOwner.generateAuthToken();

    res.status(201).send({
      code: 0,
      message: "Bus owner registered successfully",
      data: {
        authorityName: busOwner.authorityName,
        email: busOwner.email,
        phone: busOwner.phone,
        address: busOwner.address,
        busesId: busOwner.busesId,
        employeesId: busOwner.employeesId,
        routesId: busOwner.routesId,
        token,
      },
    });
  } catch (error) {
    next(new AppError(400, error.message));
  }
};

//update bus owner
const updateBusOwner = async (req, res, next) => {
  try {
    const busOwner = await BusOwner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!busOwner) {
      return next(new AppError(404, "Bus owner not found"));
    }
    res.status(200).send({
      code: 0,
      message: "Bus owner updated successfully",
      data: {
        authorityName: busOwner.authorityName,
        email: busOwner.email,
        phone: busOwner.phone,
        address: busOwner.address,
        busesId: busOwner.busesId,
        employeesId: busOwner.employeesId,
        routesId: busOwner.routesId,
      },
    });
  } catch (error) {
    next(new AppError(400, error.message));
  }
};

//delete bus owner
const deleteBusOwner = async (req, res, next) => {
  try {
    const busOwner = await BusOwner.findByIdAndDelete(req.params.id);
    if (!busOwner) {
      return next(new AppError(404, "Bus owner not found"));
    }
    res.status(200).send({
      code: 0,
      msg: "Bus owner deleted successfully",
      data: {},
    });
  } catch (error) {
    next(new AppError(400, error.message));
  }
};

//reject or approved trip request
const handleTrip = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return next(new AppError(400, "Please provide the trip ID"));
    }

    if (!req.body.status) {
      return next(new AppError(400, "Please provide the status"));
    }

    const isCheck = await Trip.findById(req.params.id);
    if (!isCheck) {
      return next(new AppError(404, "Trip not found"));
    }

    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    res.status(200).send({
      code: 0,
      msg: "Trip request updated successfully",
      data: { trip },
    });
  } catch (error) {
    next(new AppError(400, error.message));
  }
};

//get trip requests by bus owner's each bus
const getTripRequests = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return next(new AppError(400, "Please provide the bus owner ID"));
    }

    const busOwner = await BusOwner.findById(req.params.id);
    if (!busOwner) {
      return next(new AppError(404, "Bus owner not found"));
    }

    const trips = await Trip.find({ busID: { $in: busOwner.busesId } })
      .populate("userID", "username")
      .populate("busID", "busNumber")
      .lean();

    res.status(200).send({
      code: 0,
      msg: "Trips found successfully",
      data: trips,
    });
  } catch (error) {
    next(new AppError(400, error.message));
  }
};

module.exports = {
  registerBusOwner,
  updateBusOwner,
  deleteBusOwner,
  handleTrip,
  getTripRequests,
};
