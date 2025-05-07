const { Router } = require("express");
const {
  getComplaints,
  complaintResolved,
  getPassengers,
  deletePassenger,
  getSupportTickets,
  supportTicektUpdateInprogress,
  getChats,
  createOrOpenchat,
  getAllChats,
  deactivateChat,
  closeTicket,
} = require("../controllers/admin.controller");
const AdminRouter = Router();

AdminRouter.get("/complaints", getComplaints);
AdminRouter.put("/complaints/:id", complaintResolved);
AdminRouter.get("/passengers", getPassengers);
AdminRouter.delete("/passengers/:id", deletePassenger);
AdminRouter.get("/supportTickets", getSupportTickets);
AdminRouter.put("/supportTickets/:id", supportTicektUpdateInprogress);
AdminRouter.get("/chatRoom/:id", getChats);
AdminRouter.get("/chatRoom", getAllChats);
AdminRouter.put("/chatRoom/:id", createOrOpenchat);
AdminRouter.put("/deactivateChatRooms/:id", deactivateChat);
AdminRouter.put("/closeTickets/:id", closeTicket);

module.exports = AdminRouter;
