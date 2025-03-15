const BusOwner = require("../models/busOwner");
const jwt = require("jsonwebtoken");

const busOwnerAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const busOwner = await BusOwner.findOne({
      _id: decode._id,
      "tokens.token": token,
    });

    if (!busOwner) {
      throw new Error("Not found!");
    }

    req.busOwner = busOwner;
    next();
    
  } catch (error) {
    res.status(403).send({
      data: {},
      code: 1,
      msg: "Unauthorized",
    });
  }
};

module.exports = busOwnerAuth;
