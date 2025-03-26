const Trip = require("../models/trip");
const Bus = require("../models/bus");
const BusOwner = require("../models/busOwner");
const AppError = require("../utils/appError");
const { default: mongoose } = require("mongoose");

// Request a trip
const requestTrip = async (req, res, next) => {
  try {
    if (
      !req.body.userID ||
      !req.body.busID ||
      !req.body.date ||
      !req.body.venue ||
      !req.body.contact_no
    ) {
      return next(new AppError(400, "Please provide all the required fields"));
    }

    const bus = await Bus.findById(req.body.busID);
    if (!bus) {
      return next(new AppError(404, "Bus not found"));
    }
    const trip = await Trip.create(req.body);

    res.status(201).send({
      msg: "Success",
      data: {
        trip,
      },
      code: 0,
    });
  } catch (error) {
    console.log(error);
    next(new AppError(500, error.message));
  }
};

// Get all trips by user ID
const getAllTrips = async (req, res, next) => {
  try {
    if (!req.params.userID) {
      return next(new AppError(400, "Please provide the user ID"));
    }
    const trips = await Trip.find({ userID: req.params.userID }).populate(
      "busID",
      "busNumber"
    );
    res.status(200).send({
      msg: "success",
      data: trips,
      code: 0,
    });
  } catch (error) {
    next(new AppError(500, error.message));
  }
};

// Get all trip requests by bus Owner ID
const getTripRequests = async (req, res, next) => {
  try {
    const busOwnerID = req.params.id;
    if (!busOwnerID) {
      return next(new AppError(400, "Please provide the bus owner ID"));
    }

    const checkBusOwner = await BusOwner.findOne({
      _id: busOwnerID,
    });

    if (!checkBusOwner) {
      return next(new AppError(404, "Not found bus owner "));
    }

    const busOwnersBuses = await Bus.find({
      ownerID: busOwnerID,
    });

    const busIDs = busOwnersBuses.map((e) => e._id);
    const objectIds = busIDs.map((id) => mongoose.Types.ObjectId(id));

    const trips = await Trip.find({ _id: { $in: objectIds } });
    res.status(200).send({
      data: trips,
      msg: "",
      code: 0,
    });
  } catch (error) {
    next(new AppError(500, error.message));
  }
};

//delete trip by trip ID
const deleteTrip = async (req, res, next) => {
  try {
    if (!req.params.tripID) {
      return next(new AppError(400, "Please provide the trip ID"));
    }
    const trip = await Trip.findByIdAndDelete(req.params.tripID);
    if (!trip) {
      return next(new AppError(404, "Trip not found"));
    }
    res.status(200).send({
      msg: "success",
      data: {
        trip,
      },
      code: 0,
    });
  } catch (error) {
    next(new AppError(500, error.message));
  }
};

//if the trip is not approved can update
const updateTrip = async (req, res, next) => {
  if (!req.params.tripID) {
    return next(new AppError(400, "Please provide the trip ID"));
  }
  try {
    if (
      !req.body.userID ||
      !req.body.busId ||
      !req.body.date ||
      !req.body.venue ||
      !req.body.contact_no
    ) {
      return next(new AppError(400, "Please provide all the required fields"));
    }
    const bus = await Bus.findById(req.body.busId);
    if (!bus) {
      return next(new AppError(404, "Bus not found"));
    }

    const checkTrip = await Trip.findById(req.params.tripID);
    if (!checkTrip) {
      return next(new AppError(404, "Trip not found"));
    } else if (checkTrip.status === "approved") {
      return next(new AppError(400, "Trip already approved"));
    }

    const trip = await Trip.findByIdAndUpdate(req.params.tripID, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).send({
      msg: "success",
      data: {
        trip,
      },
      code: 0,
    });
  } catch (error) {
    next(new AppError(500, error.message));
  }
};

module.exports = {
  requestTrip,
  getAllTrips,
  deleteTrip,
  updateTrip,
};
