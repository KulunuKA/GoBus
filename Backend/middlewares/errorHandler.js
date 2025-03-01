const AppError = require("../utils/appError");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.isOperational ? err.message : "Internal Server Error";

  res.status(statusCode).send({
    data: {},
    msg: message,
    code: 0,
  });
};

module.exports = errorHandler;
