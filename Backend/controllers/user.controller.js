const Passenger = require("../models/passenger");
const BusOwner = require("../models/busOwner");
const AppError = require("../utils/appError");

//login passenger and bus owner
const login = async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password) {
      return next(new AppError(400, "Email and password are required"));
    }
    let user = await Passenger.findByCredentials(
      req.body.email,
      req.body.password
    );

    if (!user) {
      user = await BusOwner.findByCredentials(
        req.body.email,
        req.body.password
      );

      let token = await user.generateAuthToken();
      return res.status(200).send({
        code: 0,
        msg: "Login successful",
        data: {
          id: user._id,
          role: user.role,
          authorityName: user.authorityName,
          email: user.email,
          name: user.name,
          mobile: user.mobile,
          address: user.address,
          logo: user.logo,
          busesId: user.busesId,
          employeesId: user.employeesId,
          routesId: user.routesId,
          token,
        },
      });
    }

    const { _id: id, email, name, mobile, address, role } = user;

    let token = await user.generateAuthToken();

    res.status(200).send({
      code: 0,
      msg: "Login successful",
      data: {
        id,
        email,
        name,
        mobile,
        address,
        role,
        token,
      },
    });
  } catch (error) {
    next(new AppError(400, error.message));
  }
};

module.exports = { login };
