const { Router } = require("express");
const passengerAuth = require("../middlewares/passengerAuth");
const {
  createTicket,
  getUserTickets,
} = require("../controllers/supportTicket.controller");
const SupportTicketRouter = Router();

SupportTicketRouter.post("/createTicket", passengerAuth, createTicket);
SupportTicketRouter.get(
  "/getUserTickets/:userId",
  passengerAuth,
  getUserTickets
);

module.exports = SupportTicketRouter;
