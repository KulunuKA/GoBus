const Ticket = require("../models/supportTicket");
const AppError = require("../utils/appError");

const createTicket = async (req, res, next) => {
  try {
    if (!req.body.userId || !req.body.subject || !req.body.description) {
      return next(new AppError(400, "Invalid required fields"));
    }
    const ticket = new Ticket(req.body);
    await ticket.save();

    res.status(200).send({
      data: ticket,
      code: 0,
      msg: "Ticket Opend",
    });
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError") {
      return next(new AppError(400, error.message));
    }
    return next(new AppError(500, "Server error"));
  }
};

const getUserTickets = async (req, res, next) => {
  try {
    if (!req.params.userId) {
      throw new AppError(400, "Please provide user id");
    }
    const tickets = await Ticket.find({ userId: req.params.userId });

    res.status(200).send({
      data: tickets,

      code: 0,
      msg: "User Tickets fetched successfully",
    });
  } catch (error) {
    next(new AppError(400, error.message));
  }
};

module.exports = { createTicket, getUserTickets };
