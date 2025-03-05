const Passenger = require("../models/passenger");
const BusOwner = require("../models/busOwner");
const AppError = require("../utils/appError");

//login passenger and bus owner
const login = async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password) {
      return next(new AppError(400, "Email and password are required"));
    }

    let user = null;

    try {
      user = await Passenger.findByCredentials(
        req.body.email,
        req.body.password
      );
    } catch (error) {
      if (error.statusCode !== 404) {
        return next(new AppError(error.statusCode || 400, error.message));
      }
    }

    if (!user) {
      try {
        user = await BusOwner.findByCredentials(
          req.body.email,
          req.body.password
        );
      } catch (error) {
        return next(new AppError(error.statusCode || 400, error.message));
      }
    }

    if (!user) {
      return next(new AppError(401, "Invalid email or password"));
    }

    let token = await user.generateAuthToken();

    return res.status(200).send({
      code: 0,
      msg: "Login successful",
      data: {
        id: user._id,
        role: user.role,
        authorityName: user.authorityName || null,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        address: user.address,
        logo: user.logo || null,
        busesId: user.busesId || null,
        employeesId: user.employeesId || null,
        routesId: user.routesId || null,
        token,
      },
    });
  } catch (error) {
    next(new AppError(500, "An unexpected error occurred"));
  }
};

module.exports = { login };
