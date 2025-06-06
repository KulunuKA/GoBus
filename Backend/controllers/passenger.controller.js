const Passenger = require("../models/passenger");
const AppError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// passenger register
const registerPassenger = async (req, res, next) => {
  try {
    if (!req.body.username || !req.body.mobile) {
      return next(new AppError(400, "Invalid required fields"));
    }

    const passenger = new Passenger(req.body);
    await passenger.save();

    const { _id: id, username, mobile, email, role } = passenger;
    const token = await passenger.generateAuthToken();

    return res.status(200).send({
      data: {
        id,
        role,
        username,
        mobile,
        email,
        token,
      },
      code: 0,
      msg: "Registration Successfull",
    });
  } catch (error) {
    console.log(error);
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      next(new AppError(409, "User with this email is already registered"));
    } else if (
      error.code === 11000 &&
      error.keyPattern &&
      error.keyPattern.mobile
    ) {
      next(new AppError(409, "User with this mobile is already registered"));
    } else {
      next(new AppError(409, "Server error"));
    }
  }
};

const changePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.passenger._id;

  try {
    const passenger = await Passenger.findById(userId);
    const isMatch = await bcrypt.compare(currentPassword, passenger.password);

    if (!isMatch)
      return res.status(400).send({
        data: "",
        code: 1,
        msg: "Current password is incorrect",
      });

    passenger.password = newPassword;
    await passenger.save();

    res.status(200).send({
      data: passenger,
      code: 0,
      msg: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      data: "",
      code: 2,
      msg: "Server error",
    });
    next(new AppError(500, "Server error"));
  }
};

//update passenger details
const updatePassenger = async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["username", "email", "mobile"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return next(new AppError(400, "Invalid updates"));
    }

    const passenger = await Passenger.findByIdAndUpdate(
      req.passenger._id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!passenger) {
      return next(new AppError(404, "No passenger found"));
    }
    passenger.save();

    const { _id: id, username, mobile, email } = passenger;
    res.status(200).send({
      data: {
        id,
        username,
        mobile,
        email,
      },
      code: 0,
      msg: "updated",
    });
  } catch (error) {
    next(new AppError(400, "Server error"));
  }
};

//delete passenger details
const deletePassenger = async (req, res, next) => {
  try {
    const passenger = await Passenger.findByIdAndDelete(req.params.id);
    const { _id: id, username, mobile, email } = passenger;
    res.status(200).send({
      data: {
        id,
        username,
        mobile,
        email,
      },
      code: 0,
      msg: "deleted",
    });
  } catch (error) {
    next(new AppError(400, "Server error"));
  }
};

module.exports = {
  registerPassenger,
  updatePassenger,
  deletePassenger,
  changePassword,
};
