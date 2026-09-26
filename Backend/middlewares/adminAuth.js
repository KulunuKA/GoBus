const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");

const busOwnerAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findOne({
      _id: decode._id,
      "tokens.token": token,
    });

    if (!admin) {
      throw new Error("Not found!");
    }

    req.admin = admin;
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
