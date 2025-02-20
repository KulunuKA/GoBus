const Passenger = require("../models/passenger");
const jwt = require("jsonwebtoken");

const passengerAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const passenger = await Passenger.findOne({
      _id: decode._id,
      "tokens.token": token,
    });

    if (!passenger) {
      throw new Error("Not found");
    }

    req.passenger = passenger;
    next();
  } catch (error) {
    res.status(403).send({
      data: {},
      code: 1,
      msg: "Unauthorized",
    });
  }
};

module.exports = passengerAuth;
