const Feedback = require("../models/feedback");
const Bus = require("../models/bus");
const AppError = require("../utils/appError");

// Create a new feedback
const createFeedback = async (req, res, next) => {
  try {
    if (
      !req.body.feedback ||
      !req.body.rating ||
      !req.body.user_id ||
      !req.body.bus_id
    ) {
      return next(new AppError(400, "Please provide feedback, rating, userId"));
    }

    const feedback = await Feedback.create(req.body);

    res.status(201).send({
      msg: "add feedback successfully",
      data: feedback,
      code: 0,
    });
  } catch (error) {
    next(new AppError(400, error.message));
  }
};

// Get all feedbacks
const getFeedbacks = async (req, res, next) => {
  try {

    if (!req.params.id) {
      return next(new AppError("Please provide bus id", 400));
    }

    //get user's feedbacks and user'name
    const feedbacks = await Feedback.find({ bus_id: req.params.id }).populate(
      "user_id",
      "username"
    );

    // const bus = await Bus.findById(req.params.id).populate("driverID");
    // if (!bus) {
    //   return next(new AppError("No bus found with that ID", 404));
    // }
    // const driver = bus.driverID;
    // const driverFeedbacks = await Feedback.find({ driver_id: driver._id });
    // const driverRating = driverFeedbacks.reduce((acc, feedback) => {
    //   return acc + feedback.rating;
    // }, 0);
    // const driverAverageRating = driverFeedbacks.length
    //   ? driverRating / driverFeedbacks.length
    //   : 0;
    // bus.driverID.averageRating = driverAverageRating;

    res.status(200).send({
      msg: "get feedbacks successfully",
      data: feedbacks,
      code: 0,
    });
  } catch (error) {
    console.log(error);
    next(new AppError(error.message, 400));
  }
};

//Get single passenger's all feedbacks
const getFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.find({ userID: req.params.id });
    if (!feedback.length) {
      return next(new AppError("No feedback found for this passenger", 404));
    }

    res.status(200).send({
      msg: "get feedback successfully",
      data: {
        feedback,
      },
      code: 0,
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

//delete feedback
const deleteFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return next(new AppError("No feedback found with that ID", 404));
    }

    res.status(204).send({
      msg: "delete feedback successfully",
      data: null,
      code: 0,
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

//update feedback
const updateFeedback = async (req, res, next) => {
  try {
    if (!req.body.busID || !req.body.feedback || !req.body.rating) {
      return next(
        new AppError(
          400,
          "Please provide required fields (busID, feedback, rating)"
        )
      );
    }

    const bus = await Bus.findById(req.body.busID);

    if (!bus) {
      return next(new AppError(404, "No bus found"));
    }

    const feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!feedback) {
      return next(new AppError("No feedback found with that ID", 404));
    }

    res.status(200).send({
      msg: "update feedback successfully",
      data: {
        feedback,
      },
      code: 0,
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

module.exports = {
  createFeedback,
  getFeedbacks,
  getFeedback,
  deleteFeedback,
  updateFeedback,
};
